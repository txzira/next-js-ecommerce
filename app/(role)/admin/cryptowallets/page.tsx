"use client";
import React from "react";
import { CryptoWalletForm, CryptoWalletList, CryptoWalletTypeForm, CryptoWalletTypeList } from "./CryptoWalletsClient";
import useSWR from "swr";
import Loader from "app/Loader";

export default function CryptoWalletPage() {
  const fetcher = (url) => fetch(url, { method: "GET" }).then((res) => res.json());

  const {
    data: cryptoWalletTypesData,
    error: cryptoWalletTypesError,
    isLoading: cryptoWalletTypesIsLoading,
    mutate: cryptoWalletTypesMutate,
  } = useSWR("/admin/cryptowallets/get-crypto-wallet-types", fetcher);

  const {
    data: cryptoWalletsData,
    error: cryptoWalletsError,
    isLoading: cryptoWalletsIsLoading,
    mutate: cryptoWalletsMutate,
  } = useSWR("/admin/cryptowallets/get-crypto-wallets", fetcher);
  return (
    <div className="h-full w-[90%] mx-auto">
      <h1 className="text-3xl font-bold pb-5">Crypto Wallets</h1>
      <div className="px-2 py-3 border-2 border-black bg-white rounded-xl shadow-xl">
        <h2 className="pb-1 text-2xl font-semibold">Create Crypto Wallet Type</h2>
        <CryptoWalletTypeForm cryptoWalletTypesMutate={cryptoWalletTypesMutate} />
        <div className="border-b-[1px] border-gray-400 my-5"></div>
        <CryptoWalletTypeList
          cryptoWalletTypesData={cryptoWalletTypesData}
          cryptoWalletIsLoading={cryptoWalletTypesIsLoading}
          cryptoWalletTypesMutate={cryptoWalletTypesMutate}
        />
      </div>
      <div className="border-b-[1px] border-gray-400 my-5"></div>
      <div className="border-2 border-black py-3 px-2 bg-white rounded-xl shadow-xl">
        <h2 className="pb-1 text-2xl font-semibold">Create Crypto Wallet</h2>
        {!cryptoWalletTypesIsLoading ? (
          cryptoWalletTypesData.cryptoWalletTypes &&
          cryptoWalletTypesData.cryptoWalletTypes.length >
            0 ? null : // <CryptoWalletForm cryptoWalletTypes={cryptoWalletTypesData.cryptoWalletTypes} cryptoWalletsMutate={cryptoWalletsMutate} />
          null
        ) : (
          <div className="flex justify-center">
            <Loader />
          </div>
        )}
        <div className="border-b-[1px] border-gray-400 my-5"></div>
        {!cryptoWalletsIsLoading && !cryptoWalletTypesIsLoading ? (
          cryptoWalletsData && cryptoWalletTypesData ? (
            <CryptoWalletList
              cryptoWallets={cryptoWalletsData.cryptoWallets}
              cryptoWalletsMutate={cryptoWalletsMutate}
              cryptoWalletTypes={cryptoWalletTypesData.cryptoWalletTypes}
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
