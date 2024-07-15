import React from "react";

import { ResetPasswordForm } from "app/(auth)/AuthForms";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

export default async function ForgotPasswordPage() {
  const session = await getServerSession(authOptions);
  return session ? redirect("/products") : <ResetPasswordForm />;
}
