import React from "react";
import { LoginForm } from "../../AuthForms";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  session ? redirect("/user/products") : null;
  return (
    <div className="flex md:justify-center h-full">
      <LoginForm />
    </div>
  );
}
