import Head from "next/head";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href = '//github.com/mikidoodle/shelfie'
  }, [])
  return (
    <>
      <Head>
        <title>Shelfie API</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h1>Shelfie API</h1>
      </main>
    </>
  );
}
