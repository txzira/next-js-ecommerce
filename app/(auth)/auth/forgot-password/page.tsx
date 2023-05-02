import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "pages/api/auth/[...nextauth]";
import React from "react";

export default async function ForgotPasswordPage() {
  const session = await getServerSession(authOptions);

  session ? redirect("/user/products") : null;
  return (
    <div>
      <form>
        <div>
          <label></label>
        </div>
      </form>
    </div>
  );
}
