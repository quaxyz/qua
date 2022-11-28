declare global {
  var gtag: (...args: any[]) => void;
}

const pageView = (url: string) => {
  global.gtag("config", process.env.NEXT_PUBLIC_GA_ID, { page_path: url });
};

const event = (opts: {
  action: string;
  category: string;
  label?: string;
  value?: string;
}) => {
  global.gtag("event", opts.action, {
    event_category: opts.category,
    event_label: opts.category,
    value: opts.value,
  });
};

const GA = {
  pageView,
  event,
};

export default GA;
