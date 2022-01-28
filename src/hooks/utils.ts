import { useRouter } from "next/router";

export function useGetLink() {
  const router = useRouter();

  return (href: string) => {
    const pathPrefix =
      process.env.NODE_ENV !== "production"
        ? `/_store/${router.query.store}`
        : ``;

    return `${pathPrefix}${href.charAt(0) !== "/" ? "/" : ""}${href}`;
  };
}
