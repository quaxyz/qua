function toQuery(params: any, delimiter = "&") {
  const keys = Object.keys(params);

  return keys.reduce((str, key, index) => {
    let query = `${str}${key}=${params[key]}`;

    if (index < keys.length - 1) {
      query += delimiter;
    }

    return query;
  }, "");
}

function toParams(query: string) {
  const q = query.replace(/^\??\//, "");

  return q.split("&").reduce((values: any, param) => {
    const [key, value] = param.split("=");

    values[key] = value;

    return values;
  }, {});
}

class PopupWindow {
  id: string;
  url: string;
  options: any;
  interval?: number;
  messageHandler?: (e: MessageEvent) => void;

  window?: Window | null;

  promise?: Promise<any>;

  constructor(id: string, url: string, options = {}) {
    this.id = id;
    this.url = url;
    this.options = options;
  }

  open() {
    const {
      url,
      id,
      options: { withHash, redirect_origin, ...options },
    } = this;

    this.window = window.open(url, id, toQuery(options, ","));
  }

  close() {
    this.cancel();
    this.window?.close();
    if (this.messageHandler) {
      window.removeEventListener("message", this.messageHandler);
    }
  }

  poll() {
    this.promise = new Promise((resolve, reject) => {
      // listen for popup close
      this.interval = window.setInterval(() => {
        const popup = this.window;
        if (!popup || popup.closed !== false) {
          this.close();
          reject(new Error("The popup was closed"));
          return;
        }
      }, 1000);

      // listen for message from popup
      this.messageHandler = (e: MessageEvent) => {
        if (e.origin !== this.options.redirect_origin) return;
        if (e.data.code !== "oauth2_login_success") return;

        const params = toParams(
          e.data.search.replace(this.options.withHash ? /^#/ : /^\?/, "")
        );
        resolve(params);
        this.close();
      };
      window.addEventListener("message", this.messageHandler);
    });
  }

  cancel() {
    if (this.interval) {
      window.clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  static open(id: string, url: string, options = {}) {
    const popup = new this(id, url, options);

    popup.open();
    popup.poll();

    return popup.promise;
  }
}

export default PopupWindow;
