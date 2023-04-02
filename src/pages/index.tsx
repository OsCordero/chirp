import { SignIn, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import LoadingSpinner, { AbsoluteLoadingSpinner } from "~/components/Loading";
import { toastListErrors } from "~/helpers";

import { api, type RouterOutputs } from "~/utils/api";

const CreatePostWizard = () => {
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading } = api.posts.createPost.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAll.invalidate();
      setInput("");
    },
    onError: (e) => {
      const fieldErrors = e.data?.zodError?.fieldErrors;
      if (fieldErrors) {
        const allErrors = Object.values(fieldErrors).flat();
        toastListErrors(allErrors);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });
  const [input, setInput] = useState("");

  if (!user) return null;
  return (
    <div className="flex w-full items-center gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate({ content: input });
        }}
        className="flex-growf flex w-full items-center"
      >
        <input
          type="text"
          placeholder="Add some emojis"
          className="grow bg-transparent p-4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <button disabled={isLoading} type="submit">
            Post
          </button>
        )}
      </form>
    </div>
  );
};

// given a date, return a string like "1h ago"
const timeAgo = (date: Date) => {
  const timeIntervals = [
    { interval: 31536000, label: "year" },
    { interval: 2592000, label: "month" },
    { interval: 86400, label: "day" },
    { interval: 3600, label: "hour" },
    { interval: 60, label: "minute" },
    { interval: 1, label: "second" },
  ];

  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const timeInterval = timeIntervals.find(
    (interval) => seconds / interval.interval >= 1
  );
  if (!timeInterval) return "just now";

  const intervalCount = Math.floor(seconds / timeInterval.interval);
  const intervalLabel =
    timeInterval.label + (intervalCount > 1 ? "s ago" : " ago");

  return `${intervalCount} ${intervalLabel}`;
};

type PostWithAuthor = RouterOutputs["posts"]["getAll"][0];
const PostView = ({ post, author }: PostWithAuthor) => {
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            &nbsp; · &nbsp;
            <span className="text-slate-400">{timeAgo(post.createdAt)}</span>
          </Link>
        </div>
        <p className="text-2xl">{post.content}</p>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  return isLoading ? (
    <AbsoluteLoadingSpinner />
  ) : (
    <div className="flex flex-col ">
      {data?.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();

  return (
    <>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex items-center  border-b border-slate-400 p-4">
            {user.isSignedIn ? (
              <CreatePostWizard />
            ) : (
              <div className="flex justify-center">
                <SignIn />
              </div>
            )}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
