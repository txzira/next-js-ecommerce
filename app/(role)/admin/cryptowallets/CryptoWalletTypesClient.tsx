import { CryptoWalletType as TCryptoWalletType } from "@prisma/client";
import Loader from "app/Loader";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { KeyedMutator } from "swr";

export default function CryptoWalletType({
  cryptoWalletTypesData,
  cryptoWalletTypesIsLoading,
  cryptoWalletTypesMutate,
}: {
  cryptoWalletTypesData: TCryptoWalletType[];
  cryptoWalletTypesIsLoading: boolean;
  cryptoWalletTypesMutate: KeyedMutator<TCryptoWalletType[]>;
}) {
  return (
    <div className="px-2 py-3 border-2 border-black bg-white rounded-xl shadow-xl">
      <h2 className="pb-1 text-2xl font-semibold">Create Crypto Wallet Type</h2>
      <CryptoWalletTypeForm cryptoWalletTypesMutate={cryptoWalletTypesMutate} />
      <div className="border-b-[1px] border-gray-400 my-5"></div>
      <CryptoWalletTypeList
        cryptoWalletTypesData={cryptoWalletTypesData}
        cryptoWalletTypesIsLoading={cryptoWalletTypesIsLoading}
        cryptoWalletTypesMutate={cryptoWalletTypesMutate}
      />
    </div>
  );
}

function CryptoWalletTypeForm({ cryptoWalletTypesMutate }: { cryptoWalletTypesMutate: KeyedMutator<any> }) {
  const [cryptoWalletTypeName, setCryptoWalletTypeName] = useState("");

  const addCryptoWalletType = async () => {
    if (cryptoWalletTypeName === "") {
      toast.error("Cannot add empty wallet type.");
    } else {
      toast.loading("Loading...");
      const response = await fetch("/admin/cryptowallets/add-crypto-wallet-type", {
        method: "POST",
        body: JSON.stringify({ cryptoWalletTypeName }),
      });
      const message = await response.json();
      cryptoWalletTypesMutate();
      setCryptoWalletTypeName("");
      toast.dismiss();
      response.status === 201 ? toast.success(message) : toast.error(message);
    }
  };

  return (
    <form className="flex flex-row items-end">
      <div>
        <label className="pl-1">Crypto Wallet Type</label>
        <input
          type="text"
          className="pl-1 border-[1px] rounded-lg "
          value={cryptoWalletTypeName}
          placeholder="BTC"
          onChange={(event) => setCryptoWalletTypeName(event.target.value)}
        />
      </div>
      <button type="button" className="px-2 bg-green-500 text-white rounded-full" onClick={() => addCryptoWalletType()}>
        Add
      </button>
    </form>
  );
}

function CryptoWalletTypeList({
  cryptoWalletTypesData,
  cryptoWalletTypesIsLoading,
  cryptoWalletTypesMutate,
}: {
  cryptoWalletTypesData: TCryptoWalletType[];
  cryptoWalletTypesIsLoading: boolean;
  cryptoWalletTypesMutate: KeyedMutator<TCryptoWalletType[]>;
}) {
  const [cryptoWalletType, setCryptoWalletType] = useState<TCryptoWalletType>();
  return (
    <div className="grid text-center border-2 border-black rounded-lg ">
      <div className="grid grid-cols-1 border-b-2 border-black bg-black text-white text-lg p-1 font-semibold">
        <div>Wallet Type Name</div>
      </div>
      {!cryptoWalletTypesIsLoading ? (
        cryptoWalletTypesData.length > 0 ? (
          cryptoWalletTypesData.map((cryptoWalletType: TCryptoWalletType) => {
            return (
              <div
                key={cryptoWalletType.id}
                className="grid grid-cols-1 h-7 items-center hover:bg-white cursor-pointer even:bg-slate-300 last:rounded-b-md"
                onClick={() => setCryptoWalletType(cryptoWalletType)}
              >
                {cryptoWalletType.name}
              </div>
            );
          })
        ) : (
          <div className="text-center">No Crypto Wallet Types</div>
        )
      ) : (
        <div className="flex justify-center">
          <Loader />
        </div>
      )}
      {cryptoWalletType ? (
        <CryptoWalletTypeInfo
          cryptoWalletType={cryptoWalletType}
          setCryptoWalletType={setCryptoWalletType}
          cryptoWalletTypesMutate={cryptoWalletTypesMutate}
        />
      ) : null}
    </div>
  );
}

function CryptoWalletTypeInfo({
  cryptoWalletType,
  setCryptoWalletType,
  cryptoWalletTypesMutate,
}: {
  cryptoWalletType: TCryptoWalletType;
  setCryptoWalletType: React.Dispatch<React.SetStateAction<TCryptoWalletType>>;
  cryptoWalletTypesMutate: KeyedMutator<TCryptoWalletType[]>;
}) {
  const [cryptoWalletTypeName, setCryptoWalletTypeName] = useState(cryptoWalletType.name);
  const editCryptoWalletType = async () => {
    const response = await fetch("/admin/cryptowallets/edit-crypto-wallet-type", {
      method: "POST",
      body: JSON.stringify({ id: cryptoWalletType.id, cryptoWalletTypeName }),
    });
    const message = await response.json();
    cryptoWalletTypesMutate();
    setCryptoWalletType(null);
    response.status === 200 ? toast.success(message) : toast.error(message);
  };

  useEffect(() => {
    setCryptoWalletTypeName(cryptoWalletType.name);
  }, [cryptoWalletType]);

  return (
    <div
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 bg-black w-full md:inset-0 h-full z-50 overflow-y-scroll "
      onClick={() => setCryptoWalletType(null)}
    >
      <div className="relative w-2/3 rounded-lg p-2 md:h-auto m-auto bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col">
          <label className="text-lg font-semibold">Crypto Wallet Type Name</label>
          <div className="flex flex-row">
            <input
              type="text"
              className="pl-1 border-[1px] rounded-lg overflow-x-scroll"
              value={cryptoWalletTypeName}
              onChange={(event) => setCryptoWalletTypeName(event.target.value)}
            />
            <button type="button" className="bg-yellow-500 text-white rounded-full px-2 ml-5" onClick={editCryptoWalletType}>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
