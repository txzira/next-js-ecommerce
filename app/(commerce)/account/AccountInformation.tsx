import Loader from "app/(components)/Loader";
import { useSession } from "next-auth/react";

import { validatePassword } from "pages/api/auth/[...nextauth]";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const AccountInformation = () => {
  const initalErrors = {
    uppercaseError: {
      error: "Must include at least 1 uppercase letter",
      status: false,
    },
    lowercaseError: {
      error: "Must include at least 1 lowercase letter.",
      status: false,
    },
    numberError: {
      error: "Must include at least 1 number.",
      status: false,
    },
    specialCharError: {
      error: "Must include at least 1 special character (!@#$%^&*).",
      status: false,
    },
    lengthError: {
      error: "Must be between 8-16 characters.",
      status: false,
    },
  };
  const session = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formErrors, setFormErrors] = useState(initalErrors);
  const [showErrors, setShowErrors] = useState(false);
  const [showNewPassValidationMark, setShowNewPassValidationMark] =
    useState(false);
  const [showConPassValidationMark, setShowConPassValidationMark] =
    useState(false);

  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [unfocused, setUnfocused] = useState(false);

  const handleErrors = (password: string) => {
    const errors = initalErrors;
    //uppercase validation
    password.match(/(?=.*[A-Z])/)
      ? (errors.uppercaseError.status = true)
      : (errors.uppercaseError.status = false);
    //lowercase validation
    password.match(/(?=.*[a-z])/)
      ? (errors.lowercaseError.status = true)
      : (errors.lowercaseError.status = false);
    //number validation
    password.match(/(?=.*\d)/)
      ? (errors.numberError.status = true)
      : (errors.numberError.status = false);
    //special character validation
    password.match(/(?=.*[!@#$%^&*])/)
      ? (errors.specialCharError.status = true)
      : (errors.specialCharError.status = false);
    //length validation
    password.match(/^.{8,16}$/)
      ? (errors.lengthError.status = true)
      : (errors.lengthError.status = false);
    validatePassword(password)
      ? setPasswordValid(true)
      : setPasswordValid(false);
    setFormErrors(errors);
  };
  const handleValidation = (
    event: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    event.preventDefault();
    handleErrors(newPassword);
    setUnfocused(true);
    if (validatePassword(newPassword)) {
      setShowErrors(false);
      setPasswordValid(true);
    } else {
      setShowErrors(true);
      setPasswordValid(false);
    }
    setShowNewPassValidationMark(true);
  };
  const handleNewPasswordOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setNewPassword(event.target.value);
    handleErrors(event.target.value);
    event.target.value === confirmPassword
      ? setPasswordsMatch(true)
      : setPasswordsMatch(false);
    unfocused
      ? validatePassword(event.target.value)
        ? setShowErrors(false)
        : setShowErrors(true)
      : null;
  };

  const handleConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const cPassword = event.target.value;
    setConfirmPassword(cPassword);
    if (newPassword.length === cPassword.length) {
      setShowConPassValidationMark(true);
      newPassword === cPassword
        ? setPasswordsMatch(true)
        : setPasswordsMatch(false);
    } else {
      setPasswordsMatch(false);
    }
  };
  const changePassword = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (newPassword === confirmPassword) {
      if (validatePassword(newPassword)) {
        const data = await fetch("/account/change-password", {
          method: "POST",
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        });
        const response = await data.json();
        if (response.status === 200) {
          toast.success(response.message);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setFormErrors(initalErrors);
          setShowConPassValidationMark(false);
          setShowNewPassValidationMark(false);
        } else {
          toast.error(response.message);
        }
      } else {
        toast.error("Invalid Password");
      }
    } else {
      toast.error("New passwords do not match");
    }
  };

  return (
    <div className="mx-2 rounded-xl border-2 border-black bg-white p-2 shadow-lg">
      <h1 className="whitespace-nowrap pb-5 text-2xl font-bold">
        Customer Information
      </h1>
      <div className="flex flex-row gap-5">
        <div>
          <h2 className="text-lg font-semibold">Full Name</h2>
          <div>{session.data?.user.name}</div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Email</h2>
          <div>{session.data?.user.email}</div>
        </div>
      </div>
      <form>
        <h1 className="text-lg font-semibold">Change Password</h1>
        <div className="flex w-1/2 flex-col pb-2">
          <label>Current Password</label>
          <input
            type="password"
            className="border-[1px] border-black"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </div>
        <div className="flex w-1/2 flex-col pb-2">
          <label>New Password</label>
          <div className="flex flex-row items-center ">
            <input
              type="password"
              className={`border-[1px] border-black ${
                showNewPassValidationMark
                  ? passwordValid
                    ? "!border-2 border-green-700"
                    : "!border-2 border-red-600"
                  : null
              } `}
              value={newPassword}
              onChange={(event) => handleNewPasswordOnChange(event)}
              onBlur={(event) => handleValidation(event)}
            />
            <div>
              {showNewPassValidationMark ? (
                passwordValid ? (
                  <AiOutlineCheckCircle size={28} color="green" />
                ) : (
                  <AiOutlineCloseCircle size={28} color="red" />
                )
              ) : null}
            </div>
          </div>
          {showErrors ? (
            <ul className="ml-5 list-inside list-disc text-left text-xs">
              <li
                className={`${
                  formErrors.uppercaseError.status
                    ? "text-green-700"
                    : "text-red-600"
                }`}>
                {formErrors.uppercaseError.error}
              </li>
              <li
                className={`${
                  formErrors.lowercaseError.status
                    ? "text-green-700"
                    : "text-red-600"
                }`}>
                {formErrors.lowercaseError.error}
              </li>
              <li
                className={`${
                  formErrors.numberError.status
                    ? "text-green-700"
                    : "text-red-600"
                }`}>
                {formErrors.numberError.error}
              </li>
              <li
                className={`${
                  formErrors.specialCharError.status
                    ? "text-green-700"
                    : "text-red-600"
                }`}>
                {formErrors.specialCharError.error}
              </li>
              <li
                className={`${
                  formErrors.lengthError.status
                    ? "text-green-700"
                    : "text-red-600"
                }`}>
                {formErrors.lengthError.error}
              </li>
            </ul>
          ) : null}
        </div>
        <div className="flex w-1/2 flex-col pb-2">
          <label className="whitespace-nowrap">Re-type New Password</label>
          <div className="flex flex-row items-center">
            <input
              type="password"
              className={`border-[1px] border-black ${
                showConPassValidationMark
                  ? passwordsMatch
                    ? "!border-2 border-green-700"
                    : "!border-2 border-red-600"
                  : null
              }`}
              value={confirmPassword}
              onChange={(event) => handleConfirmPassword(event)}
            />
            <div>
              {showConPassValidationMark ? (
                passwordsMatch ? (
                  <AiOutlineCheckCircle size={28} color="green" />
                ) : (
                  <div className="flex flex-row items-center">
                    <AiOutlineCloseCircle size={28} color="red" />{" "}
                    <span className="whitespace-nowrap text-[10px] text-red-600">
                      Passwords do not match.
                    </span>
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
        <button
          className="rounded-full bg-blue-800 p-2 text-white"
          onClick={(event) => changePassword(event)}>
          Change Password
        </button>
      </form>
    </div>
  );
};
export default AccountInformation;
// // console.log(window.matchMedia("(min-width: 768px)").matches);
