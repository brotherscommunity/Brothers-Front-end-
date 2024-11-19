"use client";

import Image from "next/image";
import postImage from "../../../../public/postImage.png";
import VideoImage from "../../../../public/videoImage.jpg";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiOutlineComment,
} from "react-icons/ai";
import { IoStatsChartOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiEdit } from "react-icons/ci";
import { PROFILE_PAGE_PATH } from "@/constants";
import { formatNumber } from "@/utils";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import DisplayContent from "./DisplayContent";
import { DeleteBlogButton } from "@/app/blog/[id]/_compnents/delete-blog-button";

interface PostCardProps {
  postedBy: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
  likes: number;
  dislikes: number;
  comments: number;
  totalViews: number;
  isVideoPost?: boolean;
  blogId: string;
  userId?: string;
}

// Data about the post is fetched deom the database later. for now it is static

export default function PostCard({
  postedBy,
  date,
  title,
  description,
  tags,
  likes,
  dislikes, // function handleLike(){

  // }
  // function handleDislike(){

  // }
  // function handleDeletePost(){

  // }
  comments,
  totalViews,
  isVideoPost = false,
  blogId,
  userId,
}: PostCardProps) {
  const { isAuthenticated, data } = useSelector(
    (state: RootState) => state.user
  );
  const pathname = usePathname();

  const isProfilePage =
    isAuthenticated &&
    data?.id == userId &&
    pathname.startsWith(PROFILE_PAGE_PATH);

  const viewCount = formatNumber(totalViews);
  const baseUrl = isVideoPost ? `/video-blog/${blogId}` : `/blog/${blogId}`;

  return (
    <section className="border border-grey-200 mt-8 flex items-start gap-10 rounded-xl p-8">
      {isVideoPost ? (
        <Link href={"/"} className="max-lg:hidden">
          <Image src={VideoImage} alt="post-image" width={200} height={250} />
        </Link>
      ) : (
        <Image
          src={postImage}
          alt="post-image"
          width={200}
          height={200}
          className="max-lg:hidden rounded-sm"
        />
      )}
      <div className="flex flex-1 flex-col justify-start">
        <div></div>
        <div className="flex flex-wrap max-sm:gap-4 items-start justify-between">
          <span className="flex items-center gap-3 text-sm">
            <h5> By {postedBy} </h5>
            <p className="text-stone-600"> {date} </p>
          </span>
          {isProfilePage && (
            // <button className="flex items-center gap-2 text-orangeRed font-bold mr-6">
            //   <FaRegTrashAlt className="w-4 h-4" />
            //   <p className="text-base"> Delete </p>
            // </button>
            <DeleteBlogButton id={blogId} userId={userId as string} />
          )}
        </div>
        <span className="mt-4">
          <h2 className="text-[20px] text-black font-bold"> {title} </h2>
          <p className="max-sm:text-xs sm:text-[15px] mt-2 leading-6 max-w-[750px]">
            {/* //! limit the contnt */}
            <DisplayContent content={description} />
          </p>
        </span>
        <Link
          href={baseUrl}
          className="text-sm text-orangeRed font-semibold mt-3"
        >
          Continue reading
        </Link>
        <div className="flex flex-wrap max-sm:gap-5 items-center justify-between">
          <span className="flex items-center gap-4 mt-4">
            {tags.map((tag) => {
              return (
                <button key={tag} className="tags">
                  {" "}
                  {tag}{" "}
                </button>
              );
            })}
          </span>
          {isProfilePage && (
            <button className="maxw-[140px] bg-navy px-4 py-2 rounded-md text-white text-base focus-visible:outline-none ">
              <Link
                className="xl:mr-4 flex items-center gap-2"
                href={`${baseUrl}/edit`}
              >
                <CiEdit className="w-4 h-4 text-white" />
                <p className="text-white text-sm"> Edit </p>
              </Link>
            </button>
          )}
        </div>
        <span className="flex items-center max-sm:gap-4 sm:gap-7 max-sm:mt-7 sm:mt-5">
          <div className="flex items-center gap-2">
            <AiOutlineComment className="w-6 h-6 text-stone-600" />
            <p className="text-sm text-stone-600 font-semibold pt-1">
              {comments}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button>
              <AiOutlineLike className="w-6 h-6 text-stone-600" />
            </button>
            <p className="text-sm text-stone-600 font-semibold pt-1">
              {" "}
              {likes}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button>
              <AiOutlineDislike className="w-6 h-6 mt-1.5 text-stone-600" />
            </button>
            <p className="text-sm text-stone-600 font-semibold pt-1">
              {" "}
              {dislikes}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <IoStatsChartOutline className="w-5 h-5 text-stone-600" />
            <p className="text-sm text-stone-600 font-semibold pt-1">
              {" "}
              {viewCount}
            </p>
          </div>
        </span>
      </div>
    </section>
  );
}
