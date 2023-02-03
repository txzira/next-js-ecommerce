"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { AiFillMail, AiFillLock } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import Link from "next/link";

const FormContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative m-auto w-1/2 before:bg-opacity-10 before:rounded-md before:transform before:-rotate-6  before:absolute before:bg-white before:inset-0">
    <div className="relative w-full p-5 text-black bg-white border border-nonef rounded-md bg-opacity-30 ">{children}</div>
  </div>
);

const FormIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="absolute opacity-40 top-4 left-7 text-lg">{children}</span>
);

const FormItem = ({ children }: { children: React.ReactNode }) => <div className="relative w-1/2 m-auto mb-3">{children}</div>;

const FormButton = ({ children }: { children: React.ReactNode }) => (
  <FormItem>
    <button className="bg-slate-800  w-full text-white py-3 px-6  rounded-3xl">{children}</button>
  </FormItem>
);

const FormInput = ({
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
}) => {
  return (
    <input
      required
      className="text-black  w-full rounded-3xl py-3 px-6 pl-14 bg-opacity-40 bg-white focus:bg-white focus:outline-none placeholder:text-black"
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};
const FormInputRef = ({
  id,
  type,
  placeholder,
  ref,
}: {
  id: string;
  type: string;
  placeholder: string;
  ref: React.RefObject<HTMLInputElement>;
}) => {
  return (
    <input
      required
      className="text-black  w-full rounded-3xl py-3 px-6 pl-14 bg-opacity-40 bg-white focus:bg-white focus:outline-none placeholder:text-black"
      id={id}
      type={type}
      placeholder={placeholder}
      ref={ref}
    />
  );
};

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const signInReply = await signIn("credentials", {
      redirect: true,
      email: email,
      password: password,
      callbackUrl: "/",
    });
    if (!signInReply?.error) {
      router.replace("/");
    }
  };

  return (
    <FormContainer>
      <form className="w-full text-center" onSubmit={submitHandler}>
        <Image src="/images/insertimagehere.png" priority={true} width={180} height={80} alt="logo" className="m-auto" />
        <h1 className="text-white font-semibold text-2xl m-auto md:p-2 font-cycle tracking-wider">Login</h1>
        <FormItem>
          <FormIcon>
            <AiFillMail />
          </FormIcon>
          <FormInput id="email" type="email" placeholder="Email" value={email} onChange={setEmail} />
        </FormItem>
        <FormItem>
          <FormIcon>
            <AiFillLock />
          </FormIcon>
          <FormInput id="password" type="password" placeholder="****" value={password} onChange={setPassword} />
        </FormItem>
        <FormButton>Login</FormButton>
        <div>
          Don't have an account yet?{" "}
          <Link href="/signup" className="text-blue-800 underline">
            Create an account
          </Link>
          .
        </div>
      </form>
    </FormContainer>
  );
};

export const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === confirmPassword) {
      await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });
    } else {
      //error passwords do not match
    }
  };

  return (
    <FormContainer>
      <form className="w-full text-center" onSubmit={submitHandler}>
        <Image src="/images/insertimagehere.png" priority={true} width={180} height={80} alt="logo" />
        <h1 className="text-white font-semibold text-2xl m-auto md:p-2 font-cycle tracking-wider">Registration</h1>
        <FormItem>
          <FormIcon>
            <AiFillMail />
          </FormIcon>
          <FormInput placeholder="Email" id="email" type="email" value={email} onChange={setEmail} />
        </FormItem>
        <FormItem>
          <FormIcon>
            <BsFillPersonFill />
          </FormIcon>
          <FormInput type="text" id="name" placeholder="John Doe" value={name} onChange={setName} />
        </FormItem>
        <FormItem>
          <FormIcon>
            <AiFillLock />
          </FormIcon>
          <FormInput id="password" type="password" placeholder="Password" value={password} onChange={setPassword} />
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
        <button type="submit">Sign Up</button>
        {/* <FormButton>Sign Up</FormButton> */}
        <div>
          Already have an account?{" "}
          <Link href="/login" className="text-blue-800 underline">
            Sign In
          </Link>
          .
        </div>
      </form>
    </FormContainer>
  );
};
