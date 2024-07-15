import { ShippingMethod } from "@prisma/client";
import Loader from "app/Loader";
import { USDollar } from "lib/utils";
import React from "react";

const ShippingMethodForm = ({
  shippingMethods,
  shippingMethod,
  setShippingMethod,
  orderTotalDetails,
  setOrderTotalDetails,
}: {
  shippingMethods: ShippingMethod[];
  shippingMethod: {
    method: ShippingMethod | undefined;
    error: string;
  };
  setShippingMethod: React.Dispatch<
    React.SetStateAction<{
      method: ShippingMethod | undefined;
      error: string;
    }>
  >;
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
  return (
    <div>
      {shippingMethods.length ? (
        <div>
          {shippingMethods.map((_shippingMethod) => {
            return (
              <div key={_shippingMethod.id} className="flex w-full flex-row">
                <input
                  name="shippingMethod"
                  type="radio"
                  value={_shippingMethod.id}
                  onClick={() => {
                    setShippingMethod({
                      ...shippingMethod,
                      method: _shippingMethod,
                    });
                    setOrderTotalDetails({
                      ...orderTotalDetails,
                      shippingTotal: _shippingMethod.price,
                    });
                  }}
                  checked={shippingMethod.method?.id === _shippingMethod.id}
                />
                <label className="ml-2 flex w-full flex-row justify-between">
                  <span>{_shippingMethod.name}</span>
                  <span>{USDollar.format(_shippingMethod.price)}</span>
                </label>
              </div>
            );
          })}
          {shippingMethod.error && (
            <p className="text-sm text-red-500">{shippingMethod.error}</p>
          )}
        </div>
      ) : (
        <div>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default ShippingMethodForm;

{
  /* <div *ngIf="shippingMethods.length">
<mat-radio-group
  aria-label="Select an option"
  (change)="selectedShippingMethod = $event.value"
  name="shippingMethod"
  class="flex flex-col"
>
  <mat-radio-button
    *ngFor="let shippingMethod of shippingMethods"
    [value]="shippingMethod"
    name="shippingMethod"
  >
    <span
      >{{ shippingMethod.name }}&nbsp;-&nbsp;{{
        shippingMethod.price | currency
      }}</span
    >
  </mat-radio-button>
</mat-radio-group>
</div> */
}
