"use client";
import React from "react";
import CryptoWallet from "./CryptoWalletsClient";
import CryptoWalletType from "./CryptoWalletTypesClient";
import useSWR from "swr";
import { CryptoWallet as TCryptoWallet, CryptoWalletType as TCryptoWalletType } from "@prisma/client";

export default function CryptoWalletPage() {
  const {
    data: cryptoWalletTypesData,
    error: cryptoWalletTypesError,
    isLoading: cryptoWalletTypesIsLoading,
    mutate: cryptoWalletTypesMutate,
  } = useSWR<TCryptoWalletType[]>("/admin/cryptowallets/get-crypto-wallet-types", (url) =>
    fetch(url, { method: "GET" }).then((res) => res.json())
  );

  const {
    data: cryptoWalletsData,
    error: cryptoWalletsError,
    isLoading: cryptoWalletsIsLoading,
    mutate: cryptoWalletsMutate,
  } = useSWR<
    (TCryptoWallet & {
      type: TCryptoWalletType;
    })[]
  >("/admin/cryptowallets/get-crypto-wallets", (url) => fetch(url, { method: "GET" }).then((res) => res.json()));

  return (
    <div className="h-full w-[90%] mx-auto">
      <h1 className="text-3xl font-bold pb-5">Crypto Wallets</h1>
      <CryptoWalletType
        cryptoWalletTypesData={cryptoWalletTypesData}
        cryptoWalletTypesIsLoading={cryptoWalletTypesIsLoading}
        cryptoWalletTypesMutate={cryptoWalletTypesMutate}
      />
      <div className="border-b-[1px] border-gray-400 my-5"></div>
      <CryptoWallet
        cryptoWalletTypesData={cryptoWalletTypesData}
        cryptoWalletTypesIsLoading={cryptoWalletTypesIsLoading}
        cryptoWalletsData={cryptoWalletsData}
        cryptoWalletsIsLoading={cryptoWalletsIsLoading}
        cryptoWalletsMutate={cryptoWalletsMutate}
      />
    </div>
  );
}
