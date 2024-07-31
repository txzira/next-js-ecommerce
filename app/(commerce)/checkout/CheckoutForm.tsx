"use client";
import React, { useEffect, useState } from "react";
import ProgressView from "./ProgressView";
import { useRouter } from "next/navigation";
import CustomerInfoForm from "./CustomerInfoForm";
import FormInput from "app/(components)/FormInput";
import { ZodType, z } from "zod";
import { ShippingMethod } from "@prisma/client";
import ShippingMethodForm from "./ShippingMethodForm";
import { useCartState } from "app/CartProvider";
import PaymentForm from "./PaymentForm";
import OrderReview from "./OrderReview";
import { Stripe, StripeElements } from "@stripe/stripe-js";
import toast from "react-hot-toast";

const INITIALCUSTOMERINFO: CustomerInfoProps = {
  firstName: "",
  lastName: "",
  streetAddress: "",
  streetAddress2: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  phone: "",
};

const customerInfoSchema: ZodType<CustomerInfoProps> = z.object({
  firstName: z
    .string({ required_error: "First name is required." })
    .min(1, "First name is required."),
  lastName: z
    .string({ required_error: "Last name is required." })
    .min(1, "Last name is required."),
  streetAddress: z
    .string({ required_error: "Street address is required." })
    .min(1, "Street address is required."),
  streetAddress2: z.string(),
  city: z
    .string({ required_error: "City is required." })
    .min(1, "City is required."),
  state: z
    .string({ required_error: "State is required." })
    .min(1, "State is required."),
  country: z
    .string({ required_error: "Country is required." })
    .min(1, "Country is required."),
  postalCode: z
    .string({ required_error: "Postal code is required." })
    .min(1, "Postal code is required."),
  phone: z.string(),
});

const emailSchema: ZodType<string> = z.string().email();

const CheckoutForm = ({
  shippingMethods,
  setShippingMethods,
  clientSecret,
  paymentIntent,
  orderTotalDetails,
  setOrderTotalDetails,
}: {
  shippingMethods: ShippingMethod[];
  setShippingMethods: React.Dispatch<React.SetStateAction<ShippingMethod[]>>;
  clientSecret: string;
  paymentIntent: string;
  orderTotalDetails: {
    orderTotal: number;
    calculatedTax: number;
    minimumCharged: boolean;
    shippingTotal: number;
  };
  setOrderTotalDetails: React.Dispatch<
    React.SetStateAction<{
      orderTotal: number;
      calculatedTax: number;
      minimumCharged: boolean;
      shippingTotal: number;
    }>
  >;
}) => {
  const { cartItems, clearCart } = useCartState();
  const [checkoutState, setCheckoutState] = useState(0);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState({ error: { email: "" } });

  const [shippingAddress, setShippingAddress] = useState<{
    addressInfo: CustomerInfoProps;
    addressInfoErrors: CustomerInfoErrorProps;
  }>({ addressInfo: INITIALCUSTOMERINFO, addressInfoErrors: {} });

  const [billingAddress, setBillingAddress] = useState<{
    addressInfo: CustomerInfoProps;
    addressInfoErrors: CustomerInfoErrorProps;
  }>({ addressInfo: INITIALCUSTOMERINFO, addressInfoErrors: {} });

  const [shippingMethod, setShippingMethod] = useState<{
    method: ShippingMethod | undefined;
    error: string;
  }>({ method: undefined, error: "" });
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(false);
  const [disablePaymentButton, setDisablePaymentButton] = useState(true);

  const [stripeElements, setStripeElements] = useState<StripeElements | null>(
    null
  );
  const [stripe, setStripe] = useState<Stripe | null>(null);

  const validateCustomerInfo = (
    customerInfo: {
      addressInfo: CustomerInfoProps;
      addressInfoErrors: CustomerInfoErrorProps;
    },
    setCustomerInfo: React.Dispatch<
      React.SetStateAction<{
        addressInfo: CustomerInfoProps;
        addressInfoErrors: CustomerInfoErrorProps;
      }>
    >
  ) => {
    let result = false;
    if (checkoutState === 0) {
      const emailResult = emailSchema.safeParse(email);
      if (emailResult.success) {
        setEmailError({ error: { email: "" } });
        result = true;
      } else {
        setEmailError({
          error: { email: emailResult.error.issues[0].message },
        });
        result = false;
      }
    }
    const customerInfoResult = customerInfoSchema.safeParse(
      customerInfo.addressInfo
    );
    if (customerInfoResult.success) {
      setCustomerInfo({
        ...shippingAddress,
        addressInfoErrors: {
          firstName: "",
          lastName: "",
          streetAddress: "",
          streetAddress2: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          phone: "",
        },
      });
      result = true;
    } else {
      const _shippingAddressErrors: any = {};
      customerInfoResult.error.issues.map((error: z.ZodIssue) => {
        _shippingAddressErrors[error.path[0]] = error.message;
      });
      setCustomerInfo({
        ...customerInfo,
        addressInfoErrors: _shippingAddressErrors,
      });

      result = false;
    }
    return result;
  };

  const nextStep = () => {
    switch (checkoutState) {
      case 0:
        validateCustomerInfo(shippingAddress, setShippingAddress)
          ? setCheckoutState(1)
          : null;
        break;
      case 1:
        if (shippingMethod.method) {
          setShippingMethod({ ...shippingMethod, error: "" });
          fetch("/checkout/add-order-tax-and-shipping", {
            method: "POST",
            body: JSON.stringify({
              cartItems,
              paymentIntent,
              shippingMethod: shippingMethod.method,
              shippingAddress: shippingAddress.addressInfo,
            }),
          })
            .then((response) => response.json())
            .then((data: any) => {
              setOrderTotalDetails({
                ...orderTotalDetails,
                orderTotal: data.orderTotal,
                calculatedTax: data.calculatedTax,
              });
            });
          setCheckoutState(2);
        } else
          setShippingMethod({
            ...shippingMethod,
            error: "Choose a shipping method.",
          });
        break;
      case 2:
        validateCustomerInfo(shippingAddress, setShippingAddress)
          ? setCheckoutState(3)
          : null;
        break;
      default:
        setCheckoutState(checkoutState + 1);
        break;
    }
  };

  const prevStep = () => {
    setCheckoutState(checkoutState - 1);
  };

  const submitPaymentForm = async () => {
    toast.loading("Loading...");
    if (
      customerInfoSchema.safeParse(shippingAddress.addressInfo).success &&
      customerInfoSchema.safeParse(billingAddress.addressInfo).success &&
      !disablePaymentButton
    ) {
      if (stripe && stripeElements) {
        let order = (await fetch("/checkout/create-order", {
          method: "POST",
          body: JSON.stringify({
            email,
            requestCart: cartItems,
            shippingMethod: shippingMethod.method,
            calculatedTax: orderTotalDetails.calculatedTax,
            orderTotal: orderTotalDetails.orderTotal,
            paymentIntentId: paymentIntent,
          }),
        })) as any;

        order = await order.json();

        stripe
          .confirmPayment({
            elements: stripeElements,
            confirmParams: {
              return_url: process.env.NEXT_PUBLIC_PRODUCTION
                ? "http://next-js-ecommerce-vert-pi.vercel.app/"
                : "http://localhost:3000/",
              shipping: {
                name: `${
                  shippingAddress.addressInfo.firstName +
                  " " +
                  shippingAddress.addressInfo.lastName
                }`,
                phone: shippingAddress.addressInfo.phone,
                address: {
                  country: shippingAddress.addressInfo.country,
                  line1: shippingAddress.addressInfo.streetAddress,
                  line2: shippingAddress.addressInfo.streetAddress2,
                  city: shippingAddress.addressInfo.city,
                  state: shippingAddress.addressInfo.state,
                  postal_code: shippingAddress.addressInfo.postalCode,
                },
              },

              payment_method_data: {
                billing_details: {
                  email: email,
                  name: `${
                    billingAddress.addressInfo.firstName +
                    " " +
                    billingAddress.addressInfo.lastName
                  }`,
                  phone: billingAddress.addressInfo.phone,
                  address: {
                    country: billingAddress.addressInfo.country,
                    line1: billingAddress.addressInfo.streetAddress,
                    line2: billingAddress.addressInfo.streetAddress2,
                    city: billingAddress.addressInfo.city,
                    state: billingAddress.addressInfo.state,
                    postal_code: billingAddress.addressInfo.postalCode,
                  },
                },
              },
            },
            redirect: "if_required",
          })
          .then((result) => {
            if (result.error) {
              console.log(result.error);
              // deleted prisma created order/cart/cartItems
            } else {
              if (
                result.paymentIntent.status === "succeeded" ||
                result.paymentIntent.status === "processing"
              ) {
                fetch("/checkout/update-order", {
                  method: "POST",
                  body: JSON.stringify({
                    orderId: order.order.id,
                    requestShippingForm: shippingAddress.addressInfo,
                    requestBillingForm: billingAddress.addressInfo,
                    requestCart: cartItems,
                    shippingMethod: shippingMethod.method,
                    calculatedTax: orderTotalDetails.calculatedTax,
                    orderTotal: orderTotalDetails.orderTotal,
                    paymentIntentId: result.paymentIntent.id,
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log(data);
                    if (data.message === "success") {
                      clearCart();
                      const url = new URL(
                        "/checkout/order-confirmation",
                        process.env.NEXT_PUBLIC_BASE_URL
                      );
                      url.searchParams.append("orderNumber", data.order.id);
                      url.searchParams.append("email", data.order.email);
                      router.push(url.href);
                      toast.dismiss();
                      toast.success("Thank you for your patronage!");
                    }
                  });
              } else {
                toast.dismiss();

                toast.error("Payment failed!");
              }
            }
          });
      } else {
        //Stripe not loaded related error
        toast.dismiss();

        console.log("Stripe Error");
      }
    } else {
      //notify user form not valid
      toast.dismiss();

      console.log("Form not valid.");
    }
  };

  return (
    <div className=" flex flex-col gap-10  sm:w-1/2 ">
      <ProgressView
        email={email}
        shippingAddress={shippingAddress.addressInfo}
        billingAddress={billingAddress.addressInfo}
        step={checkoutState}
        setStep={setCheckoutState}
        shippingMethod={shippingMethod}
      />

      <form className="rounded-md border bg-white shadow-md">
        {checkoutState === 0 && (
          <div className="w-full">
            <section>
              <h1 className="mx-2 text-xl font-medium">Contact</h1>
              <FormInput
                id="email"
                className="m-2 flex flex-col"
                label="Email"
                placeholder="example@example.com"
                required={true}
                value={email}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  setEmail(event.target.value);
                }}
                error={emailError.error.email}
              />
            </section>
            <section>
              <h1 className="mx-2 text-xl font-medium">Shipping Address</h1>
              <CustomerInfoForm
                customerInfo={shippingAddress}
                setCustomerInfo={setShippingAddress}
                isShipping={true}
                setShippingMethods={setShippingMethods}
                errors={shippingAddress.addressInfoErrors}
              />
            </section>
            <div className="flex w-full justify-end">
              <button
                className="m-2 flex justify-end bg-[#3f51b5] px-2 py-1 text-white"
                onClick={() => nextStep()}>
                Continue to Shipping
              </button>
            </div>
          </div>
        )}
        {checkoutState === 1 && (
          <div className="w-full">
            <section>
              <h1 className="mx-2 text-xl font-medium">Shipping Method</h1>
              <ShippingMethodForm
                shippingMethods={shippingMethods}
                shippingMethod={shippingMethod}
                setShippingMethod={setShippingMethod}
                orderTotalDetails={orderTotalDetails}
                setOrderTotalDetails={setOrderTotalDetails}
              />
            </section>
            <div className="flex w-full justify-between">
              <button
                className="m-2 bg-[#3f51b5] px-2 py-1 text-white"
                onClick={() => prevStep()}>
                Back to Contact
              </button>
              <button
                className="m-2  bg-[#3f51b5] px-2 py-1 text-white"
                onClick={() => nextStep()}>
                Continue to Billing
              </button>
            </div>
          </div>
        )}
        {checkoutState === 2 && (
          <div className="w-full">
            <section>
              <h1 className="mx-2 text-xl font-medium">Billing Address</h1>
              <div className="flex flex-row gap-3">
                <input
                  type="checkbox"
                  checked={shippingSameAsBilling}
                  onChange={() => {
                    const checked = !shippingSameAsBilling;
                    setShippingSameAsBilling(checked);
                    checked
                      ? setBillingAddress(shippingAddress)
                      : setBillingAddress({
                          addressInfo: INITIALCUSTOMERINFO,
                          addressInfoErrors: {},
                        });
                  }}
                />
                <label>Shipping same as billing</label>
              </div>
              {!shippingSameAsBilling && (
                <CustomerInfoForm
                  customerInfo={billingAddress}
                  setCustomerInfo={setBillingAddress}
                  isShipping={false}
                  setShippingMethods={undefined}
                  errors={billingAddress.addressInfoErrors}
                />
              )}
            </section>
            <div className="flex w-full justify-between">
              <button
                className="m-2 bg-[#3f51b5] px-2 py-1 text-white"
                onClick={() => prevStep()}>
                Back to Billing
              </button>
              <button
                className="m-2  bg-[#3f51b5] px-2 py-1 text-white"
                onClick={() => nextStep()}>
                Continue to Payment
              </button>
            </div>
          </div>
        )}
        {checkoutState === 3 && (
          <div>
            <section>
              <h1 className="mx-2 text-xl font-medium">Payment</h1>
              <PaymentForm
                clientSecret={clientSecret}
                setDisablePaymentButton={setDisablePaymentButton}
                setStripe={setStripe}
                setStripeElements={setStripeElements}
              />
              <section className="sm:hidden">
                <h1 className="mx-2 text-xl font-medium">Order Review</h1>

                <OrderReview
                  shippingTotal={shippingMethod.method!.price}
                  orderTotal={orderTotalDetails.orderTotal}
                  calculatedTax={orderTotalDetails.calculatedTax}
                />
              </section>
            </section>
            <div className="flex w-full justify-between">
              <button
                className="m-2 bg-[#3f51b5] px-2 py-1 text-white"
                onClick={() => prevStep()}>
                Back to Shipping
              </button>
              <button
                className={`m-2  ${
                  !disablePaymentButton
                    ? "animate-bounce bg-[#3f51b5]"
                    : "bg-slate-400"
                }  px-2 py-1 text-white`}
                type="button"
                onClick={() => submitPaymentForm()}
                disabled={disablePaymentButton}>
                Pay Now
              </button>
            </div>
          </div>
        )}
      </form>

      {/* <OrderReview cart={cart} mutate={cartMutate} placeOrder={placeOrder} /> */}
    </div>
  );
};

export default CheckoutForm;
