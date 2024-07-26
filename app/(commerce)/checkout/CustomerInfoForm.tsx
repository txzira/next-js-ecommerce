"use client";
import React, { useEffect, useState } from "react";
import countries from "../../../lib/countries.json";
import FormInput from "app/(components)/FormInput";
import { z, ZodType } from "zod";
import { ShippingMethod } from "@prisma/client";

const CustomerInfoForm = ({
  customerInfo,
  setCustomerInfo,
  isShipping,
  setShippingMethods,
  errors,
}: {
  customerInfo: {
    addressInfo: CustomerInfoProps;
    addressInfoErrors: CustomerInfoErrorProps;
  };
  setCustomerInfo: React.Dispatch<
    React.SetStateAction<{
      addressInfo: CustomerInfoProps;
      addressInfoErrors: CustomerInfoErrorProps;
    }>
  >;
  isShipping: boolean;
  setShippingMethods:
    | React.Dispatch<React.SetStateAction<ShippingMethod[]>>
    | undefined;
  errors: CustomerInfoErrorProps;
}) => {
  const [statesList, setStatesList] = useState<any[] | undefined>([]);

  const onSelectCountry = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (isShipping) {
      showStates(event);
      fetch(`/checkout/get-shipping-methods?country=${event.target.value}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          data.status === 200
            ? setShippingMethods!(data.shippingMethods)
            : null;
        });
    } else {
      setCustomerInfo({
        ...customerInfo,
        addressInfo: {
          ...customerInfo.addressInfo,
          country: event.target.value,
        },
      });
    }
  };

  const showStates = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value)
      for (let i = 0; i < countries.length; i++) {
        if (event.target.value === countries[i].code) {
          if (countries[i].states!.length) {
            setCustomerInfo({
              ...customerInfo,
              addressInfo: {
                ...customerInfo.addressInfo,
                state: countries[i].states![0].abbreviation,
                country: event.target.value,
              },
            });
            setStatesList(countries[i].states);
          }
        }
      }
    else {
      setStatesList([]);
      setCustomerInfo({
        ...customerInfo,
        addressInfo: { ...customerInfo.addressInfo, state: "", country: "" },
      });
    }
  };
  useEffect(() => {
    if (isShipping && customerInfo.addressInfo.country) {
      for (let i = 0; i < countries.length; i++) {
        if (customerInfo.addressInfo.country === countries[i].code) {
          if (countries[i].states!.length) {
            setStatesList(countries[i].states);
          }
        }
      }
    }
  }, []);

  return (
    <div className="m-2">
      {/* // First and Last Name row */}
      <div className="flex flex-row justify-between">
        <FormInput
          id="firstName"
          className="flex w-[45%] flex-col"
          label="First Name"
          value={customerInfo.addressInfo.firstName}
          placeholder="John"
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setCustomerInfo({
              ...customerInfo,
              addressInfo: {
                ...customerInfo.addressInfo,
                firstName: event.target.value,
              },
            })
          }
          required={true}
          error={errors.firstName}
        />
        <FormInput
          id="lastName"
          className="flex w-[45%] flex-col"
          label="Last Name"
          value={customerInfo.addressInfo.lastName}
          placeholder="Parker"
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setCustomerInfo({
              ...customerInfo,
              addressInfo: {
                ...customerInfo.addressInfo,
                lastName: event.target.value,
              },
            })
          }
          required={true}
          error={errors.lastName}
        />
      </div>
      {/* // Country row */}
      <div className="flex flex-col">
        <label htmlFor="country" className="text-base font-semibold sm:text-lg">
          Country
        </label>
        <select
          className="h-10 rounded-md border border-gray-400 px-1 text-sm sm:text-base"
          id="country"
          onChange={(event) => onSelectCountry(event)}
          value={customerInfo.addressInfo.country}>
          <option value="" disabled selected>
            --Select Country--
          </option>
          {isShipping
            ? countries.map((country) => {
                return (
                  country.shipping && (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  )
                );
              })
            : countries.map((country) => {
                return (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                );
              })}
        </select>
        {errors.country && (
          <p className="text-sm text-red-500">*{errors.country}</p>
        )}
      </div>
      {/* // Street Address row */}
      <div className="flex flex-row justify-between">
        <FormInput
          id="streetAddress"
          className="flex w-1/2 flex-col"
          label="Street Address"
          placeholder="123 Rainy St."
          required={true}
          value={customerInfo.addressInfo.streetAddress}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setCustomerInfo({
              ...customerInfo,
              addressInfo: {
                ...customerInfo.addressInfo,
                streetAddress: event.target.value,
              },
            })
          }
          error={errors.streetAddress}
        />
        <FormInput
          id="streetAddress2"
          className="flex w-1/3 flex-col"
          label="Street Address 2"
          placeholder="Apt. 2"
          required={false}
          value={customerInfo.addressInfo.streetAddress2}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setCustomerInfo({
              ...customerInfo,
              addressInfo: {
                ...customerInfo.addressInfo,
                streetAddress2: event.target.value,
              },
            })
          }
          error={errors.streetAddress2}
        />
      </div>
      {/* // City State Zip row */}
      <div className="flex flex-row justify-between">
        <FormInput
          id="city"
          className="flex w-[33%] flex-col"
          label="City"
          value={customerInfo.addressInfo.city}
          placeholder="Berkley"
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setCustomerInfo({
              ...customerInfo,
              addressInfo: {
                ...customerInfo.addressInfo,
                city: event.target.value,
              },
            })
          }
          required={true}
          error={errors.city}
        />

        {isShipping ? (
          <div className="flex w-1/3 flex-col">
            <label
              className="text-base font-semibold sm:text-lg"
              htmlFor="state">
              State
            </label>
            <select
              className="h-10 rounded-md border border-gray-400 px-1 text-sm sm:text-base"
              onChange={(event) => {
                setCustomerInfo({
                  ...customerInfo,
                  addressInfo: {
                    ...customerInfo.addressInfo,
                    state: event.target.value,
                  },
                });
              }}
              value={customerInfo.addressInfo.state}>
              <option value="" disabled selected>
                --Select State---
              </option>
              {statesList &&
                statesList.map((state) => {
                  return (
                    <option key={state.abbreviation} value={state.abbreviation}>
                      {state.name}
                    </option>
                  );
                })}
            </select>
            <p className="text-[10px]">*Select country first</p>
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state}</p>
            )}
          </div>
        ) : (
          <FormInput
            id="state"
            className="flex w-[33%] flex-col"
            label="State"
            value={customerInfo.addressInfo.state}
            placeholder="California"
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setCustomerInfo({
                ...customerInfo,
                addressInfo: {
                  ...customerInfo.addressInfo,
                  state: event.target.value,
                },
              })
            }
            required={true}
            error={errors.state}
          />
        )}
        <FormInput
          id="postalCode"
          className="flex w-1/4 flex-col"
          label="Postal Code"
          value={customerInfo.addressInfo.postalCode}
          placeholder="25919"
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setCustomerInfo({
              ...customerInfo,
              addressInfo: {
                ...customerInfo.addressInfo,
                postalCode: event.target.value,
              },
            })
          }
          required={true}
          error={errors.postalCode}
        />
      </div>
    </div>
  );
};

export default CustomerInfoForm;
