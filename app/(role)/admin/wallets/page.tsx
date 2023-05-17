"use client";
import React, { useState } from "react";
import { WalletAddressForm, WalletAddressList, WalletTypeForm, WalletTypeList } from "./Wallet";
import useSWR from "swr";
import Loader from "app/Loader";

export default function WalletPage() {
  const fetcher = (url) => fetch(url, { method: "GET" }).then((res) => res.json());

  const {
    data: walletTypesData,
    error: walletTypesError,
    isLoading: walletTypesIsLoading,
    mutate: walletTypesMutate,
  } = useSWR("/admin/wallets/get-wallet-types", fetcher, { refreshInterval: 1000 });

  const {
    data: walletAddressesData,
    error: walletAddressesError,
    isLoading: walletAdressesIsLoading,
    mutate: walletAddressesMutate,
  } = useSWR("/admin/wallets/get-wallet-addresses", fetcher, { refreshInterval: 1000 });
  return (
    <div className="h-full w-[90%] mx-auto">
      <h1 className="text-3xl font-bold pb-5">Wallets</h1>
      <div className="px-2 py-3 border-2 border-black bg-white rounded-xl shadow-xl">
        <h2 className="pb-1 text-2xl font-semibold">Create Wallet Type</h2>
        <WalletTypeForm walletTypesMutate={walletTypesMutate} />
        <div className="border-b-[1px] border-gray-400 my-5"></div>
        <WalletTypeList walletTypesData={walletTypesData} isLoading={walletTypesIsLoading} walletTypesMutate={walletTypesMutate} />
      </div>
      <div className="border-b-[1px] border-gray-400 my-5"></div>
      <div className="border-2 border-black py-3 px-2 bg-white rounded-xl shadow-xl">
        <h2 className="pb-1 text-2xl font-semibold">Create Wallet Address</h2>
        {!walletTypesIsLoading ? (
          walletTypesData.walletTypes.length > 0 ? (
            <WalletAddressForm walletTypes={walletTypesData.walletTypes} walletAddressesMutate={walletAddressesMutate} />
          ) : null
        ) : (
          <div className="flex justify-center">
            <Loader />
          </div>
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
          <div className="flex justify-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
