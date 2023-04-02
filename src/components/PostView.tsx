import Image from "next/image";
import Link from "next/link";
import { timeAgo } from "~/helpers";

import { type RouterOutputs } from "~/utils/api";
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

export default PostView;
