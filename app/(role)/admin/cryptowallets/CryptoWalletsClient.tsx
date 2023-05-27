import { CryptoWallet, CryptoWalletType } from "@prisma/client";
import Loader from "app/Loader";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { KeyedMutator } from "swr";

export function CryptoWalletTypeForm({ cryptoWalletTypesMutate }: { cryptoWalletTypesMutate: KeyedMutator<any> }) {
  const [cryptoWalletTypeName, setCryptoWalletTypeName] = useState("");

  const AddCryptoWalletType = async () => {
    if (cryptoWalletTypeName === "") {
      toast.error("Cannot add empty wallet type.");
    } else {
      toast.loading("Loading...");
      const data = await fetch("/admin/cryptowallets/add-crypto-wallet-type", {
        method: "POST",
        body: JSON.stringify({ cryptoWalletTypeName }),
      });
      const response = await data.json();
      cryptoWalletTypesMutate();
      setCryptoWalletTypeName("");
      toast.dismiss();
      toast.success(response.message);
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
      <button type="button" className="px-2 bg-green-500 text-white rounded-full" onClick={() => AddCryptoWalletType()}>
        Add
      </button>
    </form>
  );
}

export function CryptoWalletTypeList({
  cryptoWalletTypesData,
  cryptoWalletIsLoading,
  cryptoWalletTypesMutate,
}: {
  cryptoWalletTypesData: any;
  cryptoWalletIsLoading: boolean;
  cryptoWalletTypesMutate: KeyedMutator<any>;
}) {
  const [cryptoWalletType, setCryptoWalletType] = useState<CryptoWalletType>();
  return (
    <div className="grid text-center border-2 border-black rounded-lg ">
      <div className="grid grid-cols-1 border-b-2 border-black bg-black text-white text-lg p-1 font-semibold">
        <div>Wallet Type Name</div>
      </div>
      {!cryptoWalletIsLoading ? (
        cryptoWalletTypesData.cryptoWalletTypes ? (
          cryptoWalletTypesData.cryptoWalletTypes.map((walletType: CryptoWalletType) => {
            return (
              <div
                key={walletType.id}
                className="grid grid-cols-1 h-7 items-center hover:bg-white cursor-pointer even:bg-slate-300 last:rounded-b-md"
                onClick={() => setCryptoWalletType(walletType)}
              >
                {walletType.name}
              </div>
            );
          })
        ) : null
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
  cryptoWalletType: CryptoWalletType;
  setCryptoWalletType: React.Dispatch<React.SetStateAction<CryptoWalletType>>;
  cryptoWalletTypesMutate: KeyedMutator<any>;
}) {
  const [cryptoWalletTypeName, setCryptoWalletTypeName] = useState(cryptoWalletType.name);
  const EditCryptoWalletType = async () => {
    const data = await fetch("/admin/cryptowallets/edit-crypto-wallet-type", {
      method: "POST",
      body: JSON.stringify({ id: cryptoWalletType.id, cryptoWalletTypeName }),
    });
    const response = await data.json();
    cryptoWalletTypesMutate();
    setCryptoWalletType(null);
    toast.success(response.message);
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
            <button type="button" className="bg-yellow-500 text-white rounded-full px-2 ml-5" onClick={() => EditCryptoWalletType()}>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CryptoWalletForm({
  cryptoWalletTypes,
  cryptoWalletsMutate,
}: {
  cryptoWalletTypes: CryptoWalletType[];
  cryptoWalletsMutate: KeyedMutator<any>;
}) {
  const [cryptoWalletAddress, setCryptoWalletAddress] = useState("");
  const [cryptoWalletTypeId, setCryptoWalletTypeId] = useState<number>();
  const [cryptoWalletTypeName, setCryptoWalletTypeName] = useState<string>();

  const SetCryptoWalletType = (name: string) => {
    setCryptoWalletTypeName(name);
    for (let i = 0; i < cryptoWalletTypes.length; i++) {
      if (cryptoWalletTypes[i].name === name) {
        setCryptoWalletTypeId(cryptoWalletTypes[i].id);
        return;
      }
    }
  };

  const AddCryptoWallet = async () => {
    if (cryptoWalletAddress === "") {
      toast.error("Wallet address empty. Try again.");
    } else {
      const data = await fetch("/admin/cryptowallets/add-crypto-wallet", {
        method: "POST",
        body: JSON.stringify({ cryptoWalletAddress, cryptoWalletTypeId }),
      });
      const response = await data.json();
      cryptoWalletsMutate();
      setCryptoWalletAddress("");
      setCryptoWalletTypeId(cryptoWalletTypes[0].id);
      setCryptoWalletTypeName(cryptoWalletTypes[0].name);
      toast.success(response.message);
    }
  };
  useEffect(() => {
    if (cryptoWalletTypes) setCryptoWalletTypeId(cryptoWalletTypes[0].id);
    setCryptoWalletTypeName(cryptoWalletTypes[0].name);
  }, [cryptoWalletTypes]);

  return (
    <form className="flex flex-row items-end justify-between">
      <div className="flex flex-col">
        <div className="flex flex-col mb-2">
          <label className="pl-1">Crypto Wallet Address</label>
          <input
            type="text"
            className="pl-1 border-[1px] rounded-lg overflow-x-scroll"
            value={cryptoWalletAddress}
            placeholder="1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71"
            onChange={(event) => setCryptoWalletAddress(event.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>Crypto Wallet Type</label>
          <select
            className="pl-1 border-[1px] rounded-lg"
            value={cryptoWalletTypeName}
            onChange={(event) => SetCryptoWalletType(event.target.value)}
          >
            {cryptoWalletTypes?.map((cryptoWalletType) => {
              return (
                <option key={cryptoWalletType.id} id={cryptoWalletType.id.toString()} value={cryptoWalletType.name}>
                  {cryptoWalletType.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <button type="button" className="bg-green-500 text-white rounded-full px-2" onClick={() => AddCryptoWallet()}>
        Add
      </button>
    </form>
  );
}

export function CryptoWalletList({
  cryptoWallets,
  cryptoWalletsMutate,
  cryptoWalletTypes,
}: {
  cryptoWallets: (CryptoWallet & {
    type: CryptoWalletType;
  })[];
  cryptoWalletsMutate: KeyedMutator<any>;
  cryptoWalletTypes: CryptoWalletType[];
}) {
  const [cryptoWallet, setCryptoWallet] = useState<
    CryptoWallet & {
      type: CryptoWalletType;
    }
  >();

  return (
    <div className="flex flex-row">
      <div className="grid text-center border-2 border-black rounded-lg w-full">
        <div className="grid grid-cols-2 p-1 border-b-2 border-black bg-black text-white text-lg font-semibold">
          <div>Address</div>
          <div className="grid grid-cols-2">
            <div>Type</div>
            <div>Active</div>
          </div>
        </div>
        {cryptoWallets?.map((wallet) => {
          return (
            <div
              key={wallet.id}
              className="grid grid-cols-4 cursor-pointer hover:bg-white even:bg-slate-300 h-7 w-full"
              onClick={() => setCryptoWallet(wallet)}
            >
              <div className="col-span-2 pl-1 overflow-x-scroll">{wallet.address}</div>
              <div>{wallet.type.name}</div>
              <div className={`${wallet.active ? "bg-green-500" : "bg-red-500"} overflow-hidden `}>{wallet.active ? "Yes" : "No"}</div>
            </div>
          );
        })}
      </div>
      {cryptoWallet ? (
        <div>
          <CryptoWalletInfo
            cryptoWallet={cryptoWallet}
            setCryptoWallet={setCryptoWallet}
            cryptoWalletsMutate={cryptoWalletsMutate}
            cryptoWalletTypes={cryptoWalletTypes}
          />
        </div>
      ) : null}
    </div>
  );
}
function CryptoWalletInfo({
  cryptoWallet,
  setCryptoWallet,
  cryptoWalletsMutate,
  cryptoWalletTypes,
}: {
  cryptoWallet: CryptoWallet & {
    type: CryptoWalletType;
  };
  setCryptoWallet: React.Dispatch<
    React.SetStateAction<
      CryptoWallet & {
        type: CryptoWalletType;
      }
    >
  >;
  cryptoWalletsMutate: KeyedMutator<any>;
  cryptoWalletTypes: CryptoWalletType[];
}) {
  const [formWallet, setFormWallet] = useState<
    CryptoWallet & {
      type: CryptoWalletType;
    }
  >(cryptoWallet);

  const [show, setShow] = useState(false);
  const SetWalletType = (name: string) => {
    for (let i = 0; i < cryptoWalletTypes.length; i++) {
      if (cryptoWalletTypes[i].name === name) {
        setFormWallet({ ...formWallet, typeId: cryptoWalletTypes[i].id, type: { id: Number(cryptoWalletTypes[i].id), name } });
        return;
      }
    }
  };

  const EditWalletAddress = async () => {
    const data = await fetch("/admin/cryptowallets/edit-crypto-wallet", {
      method: "POST",
      body: JSON.stringify({ formWallet }),
    });
    const response = await data.json();
    cryptoWalletsMutate();
    setCryptoWallet(null);
    toast.success(response.message);
  };

  useEffect(() => {
    setFormWallet(cryptoWallet);
  }, [cryptoWallet]);
  return (
    <div
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 bg-black w-full md:inset-0 h-full z-50 overflow-y-scroll "
      onClick={() => setCryptoWallet(null)}
    >
      <div className="relative w-2/3 rounded-lg p-2 md:h-auto m-auto bg-white" onClick={(e) => e.stopPropagation()}>
        {show ? (
          <DeleteConfirmationModal
            cryptoWalletId={formWallet.id}
            setCryptoWallet={setCryptoWallet}
            setShow={setShow}
            cryptoWalletMutate={cryptoWalletsMutate}
          />
        ) : null}
        <div className="">
          <div className="flex flex-col pb-1 ">
            <label className="text-lg mr-5 font-bold">Address</label>
            <input
              className="pl-1 overflow-x-scroll border-[1px] rounded-lg"
              value={formWallet.address}
              onChange={(event) => setFormWallet({ ...formWallet, address: event.target.value })}
            />
          </div>
          <div className="flex flex-col pb-2 ">
            <label className="text-lg font-bold">Type</label>
            <select value={formWallet.type.name} className="pl-1 border-[1px]" onChange={(event) => SetWalletType(event.target.value)}>
              {cryptoWalletTypes?.map((type) => {
                return (
                  <option key={type.id} id={type.id.toString()} value={type.name}>
                    {type.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-row pb-2">
            <label className="text-lg font-bold mr-5">Active:</label>
            <button
              className={`${formWallet.active ? "bg-green-500" : "bg-red-500"} text-white rounded-full px-2`}
              onClick={() => setFormWallet({ ...formWallet, active: !formWallet.active })}
            >
              {formWallet.active ? "Enabled" : "Disabled"}
            </button>
          </div>
          <div className="flex w-full">
            <button className="mx-auto w-1/4 bg-blue-700 text-white rounded-full px-2 py-1" onClick={() => EditWalletAddress()}>
              Save
            </button>{" "}
            <button className="mx-auto w-1/4 bg-red-700 text-white rounded-full px-2 py-1" onClick={() => setShow(true)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function DeleteConfirmationModal({
    setShow,
    cryptoWalletId,
    setCryptoWallet,
    cryptoWalletMutate,
  }: {
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    cryptoWalletId: number;
    setCryptoWallet: React.Dispatch<
      React.SetStateAction<
        CryptoWallet & {
          type: CryptoWalletType;
        }
      >
    >;
    cryptoWalletMutate: KeyedMutator<any>;
  }) {
    const DeleteCryptoWallet = async (event) => {
      event.preventDefault();
      toast.loading("Loading...");

      const data = await fetch(`/admin/cryptowallets/delete--crypto-wallet/${cryptoWalletId}`, {
        method: "DELETE",
      });
      const response = await data.json();
      toast.dismiss();
      cryptoWalletMutate();
      setCryptoWallet(null);
      setShow(false);
      toast.success(response.message);
    };

    function closeOnEscKeyDown(event) {
      if ((event.charCode || event.keyCode) === 27) {
        setShow(false);
      }
    }
    useEffect(() => {
      document.body.addEventListener("keydown", closeOnEscKeyDown);
      return function cleanup() {
        document.body.removeEventListener("keydown", closeOnEscKeyDown);
      };
    });

    return (
      <div
        className="flex fixed bg-opacity-50 top-0 left-0 right-0 p-4 overflow-x-hidden overflow-y-auto bg-black w-full md:h-full md:inset-0 h-[calc(100%-1rem)] z-50 "
        onClick={() => setShow(false)}
      >
        <div className="relative w-1/3 h-full max-w-2xl md:h-auto m-auto " onClick={(e) => e.stopPropagation()}>
          <div className=" flex flex-col items-center relative bg-white rounded-lg shadow dark:bg-gray-700 ">
            <h1 className="text-lg p-2">
              Are you sure you wanted to delete this crypto wallet? This action is irreversible and cannot be canceled.
            </h1>
            <div className="flex flex-row gap-8 p-2">
              <button
                className=" p-2 rounded-full border-2 text-lg border-black bg-gray-400 text-white hover:shadow-lg hover:-translate-y-2 "
                onClick={() => setShow(false)}
              >
                Cancel
              </button>
              <button
                className=" p-2 rounded-full border-2 text-lg border-black bg-red-600 text-white hover:shadow-lg hover:-translate-y-2"
                onClick={(event) => DeleteCryptoWallet(event)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
