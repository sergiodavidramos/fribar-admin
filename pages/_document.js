// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="theme-color" content="#ff5a09"></meta>
          <link rel="icon" href="/img/icon5.svg" />
          {/* Styles */}
          <link href="css/styles.css" rel="stylesheet" />
          <link href="css/admin-style.css" rel="stylesheet" />
          {/* Vendor styles */}
          <link
            href="/vendor/bootstrap/css/bootstrap.min.css"
            rel="stylesheet"
          />
          <link
            href="/vendor/fontawesome-free/css/all.min.css"
            rel="stylesheet"
          />
        </Head>
        <body className="sb-nav-fixed">
          <Main />
          <NextScript />
          <script src="/js/jquery-3.4.1.min.js"></script>
          <script src="/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
          {/* <script src="/vendor/chart/highcharts.js"></script>
          <script src="/vendor/chart/exporting.js"></script>
          <script src="/vendor/chart/export-data.js"></script>
          <script src="/vendor/chart/accessibility.js"></script> */}
          <script src="/js/scripts.js"></script>
          {/* <script src="/js/chart.js"></script> */}
        </body>
      </Html>
    )
  }
}

export default MyDocument
