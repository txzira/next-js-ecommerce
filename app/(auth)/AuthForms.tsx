"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { AiFillMail, AiFillLock } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import Link from "next/link";
import toast from "react-hot-toast";

function FormContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative m-auto w-1/2 before:bg-opacity-10 before:rounded-md before:transform before:-rotate-6  before:absolute before:bg-white before:inset-0">
      <div className="relative w-full p-5 text-black bg-white border border-nonef rounded-md bg-opacity-30 ">{children}</div>
    </div>
  );
}

function FormIcon({ children }: { children: React.ReactNode }) {
  return <span className="absolute opacity-40 top-4 left-7 text-lg">{children}</span>;
}

function FormItem({ children }: { children: React.ReactNode }) {
  return <div className="relative w-1/2 m-auto mb-3">{children}</div>;
}

function FormButton({ children }: { children: React.ReactNode }) {
  return (
    <FormItem>
      <button className="bg-slate-800  w-full text-white py-3 px-6  rounded-3xl">{children}</button>
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
      className="text-black  w-full rounded-3xl py-3 px-6 pl-14 bg-opacity-40 bg-white focus:bg-white focus:outline-none placeholder:text-black"
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

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
    if (signInReply.ok) {
      toast.dismiss();
      router.replace("/");
    } else {
      toast.dismiss();
      toast.error(signInReply.error);
    }
  };

  return (
    <FormContainer>
      <form className="w-full text-center" onSubmit={submitHandler}>
        <Image src="/images/logo.JPEG" priority={true} width={180} height={80} alt="logo" className="m-auto" />
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
          Don&apos;t have an account yet?{" "}
          <Link href="/auth/signup" className="text-blue-800 underline">
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
  const router = useRouter();

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === confirmPassword) {
      toast.loading("Loading...");
      const data = await fetch("/api/auth/signup", {
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
      //error passwords do not match
      toast.dismiss();

      toast.error("Passwords do not match");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <FormContainer>
      <form className="w-full text-center" onSubmit={submitHandler}>
        <Image src="/images/logo.JPEG" priority={true} width={180} height={80} alt="logo" className="m-auto" />
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
        <FormButton>Sign Up</FormButton>
        <div>
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-800 underline">
            Sign In
          </Link>
          .
        </div>
      </form>
    </FormContainer>
  );
};
