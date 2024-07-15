"use client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function Page() {
  const token = useParams()?.token;
  useEffect(() => {
    const confirmEmail = async () => {
      const data = await fetch(`/auth/verify/confirmed/${token}`, {
        method: "PATCH",
      });
      const response = await data.json();
      if (response.status === 200) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    };
    if (token) {
      confirmEmail();
    }
  }, [token]);
  return <div>page</div>;
}
