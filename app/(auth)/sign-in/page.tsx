"use client";

import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const SignIn = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SignInFormData> = async (
    data: SignInFormData
  ) => {
    try {
      const response = await signInWithEmail(data);
      console.log(response, "RESPONSE FROM SIGN IN");
      if (!response.success) {
        toast.error(response.message);
      } else {
        router.push("/");
        toast.success("Successfully signed in!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!", {
        description:
          error instanceof Error ? error.message : "Failed to sign in",
      });
    }
  };

  return (
    <>
      <h1 className="form-title">Sign In</h1>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="email"
          label="Email"
          placeholder="Enter you email"
          register={register}
          error={errors.email}
          validation={{
            required: "Email is required",
            pattern: "/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i",
            message: "Email address is required",
          }}
        />

        <InputField
          name="password"
          label="Password"
          placeholder="Enter you password"
          type="password"
          register={register}
          error={errors.password}
          validation={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>

        <FooterLink
          text="Don't have an account?"
          linkText="Sign Up"
          href="/sign-up"
        />
      </form>
    </>
  );
};

export default SignIn;
