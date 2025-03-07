import { Head, Html, Main, NextScript } from "next/document"


export default function Document() {
  return (
    <Html suppressHydrationWarning>
      <Head />

  <body style={{
    backgroundImage: "url('/background.png')", /* Add your image path */
    backgroundSize: "cover", /* Cover the entire background */
    backgroundPosition: "center", /* Center the image */
    backgroundAttachment: "fixed", /* Fix the background image */
    backgroundRepeat: "no-repeat"
  }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}