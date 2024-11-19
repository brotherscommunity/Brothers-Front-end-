"use client";

import Avatar from "@/Components/Small Pieces/Avatar";
import { LoaderButton } from "@/Components/Small Pieces/loading-button";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { useServerAction } from "zsa-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { postCommentAction } from "../action";
import { queryClient } from "@/lib/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface CommentProps {
  blogId: string;
}
const schema = z.object({
  content: z.string().min(3, "Too short!"),
  id: z.string(),
});

export default function CommentForm({ blogId }: CommentProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const form = useForm<z.infer<typeof schema>>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      id: blogId,
    },
  });

  const { execute, isPending, error } = useServerAction(postCommentAction, {
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
      toast({
        title: "Success",
        description: "Successfully Logged in.",
      });
    },
    onError({ err }) {
      toast({
        variant: "destructive",
        description: "Something went wrong." + err?.message,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        description: "You have to be logged in to comment!",
      });
      return;
    }
    execute(values);
  }

  return (
    <section className="flex flex-col items-start gap-6 pt-7 pb-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="formContainer">
                <FormControl>
                  <Textarea
                    placeholder="write a comment"
                    disabled={isPending}
                    className="formInput  h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          <LoaderButton
            type="submit"
            isLoading={isPending}
            className="bg-orangeRed mt-6"
          >
            Comment
          </LoaderButton>
        </form>
      </Form>
    </section>
  );
}
