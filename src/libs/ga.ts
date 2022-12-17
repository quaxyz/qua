declare global {
  var gtag: (...args: any[]) => void;
}

const pageView = (url: string) => {
  global.gtag("config", process.env.NEXT_PUBLIC_GA_ID, { page_path: url });
};

const event = (name: string, opts: any) => {
  global.gtag("event", name, opts);
};

const GA = {
  pageView,
  event,
};

export default GA;
