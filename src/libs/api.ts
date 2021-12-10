export default function Api() {
  const request = async (path: string, options: any = {}) => {
    const pathWithSlash = `${path.charAt(0) !== "/" ? "/" : ""}${path}`;
    const response = await fetch(pathWithSlash, options);

    let payload;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("json")) {
      payload = await response.json();
    } else if (contentType?.includes("text")) {
      payload = await response.text();
    } else {
      payload = response.body;
    }

    if (!response.ok) {
      console.log({ payload, response });
      throw new Error(
        `${options.method} ${pathWithSlash} - ${response.statusText}`
      );
    }

    return { payload, response };
  };

  return {
    get: (path: string) => request(path, { method: "GET" }),
    post: (path: string, payload: any = {}, options: any = {}) =>
      request(path, {
        ...options,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
  };
}
