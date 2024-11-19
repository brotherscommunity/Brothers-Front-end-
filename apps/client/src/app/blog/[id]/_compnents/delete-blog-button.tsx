"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DoorOpen } from "lucide-react";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { Button } from "@/Components/ui/button";
import { LoaderButton } from "@/Components/Small Pieces/loading-button";
import { deleteBlogAction } from "../action";
import { FaRegTrashAlt } from "react-icons/fa";

export function DeleteBlogButton({
  id,
  userId,
  type = "submit",
}: {
  id: string;
  type?: "button" | "submit";
  userId: string;
}) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const { execute, isPending, error } = useServerAction(deleteBlogAction, {
    onSuccess() {
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Successfully deleted.",
      });
    },
    onError({ err }) {
      setIsOpen(false);
      toast({
        title: "Uh oh",
        variant: "destructive",
        description: "Something went wrong deleting the blog." + err?.message,
      });
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={"link"}
          className={cn("w-fit hover:underline-none")}
          type={type}
        >
          <span className="flex items-center gap-2 text-orangeRed font-bold mr-6">
            <FaRegTrashAlt className="w-4 h-4" />
            <p className="text-base"> Delete </p>
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Blog</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this blog? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoaderButton
            isLoading={isPending}
            onClick={() => {
              execute({ id, userId });
            }}
            className="bg-orangeRed"
          >
            Delete Blog
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
