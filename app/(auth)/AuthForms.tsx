"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { AiFillMail, AiFillLock } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import Link from "next/link";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { validateEmail, validatePassword } from "pages/api/auth/[...nextauth]";

function FormContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mt-10 w-full before:absolute before:inset-0 before:-rotate-6 before:transform before:rounded-md  before:bg-white before:bg-opacity-10 md:w-1/2">
      <div className="relative mx-auto w-4/5 rounded-md border bg-white p-5 text-black shadow-lg ">
        {children}
      </div>
    </div>
  );
}

function FormIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute left-4 top-3.5 text-lg opacity-40">
      {children}
    </span>
  );
}

function FormItem({ children }: { children: React.ReactNode }) {
  return <div className="relative m-auto mb-3 w-full md:w-1/2">{children}</div>;
}

function FormButton({ children }: { children: React.ReactNode }) {
  return (
    <FormItem>
      <button className="w-full rounded-full border-4 border-black bg-black px-6 py-3 text-lg font-semibold text-white active:bg-red-700  active:text-black ">
        {children}
      </button>
    </FormItem>
  );
}

function FormInput({
  id,
  type,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <input
      required
      className="w-full rounded-3xl border bg-white px-4 py-2 pl-10 text-black placeholder:text-black focus:bg-slate-300 focus:outline-none"
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
const initalErrors = {
  uppercaseError: {
    error: "Must include at least 1 uppercase letter",
    status: false,
  },
  lowercaseError: {
    error: "Must include at least 1 lowercase letter.",
    status: false,
  },
  numberError: {
    error: "Must include at least 1 number.",
    status: false,
  },
  specialCharError: {
    error: "Must include at least 1 special character (!@#$%^&*).",
    status: false,
  },
  lengthError: {
    error: "Must be between 8-16 characters.",
    status: false,
  },
};

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.loading("Loading...");
    const signInReply = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });
    if (signInReply?.ok) {
      toast.dismiss();
      router.replace("/");
    } else {
      toast.dismiss();
      toast.error(signInReply?.error!);
    }
  };

  return (
    <FormContainer>
      <form className="w-full text-center" onSubmit={submitHandler}>
        <Image
          src="/images/logo.png"
          priority={true}
          width={180}
          height={80}
          alt="logo"
          className="m-auto"
        />
        <h1 className="font-cycle m-auto text-2xl font-semibold tracking-wider text-black md:p-2">
          Login
        </h1>
        <FormItem>
          <FormIcon>
            <AiFillMail />
          </FormIcon>
          <FormInput
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
          />
        </FormItem>
        <FormItem>
          <FormIcon>
            <AiFillLock />
          </FormIcon>
          <FormInput
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
          />
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-right text-blue-800 underline">
              Forgot your password?
            </Link>
          </div>
        </FormItem>

        <FormButton>Login</FormButton>
        <p>
          Don&apos;t have an account yet?{" "}
          <Link href="/auth/signup" className="text-blue-800 underline">
            Create an account
          </Link>
          .
        </p>
      </form>
    </FormContainer>
  );
};

export const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [attemptSubmit, setAttemptSubmit] = useState(false);
  const router = useRouter();

  const [formErrors, setFormErrors] = useState(initalErrors);

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttemptSubmit(true);
    const errors = initalErrors;
    //uppercase validation
    password.match(/(?=.*[A-Z])/)
      ? (errors.uppercaseError.status = true)
      : (errors.uppercaseError.status = false);
    //lowercase validation
    password.match(/(?=.*[a-z])/)
      ? (errors.lowercaseError.status = true)
      : (errors.lowercaseError.status = false);
    //number validation
    password.match(/(?=.*\d)/)
      ? (errors.numberError.status = true)
      : (errors.numberError.status = false);
    //special character validation
    password.match(/(?=.*[!@#$%^&*])/)
      ? (errors.specialCharError.status = true)
      : (errors.specialCharError.status = false);
    //length validation
    password.match(/^.{8,16}$/)
      ? (errors.lengthError.status = true)
      : (errors.lengthError.status = false);

    setFormErrors(errors);
    if (validateEmail(email)) {
      if (password === confirmPassword) {
        if (validatePassword(password)) {
          toast.loading("Loading...");
          const data = await fetch("/auth/signup/create-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, name }),
          });
          const response = await data.json();
          toast.dismiss();
          if (data.status === 200) {
            toast.success(response.message);
            router.push("/auth/login");
          } else {
            toast.error(response.message);
          }
        } else {
          toast.error("Unacceptable Password");
        }
      } else {
        //error passwords do not match
        toast.dismiss();
        toast.error("Passwords do not match");
        setPassword("");
        setConfirmPassword("");
      }
    } else {
      toast.error("Invalid email address.");
    }
  };

  return (
    <FormContainer>
      <form className="w-full text-center" onSubmit={submitHandler}>
        <Image
          src="/images/logo.png"
          priority={true}
          width={180}
          height={80}
          alt="logo"
          className="m-auto"
        />
        <h1 className="font-cycle m-auto text-2xl font-semibold tracking-wider text-black md:p-2">
          Registration
        </h1>
        <FormItem>
          <FormIcon>
            <AiFillMail />
          </FormIcon>
          <FormInput
            placeholder="Email"
            id="email"
            type="email"
            value={email}
            onChange={setEmail}
          />
        </FormItem>
        <FormItem>
          <FormIcon>
            <BsFillPersonFill />
          </FormIcon>
          <FormInput
            type="text"
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={setName}
          />
        </FormItem>
        <FormItem>
          <FormIcon>
            <AiFillLock />
          </FormIcon>
          <FormInput
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
          />
          {attemptSubmit ? (
            <ul className="ml-5 list-inside list-disc text-left text-xs">
              <li
                className={`${
                  formErrors.uppercaseError.status
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                {formErrors.uppercaseError.error}
              </li>
              <li
                className={`${
                  formErrors.lowercaseError.status
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                {formErrors.lowercaseError.error}
              </li>
              <li
                className={`${
                  formErrors.numberError.status
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                {formErrors.numberError.error}
              </li>
              <li
                className={`${
                  formErrors.specialCharError.status
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                {formErrors.specialCharError.error}
              </li>
              <li
                className={`${
                  formErrors.lengthError.status
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                {formErrors.lengthError.error}
              </li>
            </ul>
          ) : null}
        </FormItem>
        <FormItem>
          <FormIcon>
            <AiFillLock />
          </FormIcon>
          <FormInput
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </FormItem>
        <FormButton>Sign Up</FormButton>
        <p>
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-800 underline">
            Sign In
          </Link>
          .
        </p>
      </form>
    </FormContainer>
  );
};

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const requestPasswordLink = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    toast.loading("Loading...");

    const data = await fetch("/auth/forgot-password/send-email-link", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const response = await data.json();
    toast.dismiss();
    console.log(response);
  };
  return (
    <FormContainer>
      <form
        className="w-full text-center"
        onSubmit={(event) => requestPasswordLink(event)}>
        <Image
          src="/images/logo.png"
          priority={true}
          width={180}
          height={80}
          alt="logo"
          className="m-auto"
        />
        <h1 className="my-2 text-2xl font-bold  text-black md:p-2 ">
          Forgot Password
        </h1>
        <p className="my-2 text-sm  text-gray-500">
          Enter your email and we&apos;ll send you a link to reset your password
        </p>
        <FormItem>
          <FormIcon>
            <AiFillMail />
          </FormIcon>
          <FormInput
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
          />
        </FormItem>
        <FormItem>
          <button className="w-2/3 rounded-full border-4 border-black bg-black px-6 py-2 text-lg font-semibold text-white active:bg-red-700  active:text-black ">
            Submit
          </button>
        </FormItem>
        <p className="text-sm">
          Don&apos;t have an account?
          <Link href="/auth/signup" className="text-blue-800 underline">
            Sign Up
          </Link>
          .
        </p>
        <p className="text-sm">
          Remembered your password?{" "}
          <Link href="/auth/login" className="text-blue-800 underline">
            Login
          </Link>
          .
        </p>
      </form>
    </FormContainer>
  );
};

export const ResetPasswordForm = () => {
  const token = useParams()?.token;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const resetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.loading("Loading...");

    if (!token) {
      toast.dismiss();
      toast.error("Invalid Token");
      return;
    }

    if (password === confirmPassword) {
      const data = await fetch(
        `/auth/forgot-password/reset-password/${token}`,
        {
          method: "PATCH",
          body: JSON.stringify({ password, confirmPassword }),
        }
      );
      const response = await data.json();
      toast.dismiss();
      if (response.status === 200) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      router.push("/auth/login");
    } else {
      toast.error("Passwords mismatch.");
    }
  };
  return (
    <FormContainer>
      <form
        className="w-full text-center"
        onSubmit={(event) => resetPassword(event)}>
        <Image
          src="/images/logo.png"
          priority={true}
          width={180}
          height={80}
          alt="logo"
          className="m-auto"
        />
        <h1 className="my-2 text-2xl font-bold  text-black md:p-2 ">
          Forgot Password
        </h1>
        <FormItem>
          <FormIcon>
            <AiFillLock />
          </FormIcon>
          <FormInput
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
          />
        </FormItem>
        <FormItem>
          <FormIcon>
            <AiFillLock />
          </FormIcon>
          <FormInput
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </FormItem>
        <FormItem>
          <button className="w-2/3 rounded-full border-4 border-black bg-black px-6 py-2 text-lg font-semibold text-white active:bg-red-700  active:text-black ">
            Submit
          </button>
        </FormItem>
      </form>
    </FormContainer>
  );
};
