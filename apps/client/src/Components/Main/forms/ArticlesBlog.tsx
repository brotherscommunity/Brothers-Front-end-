"use client";

import TextEditor from "../TextEditor";
import References from "../../Small Pieces/References";
import ThumbnailUploader from "../../Small Pieces/ThumbnailUploader";
import { BlogPostSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { z } from "zod";
import Tags from "../../Small Pieces/Tags";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Spinner from "../../Small Pieces/Spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Input } from "@/components/ui/input";
import { useServerAction } from "zsa-react";
import { useToast } from "@/hooks/use-toast";
import { createPostAction, updatePostAction } from "@/app/create-post/action";
import { LoaderButton } from "@/Components/Small Pieces/loading-button";

interface PostData {
  id: string;
  title: string;
  content: string;
  references: string[];
  tags: string[];
  [key: string]: any;
}

export default function ArticlesBlog({ postData }: { postData?: PostData }) {
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const { data } = useSelector((state: RootState) => state.user);
  const { push, refresh } = useRouter();
  const { toast } = useToast();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const form = useForm<z.infer<typeof BlogPostSchema>>({
    resolver: zodResolver(BlogPostSchema),
    defaultValues: postData
      ? {
          title: postData.title,
          content: postData.content,
          references: postData.references,
          image: postData.image,
          tags: postData.tags,
        }
      : {
          title: "",
          content: "Text here",
          references: [],
          image: "",
          tags: [],
        },
  });

  const { execute, isPending, error } = useServerAction(
    !postData ? createPostAction : updatePostAction,
    {
      onSuccess() {
        toast({
          title: "Success",
          description: "Successfully created a blog post.",
        });
      },
      onError({ err }) {
        toast({
          variant: "destructive",
          description: "Something went wrong." + err?.message,
        });
      },
    }
  );

  async function handlePreview() {
    const postData = form.getValues();
    setIsPreviewLoading(true);
    //TODO: Upadte this post id after creating the post. It's used for the url
    let postId = "1rssggetegb"; // FAKE POST ID
    // TODO: MAke an HTTP request to upload the Post but with a status of "pending"
    try {
    } catch (error: any) {
    } finally {
      setIsPreviewLoading(false);
    }
    // Redirect the User to the Preview-post Page
    push(`/preview-post/${postId}`);
  }
  function handleClearForm() {
    // refresh the page to clear the form. form.reset() doesn't work
    refresh();
  }

  async function onSubmit(values: z.infer<typeof BlogPostSchema>) {
    const post = {
      ...values,
      references: values.references || [],
      tags: values.tags || [],
    };
    if (postData) {
      execute({ ...post, id: postData.id });
    } else {
      execute(post);
    }
  }

  return (
    <section>
      {JSON.stringify(postData)}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* TITLE */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex items-center gap-10 mt-10">
                <FormLabel className="text-lg text-black font-medium">
                  Title
                </FormLabel>
                <FormControl>
                  {/* <input type="text" placeholder="Title of your blog" {...field} className="max-sm:w-[280px] sm:w-[300px] md:w-[350px] lg:w-[380px] px-3 py-2.5 border border-gray-400 focus-visible:outline-none rounded-md bg-button" /> */}
                  <Input placeholder="Title of your blog" {...field} />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />
          {/* WYSIWYG editor */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="mt-10 flex flex-col justify-start gap-5">
                <FormLabel className="text-lg text-black font-medium">
                  Description
                </FormLabel>
                <FormControl>
                  <TextEditor
                    initialValue={field.value}
                    fieldchange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />
          {/* Adding Citations for the Post */}
          <FormField
            control={form.control}
            name="references"
            render={({ field }) => (
              <FormItem className="mt-64 md:mt-0">
                <FormControl>
                  <References
                    fieldchange={field.onChange}
                    initialValue={field.value || []}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />
          {/* Uploading the Image */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ThumbnailUploader
                    fieldchange={field.onChange}
                    title="Featured Image"
                    mediaUrl="./public/postImage.png"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />
          {/* Tags */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Tags
                    fieldchange={field.onChange}
                    title="Add tags to your Post"
                    initialValue={field.value || []}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap items-center gap-16 mt-14">
            <button
              type="button"
              onClick={handlePreview}
              className="border border-orangeRed w-[180px] h-auto max-sm:text-sm sm:text-base text-orangeRed font-semibold px-4 py-2 rounded-md focus-visible:outline-none"
            >
              {isPreviewLoading ? (
                <Spinner loading={isPreviewLoading} color="#000000" size={15} />
              ) : (
                "Preview Page"
              )}
            </button>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={handleClearForm}
                className="border border-navy text-navy max-sm:text-sm sm:text-base font-semibold px-4 py-2 rounded-md focus-visible:outline-none"
              >
                Cancel
              </button>
              <LoaderButton isLoading={isPending}>Save</LoaderButton>
              {/* <button
                type="submit"
                className="bg-navy w-[100px] h-auto max-sm:text-sm sm:text-base text-white font-semibold px-4 py-2 rounded-md focus-visible:outline-none"
              >
                {isSaveLoading ? (
                  <Spinner loading={isSaveLoading} size={15} />
                ) : (
                  "Save"
                )}
              </button> */}
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}