import React from "react";
import { SignupForm } from "../../AuthForms";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  session ? redirect("/user/products") : null;
  return (
    <div>
      <SignupForm />
    </div>
  );
}
