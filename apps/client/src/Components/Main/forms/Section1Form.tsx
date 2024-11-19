"use client";

import FormRow from "@/Components/Small Pieces/FormRow";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { USER } from "@/Components/Main/forms/Registrationform";
import { Section1FormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

export interface GeneralSectionsFormProps {
  userData: USER | undefined;
  setUserData: React.Dispatch<React.SetStateAction<USER | undefined>>;
  setFilledSection: React.Dispatch<React.SetStateAction<number[]>>;
  setCurrentlySelected: React.Dispatch<React.SetStateAction<number>>;
}

export default function Section1Form({
  userData,
  setUserData,
  setFilledSection,
  setCurrentlySelected,
}: GeneralSectionsFormProps) {
  const { push } = useRouter();

  const form = useForm<z.infer<typeof Section1FormSchema>>({
    resolver: zodResolver(Section1FormSchema),
    defaultValues: {
      firstName: userData?.firstName || "smith",
      lastName: userData?.lastName || "smith",
      userName: userData?.userName || "smith",
      nickName: userData?.nickName || "smith",
      sex: userData?.sex || "",
      languages: userData?.languages?.join(",") || "English",
      dob: userData?.dob || "",
    },
  });

  function onSubmit(values: z.infer<typeof Section1FormSchema>) {
    // check if the user is atleast 15 years old
    const dob = new Date(values.dob);
    // get today's date
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    // compare if the user is at least 15 years old
    const isAtLeast15 = age >= 15;
    if (!isAtLeast15) {
      form.setError("dob", {
        message: "You have to be at least 15 years old",
      });
      return;
    }
    // Check if comma is used to seprate each languages
    const LanguageSpokenComma = /,/.test(values.languages);
    if (!LanguageSpokenComma) {
      form.setError("languages", {
        message: "you forgot to use comma",
      });
      return;
    }
    // const LanguageWishTLComma = /,/.test(values.languagesWishToLearn);
    // if (!LanguageWishTLComma) {
    //   form.setError("languagesWishToLearn", {
    //     message: "you forgot to use comma",
    //   });
    // return;
    //}
    // TODO: If comma is add at end we need to remove it
    setUserData({
      firstName: values.firstName,
      lastName: values.lastName,
      userName: values.userName,
      nickName: values.nickName,
      sex: values.sex,
      languages: values.languages.split(","),
      dob: values.dob,
    });
    setFilledSection((filledSections) => [...filledSections, 2]);
    setCurrentlySelected(2);
    push("#main");
  }

  return (
    <section className="registrationFormContainer">
      <h2 className="text-navy text-xl text-center font-semibold">
        {" "}
        Personal Information{" "}
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="registrationForm"
        >
          <FormRow
            fieldname1="firstName"
            fieldname2="lastName"
            control={form.control}
            label1="First Name"
            label2="Last Name"
            inputType1="text"
            inputType2="text"
            placeholder1="Smith"
            placeholder2="Sand"
            needTopMargin={false}
          />
          <FormRow
            fieldname1="nickName"
            fieldname2="userName"
            control={form.control}
            label1="Nickname"
            label2="username"
            inputType1="text"
            inputType2="text"
            placeholder1="sagu"
            placeholder2="Sadusmith23"
          />
          <div className="formRow mt-6">
            {/* SEX */}
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem className="formContainer xl:gap-7">
                  <FormLabel className="formLabel xl:mt-5">
                    Sex
                    <span className="astrics"> * </span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="focus:border-none focus-visible:outline-none py-4">
                      <SelectTrigger
                        {...field}
                        className="bg-button max-md:w-[280px] md:w-[300px] lg:w-[350px] xl:w-[360px] px-3 py-2.5 focus:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-button focus:ring-0"
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male"> Male </SelectItem>
                      <SelectItem value="Female"> Female </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
            {/* LANGUAGES SPOKEN */}
            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem className="formContainer">
                  <FormLabel className="formLabel">
                    Languages Spoken
                    <span className="astrics"> * </span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col justify-start gap-2">
                      <p className="text-xs">
                        use comma to separate each entries{" "}
                      </p>
                      <input
                        type="text"
                        placeholder="English , French, German"
                        className="formInput mt-2"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="formRow mt-6">
            {/* LANGUAGES WISHING TO LEARN  */}
            {/* <FormField
                        control={form.control}
                        name="languagesWishToLearn"
                        render={({ field }) => (
                            <FormItem className="formContainer">
                            <FormLabel className="formLabel"> 
                            Languages wishing to learn
                            <span className="astrics"> * </span>
                            </FormLabel>
                            <FormControl>
                                <div className="flex flex-col justify-start gap-2">
                                    <p className="text-xs"> use comma to separate each entries </p>
                                    <input type="text" placeholder="English , French, German" className="formInput mt-2" {...field}/> 
                                </div>
                            </FormControl>
                            <FormMessage className='text-sm text-red-500' />
                            </FormItem>
                        )}
                        /> */}
            {/* BIRTH DATE  */}
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="formContainer xl:mt-8">
                  <FormLabel className="formLabel">
                    Birth Date
                    <span className="astrics"> * </span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      placeholder="DD/MM/YYY"
                      className="formInput"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-14 max-sm:w-[260px] sm:w-[300px] md:w-[350px] lg:w-[380px] xl:w-full flex justify-end">
            <button type="submit" className="formNextButton">
              {" "}
              Next{" "}
            </button>
          </div>
        </form>
      </Form>
    </section>
  );
}
