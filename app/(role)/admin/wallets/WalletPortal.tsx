import { WalletAddress, WalletType } from "@prisma/client";
import Loader from "app/Loader";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { KeyedMutator } from "swr";

export function WalletTypeForm({ walletTypesMutate }: { walletTypesMutate: KeyedMutator<any> }) {
  const [walletType, setWalletType] = useState("");

  const addWalletType = async () => {
    if (walletType === "") {
      toast.error("Cannot add empty wallet type.");
    } else {
      toast.loading("Loading...");
      const data = await fetch("/admin/wallets/add-wallet-type", {
        method: "POST",
        body: JSON.stringify({ walletType }),
      });
      const response = await data.json();
      walletTypesMutate();
      setWalletType("");
      toast.dismiss();
      toast.success(response.message);
    }
  };

  return (
    <form className="flex flex-row">
      <div>
        <label>Wallet Type</label>
        <input type="text" value={walletType} placeholder="BTC" onChange={(event) => setWalletType(event.target.value)} />
      </div>
      <div>
        <button type="button" className="bg-green-500 text-white rounded-full px-2" onClick={() => addWalletType()}>
          Add
        </button>
      </div>
    </form>
  );
}

export function WalletTypeList({
  walletTypesData,
  isLoading,
  walletTypesMutate,
}: {
  walletTypesData: any;
  isLoading: boolean;
  walletTypesMutate: KeyedMutator<any>;
}) {
  const [walletType, setWalletType] = useState<WalletType>();
  return (
    <div className="flex flex-row">
      <div className="grid text-center  border-2 border-black mr-10 ">
        <div className="grid grid-cols-1 border-b-2 border-black">
          <div>Wallet Type Name</div>
        </div>
        {!isLoading ? (
          walletTypesData ? (
            walletTypesData.walletTypes.map((type) => {
              return (
                <div key={type.id} className="grid grid-cols-1 hover:bg-white cursor-pointer" onClick={() => setWalletType(type)}>
                  {type.name}
                </div>
              );
            })
          ) : null
        ) : (
          <div>
            <Loader />
          </div>
        )}
      </div>
      {walletType ? (
        <div>
          <WalletTypeInfo walletType={walletType} setWalletType={setWalletType} walletTypesMutate={walletTypesMutate} />
        </div>
      ) : null}
    </div>
  );
}

function WalletTypeInfo({
  walletType,
  setWalletType,
  walletTypesMutate,
}: {
  walletType: WalletType;
  setWalletType: React.Dispatch<React.SetStateAction<WalletType>>;
  walletTypesMutate: KeyedMutator<any>;
}) {
  const [walletTypeName, setWalletTypeName] = useState(walletType.name);
  const editWalletType = async () => {
    const data = await fetch("/admin/wallets/edit-wallet-type", {
      method: "POST",
      body: JSON.stringify({ id: walletType.id, walletTypeName }),
    });
    const response = await data.json();
    walletTypesMutate();
    setWalletType(null);
    toast.success(response.message);
  };

  useEffect(() => {
    setWalletTypeName(walletType.name);
  }, [walletType]);

  return (
    <div className="flex flex-col">
      <label>Wallet Type Name</label>
      <div className="flex flex-row">
        <input type="text" value={walletTypeName} onChange={(event) => setWalletTypeName(event.target.value)} />
        <button type="button" className="bg-yellow-500  text-white rounded-full px-2 ml-5" onClick={() => editWalletType()}>
          Edit
        </button>
      </div>
    </div>
  );
}

export function WalletAddressForm({
  walletTypes,
  walletAddressesMutate,
}: {
  walletTypes: WalletType[];
  walletAddressesMutate: KeyedMutator<any>;
}) {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletTypeId, setWalletTypeId] = useState<number>();
  const [walletTypeName, setWalletTypeName] = useState<string>();

  const setWalletType = (name: string) => {
    let id;
    setWalletTypeName(name);
    for (let i = 0; i < walletTypes.length; i++) {
      if (walletTypes[i].name === name) {
        id = walletTypes[i].id;
      }
    }
    setWalletTypeId(id);
  };

  const addWalletAddress = async () => {
    if (walletAddress === "") {
      toast.error("Wallet address empty. Try again.");
    } else {
      const data = await fetch("/admin/wallets/add-wallet-address", {
        method: "POST",
        body: JSON.stringify({ walletAddress, walletTypeId }),
      });
      const response = await data.json();
      walletAddressesMutate();
      setWalletAddress("");
      setWalletTypeId(walletTypes[0].id);
      setWalletTypeName(walletTypes[0].name);
      toast.success(response.message);
    }
  };
  useEffect(() => {
    if (walletTypes) setWalletTypeId(walletTypes[0].id);
    setWalletTypeName(walletTypes[0].name);
  }, [walletTypes]);

  return (
    <form className="flex flex-row items-center">
      <div className="flex flex-col mr-5">
        <label>Wallet Address</label>
        <input
          type="text"
          value={walletAddress}
          placeholder="1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71"
          onChange={(event) => setWalletAddress(event.target.value)}
        />
      </div>
      <div className="flex flex-col mr-5">
        <label>Wallet Type</label>
        <select value={walletTypeName} onChange={(event) => setWalletType(event.target.value)}>
          {walletTypes.map((walletType) => {
            return (
              <option key={walletType.id} id={walletType.id.toString()} value={walletType.name}>
                {walletType.name}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <button type="button" className="bg-green-500 text-white rounded-full px-2" onClick={() => addWalletAddress()}>
          Add
        </button>
      </div>
    </form>
  );
}

export function WalletAddressList({
  walletAddresses,
  walletAddressesMutate,
  walletTypes,
}: {
  walletAddresses: (WalletAddress & {
    type: WalletType;
  })[];
  walletAddressesMutate: KeyedMutator<any>;
  walletTypes: WalletType[];
}) {
  const [walletAddress, setWalletAddress] = useState<
    WalletAddress & {
      type: WalletType;
    }
  >();

  return (
    <div className="flex flex-row">
      <div className="grid text-center border-2 border-black">
        <div className="grid grid-cols-2 grid- border-b-2 border-black">
          <div>Address</div>
          <div className="grid grid-cols-2">
            <div>Type</div>
            <div>Active</div>
          </div>
        </div>
        {walletAddresses.map((wallet) => {
          return (
            <div key={wallet.id} className="grid grid-cols-2 cursor-pointer hover:bg-white" onClick={() => setWalletAddress(wallet)}>
              <div>{wallet.address}</div>
              <div className="grid grid-cols-2">
                <div>{wallet.type.name}</div>
                <div className={`${wallet.active ? "bg-green-500" : "bg-red-500"} `}>{wallet.active ? "Yes" : "No"}</div>
              </div>
            </div>
          );
        })}
      </div>
      {walletAddress ? (
        <div>
          <WalletAddressInfo
            walletAddress={walletAddress}
            setWalletAddress={setWalletAddress}
            walletAddressesMutate={walletAddressesMutate}
            walletTypes={walletTypes}
          />
        </div>
      ) : null}
    </div>
  );
}
function WalletAddressInfo({
  walletAddress,
  setWalletAddress,
  walletAddressesMutate,
  walletTypes,
}: {
  walletAddress: WalletAddress & {
    type: WalletType;
  };
  setWalletAddress: React.Dispatch<
    React.SetStateAction<
      WalletAddress & {
        type: WalletType;
      }
    >
  >;
  walletAddressesMutate: KeyedMutator<any>;
  walletTypes: WalletType[];
}) {
  const [formWallet, setFormWallet] = useState<
    WalletAddress & {
      type: WalletType;
    }
  >(walletAddress);

  const [show, setShow] = useState(false);
  const setWalletType = (name: string) => {
    let id;
    for (let i = 0; i < walletTypes.length; i++) {
      if (walletTypes[i].name === name) {
        id = walletTypes[i].id;
      }
    }
    setFormWallet({ ...formWallet, typeId: id, type: { id: Number(id), name } });
  };

  const editWalletAddress = async () => {
    const data = await fetch("/admin/wallets/edit-wallet-address", {
      method: "POST",
      body: JSON.stringify({ formWallet }),
    });
    const response = await data.json();
    walletAddressesMutate();
    setWalletAddress(null);
    toast.success(response.message);
  };

  useEffect(() => {
    setFormWallet(walletAddress);
  }, [walletAddress]);
  return (
    <>
      {show ? (
        <DeleteConfirmationModal
          walletId={formWallet.id}
          setWalletAddress={setWalletAddress}
          setShow={setShow}
          walletAddressesMutate={walletAddressesMutate}
        />
      ) : null}
      <div className="ml-5">
        <div className="flex flex-col pb-1 ">
          <label className="text-lg mr-5">Address</label>
          <input
            className="w-[400px]"
            value={formWallet.address}
            onChange={(event) => setFormWallet({ ...formWallet, address: event.target.value })}
          />
        </div>
        <div className="flex flex-col pb-2 ">
          <label className="text-lg">Type</label>
          <select value={formWallet.type.name} onChange={(event) => setWalletType(event.target.value)}>
            {walletTypes.map((type) => {
              return (
                <option key={type.id} id={type.id.toString()} value={type.name}>
                  {type.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-row pb-2">
          <label className="text-lg mr-5">Active:</label>
          <button
            className={`${formWallet.active ? "bg-green-500" : "bg-red-500"} text-white rounded-full px-2`}
            onClick={() => setFormWallet({ ...formWallet, active: !formWallet.active })}
          >
            {formWallet.active ? "Enabled" : "Disabled"}
          </button>
        </div>
        <div className="flex w-full">
          <button className="mx-auto w-1/4 bg-blue-700 text-white rounded-full px-2 py-1" onClick={() => editWalletAddress()}>
            Save
          </button>{" "}
          <button className="mx-auto w-1/4 bg-red-700 text-white rounded-full px-2 py-1" onClick={() => setShow(true)}>
            Delete
          </button>
        </div>
      </div>
    </>
  );

  function DeleteConfirmationModal({
    setShow,
    walletId,
    setWalletAddress,
    walletAddressesMutate,
  }: {
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    walletId: number;
    setWalletAddress: React.Dispatch<
      React.SetStateAction<
        WalletAddress & {
          type: WalletType;
        }
      >
    >;

    walletAddressesMutate: KeyedMutator<any>;
  }) {
    const deleteWalletAddress = async (event) => {
      event.preventDefault();
      toast.loading("Loading...");

      const data = await fetch(`/admin/wallets/delete-wallet-address/${walletId}`, {
        method: "DELETE",
      });
      const response = await data.json();
      toast.dismiss();
      walletAddressesMutate();
      setWalletAddress(null);
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
              Are you sure you wanted to delete this wallet address? This action is irreversible and cannot be canceled.
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
                onClick={(event) => deleteWalletAddress(event)}
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
