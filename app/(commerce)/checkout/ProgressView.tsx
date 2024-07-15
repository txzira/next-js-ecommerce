import { ShippingMethod } from "@prisma/client";
import { USDollar } from "lib/utils";
import React from "react";

const ProgressView = ({
  email,
  shippingAddress,
  billingAddress,
  shippingMethod,
  step,
  setStep,
}: {
  email: string;
  shippingAddress: CustomerInfoProps;
  billingAddress: CustomerInfoProps;
  shippingMethod: {
    method: ShippingMethod | undefined;
    error: string;
  };
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="rounded-md border bg-white shadow-md">
      {step >= 1 && (
        <>
          <div className="flex w-full justify-between">
            <div>
              <h3 className="text-xl">Contact&nbsp;</h3>
              <span>{email}</span>
            </div>
            <p className="text-blue-600 underline" onClick={() => setStep(0)}>
              change
            </p>
          </div>
          <div className="border-b-2" />
          <div className="flex w-full justify-between">
            <div>
              <h3 className="text-xl">Ship To&nbsp;</h3>
              <p>
                <span>{shippingAddress.streetAddress},&nbsp;</span>
                {shippingAddress.streetAddress2 && (
                  <span>{shippingAddress.streetAddress2},&nbsp;</span>
                )}
                <span>{shippingAddress.city}</span>&nbsp;
                <span>{shippingAddress.state}</span>&nbsp;
                <span>{shippingAddress.postalCode}</span>,&nbsp;
                <span>{shippingAddress.country}</span>
              </p>
            </div>
            <p className="text-blue-600 underline" onClick={() => setStep(0)}>
              change
            </p>
          </div>
        </>
      )}
      {step >= 2 && (
        <>
          <div className="border-b-2" />
          <div className="flex w-full justify-between">
            <div>
              <h3 className="text-xl">Shipping Method</h3>
              <p>
                <span>{shippingMethod.method?.name}</span>&nbsp;·&nbsp;
                <span>{USDollar.format(shippingMethod.method?.price!)}</span>
              </p>
            </div>
            <p className="text-blue-600 underline" onClick={() => setStep(1)}>
              change
            </p>
          </div>
        </>
      )}
      {step >= 3 && (
        <>
          <div className="border-b-2" />
          <div className="flex w-full justify-between">
            <div>
              <h3 className="text-xl">Bill To&nbsp;</h3>
              <p>
                <span>{billingAddress.streetAddress},&nbsp;</span>
                {billingAddress.streetAddress2 && (
                  <span>{billingAddress.streetAddress2},&nbsp;</span>
                )}
                <span>{billingAddress.city}</span>&nbsp;
                <span>{billingAddress.state}</span>&nbsp;
                <span>{billingAddress.postalCode}</span>,&nbsp;
                <span>{billingAddress.country}</span>
              </p>
            </div>
            <p className="text-blue-600 underline" onClick={() => setStep(2)}>
              change
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressView;
