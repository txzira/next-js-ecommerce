import React from "react";
import { LoginForm } from "../../AuthForms";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  console.log(session);
  session ? redirect("/products") : null;
  return (
    <div className="flex h-full md:justify-center">
      <LoginForm />
    </div>
  );
}
