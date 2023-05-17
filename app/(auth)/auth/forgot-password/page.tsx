import { ForgotPasswordForm } from "app/(auth)/AuthForms";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "pages/api/auth/[...nextauth]";
import React from "react";

export default async function ForgotPasswordPage() {
  const session = await getServerSession(authOptions);

  session ? redirect("/user/products") : null;
  return <ForgotPasswordForm />;
}
