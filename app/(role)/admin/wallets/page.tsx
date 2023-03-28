"use client";
import React, { useState } from "react";
import { WalletAddressForm, WalletAddressList, WalletTypeForm, WalletTypeList } from "./WalletPortal";
import useSWR from "swr";
import Loader from "app/Loader";

export default function WalletPage() {
  const [show, setShow] = useState(false);
  const fetcher = (url) => fetch(url, { method: "GET" }).then((res) => res.json());

  const {
    data: walletTypesData,
    error: walletTypesError,
    isLoading: walletTypesIsLoading,
    mutate: walletTypesMutate,
  } = useSWR("/admin/wallets/get-wallet-types", fetcher);

  const {
    data: walletAddressesData,
    error: walletAddressesError,
    isLoading: walletAdressesIsLoading,
    mutate: walletAddressesMutate,
  } = useSWR("/admin/wallets/get-wallet-addresses", fetcher);
  return (
    <div className="h-full">
      <h1 className="text-3xl font-bold">Wallets</h1>
      <div>
        <div className=" border-2 border-black px-10 pt-5 pb-10 ">
          <h1 className="text-2xl">Wallet Types</h1>
          <div className="flex flex-col ">
            <WalletTypeForm walletTypesMutate={walletTypesMutate} />
            <div className="border-b-[1px] border-gray-400 my-5"></div>
            <WalletTypeList walletTypesData={walletTypesData} isLoading={walletTypesIsLoading} walletTypesMutate={walletTypesMutate} />
          </div>
        </div>
        <div className="border-b-[1px] border-gray-400 my-5"></div>

        <div className=" border-2 border-black px-10 pt-5 pb-10 ">
          <h1 className="text-2xl">Wallet Addresses</h1>
          {!walletTypesIsLoading ? (
            walletTypesData.walletTypes.length > 0 ? (
              <WalletAddressForm walletTypes={walletTypesData.walletTypes} walletAddressesMutate={walletAddressesMutate} />
            ) : null
          ) : (
            <Loader />
          )}
          <div className="border-b-[1px] border-gray-400 my-5"></div>
          {!walletAdressesIsLoading && !walletTypesIsLoading ? (
            walletAddressesData && walletTypesData ? (
              <WalletAddressList
                walletAddresses={walletAddressesData.walletAddress}
                walletAddressesMutate={walletAddressesMutate}
                walletTypes={walletTypesData.walletTypes}
              />
            ) : null
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
}
