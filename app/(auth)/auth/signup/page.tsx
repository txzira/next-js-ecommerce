import React from "react";
import { SignupForm } from "../../AuthForms";

export default function SignupPage(req) {
  console.log(req);
  return (
    <div>
      <SignupForm />
    </div>
  );
}
