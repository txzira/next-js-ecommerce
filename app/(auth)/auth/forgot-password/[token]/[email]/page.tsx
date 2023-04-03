"use client";
import React, { useState } from "react";

export default function ForgotPasswordPage({ params }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(params);
  return (
    <div>
      <form>
        <h1>Forgot Password</h1>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="youremail@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <button name="reset-pwd-button" className="">
          {!loading ? "Get Secure Link" : "Sending..."}
        </button>
      </form>
    </div>
  );
}
