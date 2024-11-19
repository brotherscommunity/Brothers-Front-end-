import { z } from "zod";

export const Section1FormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "first name is required" })
    .max(10, { message: "first name is too long" }),
  lastName: z
    .string()
    .min(2, { message: "last name is required" })
    .max(10, { message: "last name is too long" })
    .optional(),
  userName: z
    .string()
    .min(2, { message: "username is required" })
    .max(8, { message: "user name is too long" }),
  nickName: z
    .string()
    .min(2, { message: "Nickname is required" })
    .max(10, { message: "nick name is too long" }),
  sex: z.string().min(2, { message: "sex is required" }),
  languages: z.string().min(2, { message: "This field is required" }),
  dob: z.string().min(2, { message: "birth date is required" }),
});
export const Section2FormSchema = z.object({
  email: z.string().email().min(2, { message: "email is required" }),
  telegramUserName: z.string().optional(),
  phoneNumber: z
    .string()
    .max(15, { message: "phone number is too long" })
    .optional(),
  facebookId: z.string().optional(),
  instagramUserName: z.string().optional(),
  vkId: z.string().optional(),
  weChatId: z.string().optional(),
  country: z.string().min(2, { message: "country is required" }),
  state: z.string().min(2, { message: "state is required" }),
  city: z.string().optional(),
});
export const Section3FormSchema = z
  .object({
    password: z
      .string()
      .min(5, { message: "password must be greater than 5 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "You need to re-enter your password" }),
    referalId: z.number().optional(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  );
export const SignFormSchema = z.object({
  userName: z.string().min(1, { message: "username is required" }),
  password: z.string().min(1, { message: "password is required" }),
});
export const EditProfileSchema = z.object({
  ...Section1FormSchema.shape,
  ...Section2FormSchema.shape,
  file: z.custom<File[]>(),
  newPassword: z
    .string()
    .min(5, { message: "password must be greater than 5 characters" }),
  confirmPassword: z
    .string()
    .min(1, { message: "You need to re-enter your password" }),
});
export const BlogPostSchema = z.object({
  content: z.string().min(3, { message: "You need to provide the content" }),
  title: z
    .string()
    .min(2, { message: "title for your post is required" })
    .max(40, { message: "Title is too long" }),
  //image: z.custom<File[]>(),
  image: z.string(),
  references: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});
export const VideoBlogSchema = z.object({
  //postedBy: z.string().optional(),
  //created_at: z.date(),
  title: z
    .string()
    .min(2, { message: "title for your post is required" })
    .max(40, { message: "Title is too long" }),
  videoLink: z.string().min(2, { message: "Link is required" }),
  //thumbnail: z.custom<File[]>(),
  image: z.string(),
  content: z.string().min(3, { message: "description is required" }),
  references: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});
export const CreateBlogCatagorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Catagory name is required" })
    .max(25, { message: "Category name is too long" }),
  parentCatagoryCode1: z
    .string()
    .min(1, { message: "Parent category code is required" }),
  parentCatagoryCode2: z.string().optional(),
  parentCatagoryCode3: z.string().optional(),
  description: z.string().min(2, { message: "Description is required" }),
  catagories: z.array(z.string()).optional(),
});
