import Link from "next/link";
import { Button } from "../ui/button";
import DisplayContent from "./Post/DisplayContent";
import { CiEdit } from "react-icons/ci";

export default function Bio({ content }: { content: string | null }) {
  return (
    <section className="bg-button border-none w-full h-auto max-sm:px-5 sm:px-10 py-6 ">
      {/* {!content ? (
        <div className="flex w-full justify-center">
          <Button variant={"outline"} className=" flex items-center gap-2">
            <CiEdit className="w-5 h-5 text-navy" />
            <Link href="/edit-profile">Say something about Yourself</Link>
          </Button>
        </div>
      ) : (
        <DisplayContent content={content} />
      )} */}
      {content ? <DisplayContent content={content} /> : ""}
    </section>
  );
}
