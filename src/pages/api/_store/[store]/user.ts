import { withSession } from "libs/session";
import prisma from "libs/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

const LOG_TAG = "[store-customer-user]";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { method, query } = req;

      switch (method) {
        case "GET": {
          const { data: session } = req.session;
          console.log(LOG_TAG, "fetch customer details", { session, query });

          if (!session || !session.userId) {
            console.warn(LOG_TAG, "no logged in user found", {
              session,
              query,
            });
            return res.send({
              user: null,
              isOwner: false,
              cart: {
                items: [],
                total: 0,
              },
            });
          }

          const responseData = {
            user: session,
            isOwner: false,
            cart: {
              items: [] as any[],
              total: 0,
            },
          };

          // check if it's store owner
          const store = await prisma.store.findFirst({
            where: {
              name: query.store as string,
              owner: {
                id: session.userId,
              },
            },
          });
          responseData.isOwner = !!store;

          // look for current cart
          const cart = await prisma.cart.findFirst({
            where: {
              owner: {
                id: session.userId,
              },
              store: {
                name: query.store as string,
              },
            },
          });
          if (cart && (cart?.items as any)?.length) {
            const cartItems = cart.items as any[];
            const cartIds = cartItems.map((c) => c.productId);
            const products = await prisma.product.findMany({
              where: {
                Store: {
                  name: query.store as string,
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
              const cart = cartItems.find(
                (item) => item.productId === product.id
              );
              return acc + cart.quantity * product.price;
            }, 0);

            responseData.cart = {
              items: cartItems,
              total,
            };
          }

          console.log(LOG_TAG, "returning user data", responseData);
          return res.status(200).send(responseData);
        }
        default:
          console.log(LOG_TAG, "[error]", "unauthorized method", method);
          return res.status(500).send({ error: "unauthorized method" });
      }
    } catch (error) {
      console.log(LOG_TAG, "[error]", "general error", {
        name: (error as any).name,
        message: (error as any).message,
        stack: (error as any).stack,
      });

      return res.status(500).send({ error: "request failed" });
    }
  }
);
