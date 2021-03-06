import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@700&family=Inter:wght@400;500;600;700;900&display=swap"
            rel="stylesheet"
          />
        </Head>

        <body>
          <Main />
          <NextScript />
          <script
            src="https://accounts.google.com/gsi/client"
            async
            defer
          ></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
