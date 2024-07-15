import React, { useEffect } from "react";
import { Stripe, StripeElements, loadStripe } from "@stripe/stripe-js";

const PaymentForm = ({
  clientSecret,
  setDisablePaymentButton,
  setStripe,
  setStripeElements,
}: {
  clientSecret: string;
  setDisablePaymentButton: React.Dispatch<React.SetStateAction<boolean>>;
  setStripe: React.Dispatch<React.SetStateAction<Stripe | null>>;
  setStripeElements: React.Dispatch<
    React.SetStateAction<StripeElements | null>
  >;
}) => {
  useEffect(() => {
    loadStripe(
      "pk_test_51JpGR9IZK4v7qkytzmvxTLa0C4AtaOLAaxGxWKBxc5CL1US3qFCf9pWfUPnc6OhkxL2Xv5s97uSjQAgv73KyDTWI006SYC716Q"
    ).then((stripe) => {
      if (stripe) {
        const elements = stripe.elements({
          appearance: { theme: "stripe" },
          clientSecret: clientSecret,
        });
        setStripeElements(elements);
        setStripe(stripe);

        const payment = elements.create("payment", {
          layout: "tabs",
          fields: { billingDetails: "never" },
        });

        payment.on("change", (event) => {
          if (!event.empty && event.complete) {
            //enable payment button
            setDisablePaymentButton(false);
          } else {
            //disable payment button
            setDisablePaymentButton(true);
          }
        });
        payment.mount("#payment-element");
      }
    });
  }, []);

  return (
    <div>
      <div id="payment-element" />
      <div id="payment-message" className="hidden" />
      {/* <div *ngIf="paymentError">
                <p>{{ paymentError.message }}</p>
                <ul class="list-disc text-red-600">
                  <li *ngFor="let item of paymentError.products">
                    {{ item.productName
                    }}{{ item.isVariant ? ": " + item.variantName : null }}
                  </li>
                </ul>
              </div> */}
      {/* <!--Stripe.js injects the Payment Element--> */}
    </div>
  );
};

export default PaymentForm;

{
  /* <div className="flex flex-row justify-between">
                <button mat-button matStepperPrevious>Back</button>

                <button
                  id="submit"
                  mat-raised-button
                  color="primary"
                  type="submit"
                  [disabled]="
                    checkoutForm.invalid ||
                    disablePaymentButton ||
                    !selectedShippingMethod ||
                    calculatedTax === undefined
                  "
                >
                  <div class="spinner hidden" id="spinner"></div>
                  Pay now
                </button>
              </div> */
}
