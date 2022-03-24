import prisma from "libs/prisma";
import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";

export async function getLayoutProps(
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) {
  const storeName = ctx.params?.store as string;
  const sessionData = ctx.req?.session.data;

  let props: any = {};
  const store = await prisma.store.findUnique({
    where: { name: storeName },
    include: { owner: true },
  });

  if (!store) {
    return null;
  }

  props = {
    isLoggedIn: !!sessionData?.userId,
    isOwner: store.owner?.id === sessionData?.userId,
  };

  if (!props.isLoggedIn) {
    return props;
  }

  // fetch cart details
  const cart = await prisma.cart.findFirst({
    where: {
      owner: {
        id: sessionData?.userId,
      },
      store: {
        name: storeName,
      },
    },
  });

  if (!cart || !(cart?.items as any)?.length) {
    props.cart = {
      items: [],
      total: 0,
    };
    return props;
  }

  const cartItems = cart.items as any[];
  const cartIds = cartItems.map((c) => c.productId);
  const products = await prisma.product.findMany({
    where: {
      Store: {
        name: storeName,
      },
      id: {
        in: cartIds,
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
      totalStocks: true,
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
    },
  });

  const total = products.reduce((acc, product) => {
    const cart = cartItems.find((item) => item.productId === product.id);
    return acc + cart.quantity * product.price;
  }, 0);

  props.cart = {
    items: cartItems,
    total,
  };

  return props;
}
