"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import { VideoBlogSchema } from "@/lib/validation";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import TextEditor from "../TextEditor";
import References from "@/Components/Small Pieces/References";
import ThumbnailUploader from "@/Components/Small Pieces/ThumbnailUploader";
import Tags from "@/Components/Small Pieces/Tags";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "@/Components/Small Pieces/Spinner";
import { LoaderButton } from "@/Components/Small Pieces/loading-button";
import { useServerAction } from "zsa-react";
import { useToast } from "@/hooks/use-toast";
import {
  createVblogAction,
  updateVblogAction,
} from "@/app/video-blog/_actions";

interface PostData {
  id: string;
  title: string;
  content: string;
  references: string[];
  tags: string[];
  videoLink: string;
  [key: string]: any;
}

export default function VideoBlog({ vblogData }: { vblogData?: PostData }) {
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const { refresh, push } = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof VideoBlogSchema>>({
    resolver: zodResolver(VideoBlogSchema),
    defaultValues: vblogData
      ? {
          content: vblogData.content,
          references: vblogData.references,
          title: vblogData.title,
          videoLink: vblogData.videoLink,
          tags: vblogData.tags,
          image: vblogData.image,
        }
      : {
          content: "Text text text",
          references: [],
          title: "jsahdfjg hdsgfh ahgf",
          videoLink: "https://www.youtube.com",
          tags: [],
          image: "https://www.youtube.com",
        },
  });

  const { execute, isPending, error } = useServerAction(
    !vblogData ? createVblogAction : updateVblogAction,
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
    let postId = "fake-id";
    try {
    } catch (error: any) {
    } finally {
      setIsPreviewLoading(false);
    }
    push(`/preview-post/${postId}`);
  }
  function handleClearForm() {
    refresh();
  }
  async function onSubmit(values: z.infer<typeof VideoBlogSchema>) {
    if (vblogData) {
      execute({ ...values, id: vblogData.id });
    } else {
      execute(values);
    }
  }

  return (
    <section className="mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* TITLE */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-wrap items-center max-sm:gap-4 sm:gap-10">
                <FormLabel className="text-lg text-black font-medium">
                  Title
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    placeholder="Title of your blog"
                    {...field}
                    className="max-sm:w-[250px] sm:max-sm:w-[280px] sm:w-[300px] md:w-[350px] lg:w-[380px] px-3 py-2 border border-gray-400 focus-visible:outline-none rounded-md bg-button"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />
          {/* VIDEO LINK */}
          <FormField
            control={form.control}
            name="videoLink"
            render={({ field }) => (
              <FormItem className="flex flex-wrap items-center max-sm:gap-3 sm:gap-6 mt-10">
                <FormLabel className="text-lg text-black pt-3 font-medium">
                  Enter video link
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/tutorial"
                    {...field}
                    className="max-sm:w-[250px] sm:w-[300px] md:w-[350px] lg:w-[380px] px-3 py-2 border border-gray-400 focus-visible:outline-none rounded-md bg-button"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />
          {/* Description */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="mt-14 flex flex-col justify-start gap-3">
                <FormLabel className="text-lg text-black font-medium">
                  Description
                </FormLabel>
                <FormControl>
                  <TextEditor
                    fieldchange={field.onChange}
                    initialValue={field.value}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />
          {/* REFERENCES */}
          <FormField
            control={form.control}
            name="references"
            render={({ field }) => (
              <FormItem className="mt-64 md:mt-0">
                <FormControl>
                  <References
                    fieldchange={field.onChange}
                    initialValue={field.value as []}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="mt-14">
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
              <FormItem className="mt-10">
                <FormControl>
                  <Tags
                    fieldchange={field.onChange}
                    title="Add tags to your Post"
                    initialValue={field.value as []}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap items-center gap-16 mt-16">
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
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}
