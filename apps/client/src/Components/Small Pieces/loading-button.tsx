import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactElement } from "react";
import { Button } from "../ui/button";

interface Props {
  children: ReactElement | string;
  isLoading: boolean;
  className?: string;
  [key: string]: any;
}

export function LoaderButton({
  children,
  isLoading,
  className,
  ...props
}: Props) {
  return (
    <Button
      disabled={isLoading}
      type="submit"
      {...props}
      className={cn("flex gap-2 justify-center bg-navy px-4 py-2 ", className)}
    >
      {isLoading && <Loader2Icon className="animate-spin w-4 h-4" />}
      {children}
    </Button>
  );
}
