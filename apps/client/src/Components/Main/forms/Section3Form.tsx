"use client";

import { Section3FormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/Components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import { USER } from "./Registrationform";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  incrementNumberAction,
  registerAction,
} from "../../../app/(Auth)/register/action";
import { useFormState } from "react-dom";
import { useServerAction } from "zsa-react";
import { useToast } from "@/hooks/use-toast";

interface Section3FormProps {
  userData: USER | undefined;
  setFilledSection: React.Dispatch<React.SetStateAction<number[]>>;
  setCurrentlySelected: React.Dispatch<React.SetStateAction<number>>;
}

export default function Section3Form({
  userData,
  setCurrentlySelected,
  setFilledSection,
}: Section3FormProps) {
  const [acceptedTos, setAcceptedTos] = useState<boolean>(false);
  const { push } = useRouter();
  const form = useForm<z.infer<typeof Section3FormSchema>>({
    resolver: zodResolver(Section3FormSchema),
    defaultValues: {
      password: userData?.password || "123dsagfgA!.dff",
      confirmPassword: userData?.confirmPassword || "123dsagfgA!.dff",
      referalId: userData?.referalId || undefined,
    },
  });

  const { toast } = useToast();

  const { execute, isPending, error } = useServerAction(registerAction, {
    onSuccess() {
      toast({
        title: "Success",
        description: "Successfully Registered.",
      });
    },
    onError({ err }) {
      toast({
        variant: "destructive",
        description: "Something went wrong." + err?.message,
      });
    },
  });

  function handleBack() {
    push("#main");
    setFilledSection((filledSections) =>
      filledSections.filter((index) => index !== 3)
    );
    setCurrentlySelected(2);
  }

  function onSubmit(values: z.infer<typeof Section3FormSchema>) {
    if (!acceptedTos) {
      toast({
        variant: "destructive",
        description: "Please accept the terms and conditions",
      });
      return;
    }
    const finalData = {
      ...userData,
      password: values.password,
      referalId: values.referalId,
    };

    execute(finalData);
  }

  return (
    <section className="registrationFormContainer">
      <h2 className="text-navy text-xl text-center font-semibold max-sm:pr-6">
        {" "}
        Account Information{" "}
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-3 mt-14"
        >
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="formContainer">
                  <FormLabel className="formLabel">
                    Password
                    <span className="astrics"> * </span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="password"
                      placeholder="*************"
                      className="formInput"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="formContainer mt-6">
                  <FormLabel className="formLabel">
                    Confirm Password
                    <span className="astrics"> * </span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="password"
                      placeholder="*************"
                      className="formInput"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referalId"
              render={({ field }) => (
                <FormItem className="formContainer mt-6">
                  <FormLabel className="formLabel">Referal Id</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="Referal Id"
                      className="formInput"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
            <div className="flex items-start gap-6 mt-8">
              <Checkbox
                onClick={() => setAcceptedTos((accepted) => !accepted)}
                className="rounded-full text-navy w-5 h-5 mt-1"
              />
              <p className="text-base max-sm:w-[200px] sm:w-[250px] md:w-[300px] xl:w-[360px] pr-3">
                {" "}
                I have read and accepted{" "}
                <Link
                  href={"/terms-and-conditions"}
                  className="text-blue-600 mx-1"
                >
                  {" "}
                  the terms and conditions{" "}
                </Link>{" "}
                of this community{" "}
              </p>
            </div>
          </div>
          <div className="mt-10 xl:px-20 flex items-center justify-center max-sm:gap-10 sm:gap-28">
            <div>
              <button
                type="button"
                onClick={handleBack}
                className="formBackButton"
              >
                Back
              </button>
            </div>
            <div>
              <button
                type="submit"
                className="formNextButton"
                disabled={isPending}
              >
                Done
              </button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}
