"use client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function page() {
  const { token } = useParams();
  useEffect(() => {
    const confirmEmail = async () => {
      const data = await fetch(`/auth/verify/confirmed/${token}`, { method: "PATCH" });
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
  }, []);
  return <div>page</div>;
}
