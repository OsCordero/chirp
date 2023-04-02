import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

const SinglePostPage: NextPage = () => {
  const user = useUser();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">Post view</main>
    </>
  );
};

export default SinglePostPage;
