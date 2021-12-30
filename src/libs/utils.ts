export function truncateAddress(address: string, length: number): string {
  return `${address.substring(0, length + 2)}...${address.substring(
    address.length - length,
    address.length
  )}`;
}

export function mapSocialLink(social: string, link: string) {
  return {
    instagram: `https://www.instagram.com/${link.replace("@", "")}`,
    whatsapp: `https://wa.me/${link.replace("+", "")}`,
  }[social || "default"];
}
