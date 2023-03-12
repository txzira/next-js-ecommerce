import React from "react";
import AccountHistory from "./AccountHistory";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function page() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <AccountHistory session={session} />
    </div>
  );
}
