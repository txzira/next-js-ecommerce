import { CryptoWallet, CryptoWalletType } from "@prisma/client";
import Loader from "app/Loader";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { KeyedMutator } from "swr";

export default function CryptoWallet({
  cryptoWalletsData,
  cryptoWalletsIsLoading,
  cryptoWalletsMutate,
  cryptoWalletTypesData,
  cryptoWalletTypesIsLoading,
}: {
  cryptoWalletsData: (CryptoWallet & {
    type: CryptoWalletType;
  })[];
  cryptoWalletsIsLoading: boolean;
  cryptoWalletsMutate: KeyedMutator<
    (CryptoWallet & {
      type: CryptoWalletType;
    })[]
  >;
  cryptoWalletTypesData: CryptoWalletType[];
  cryptoWalletTypesIsLoading: boolean;
}) {
  return (
    <div className="rounded-xl border-2 border-black bg-white px-2 py-3 shadow-xl">
      <h2 className="pb-1 text-2xl font-semibold">Create Crypto Wallet</h2>
      <CryptoWalletForm
        cryptoWalletTypesData={cryptoWalletTypesData}
        cryptoWalletTypesIsLoading={cryptoWalletTypesIsLoading}
        cryptoWalletsMutate={cryptoWalletsMutate}
      />
      <div className="my-5 border-b-[1px] border-gray-400"></div>
      <CryptoWalletList
        cryptoWalletTypesData={cryptoWalletTypesData}
        cryptoWalletTypesIsLoading={cryptoWalletTypesIsLoading}
        cryptoWalletsData={cryptoWalletsData}
        cryptoWalletsIsLoading={cryptoWalletsIsLoading}
        cryptoWalletsMutate={cryptoWalletsMutate}
      />
    </div>
  );
}

function CryptoWalletForm({
  cryptoWalletTypesData,
  cryptoWalletTypesIsLoading,
  cryptoWalletsMutate,
}: {
  cryptoWalletTypesData: CryptoWalletType[];
  cryptoWalletTypesIsLoading: boolean;
  cryptoWalletsMutate: KeyedMutator<
    (CryptoWallet & {
      type: CryptoWalletType;
    })[]
  >;
}) {
  const [cryptoWalletAddress, setCryptoWalletAddress] = useState("");
  const [cryptoWalletTypeId, setCryptoWalletTypeId] = useState<number>();
  const [cryptoWalletTypeName, setCryptoWalletTypeName] = useState<string>();

  const handleCryptoWalletType = (name: string) => {
    setCryptoWalletTypeName(name);
    for (let i = 0; i < cryptoWalletTypesData.length; i++) {
      if (cryptoWalletTypesData[i].name === name) {
        setCryptoWalletTypeId(cryptoWalletTypesData[i].id);
        return;
      }
    }
  };

  const addCryptoWallet = async () => {
    if (cryptoWalletAddress === "") {
      toast.error("Wallet address empty. Try again.");
    } else {
      const response = await fetch("/admin/cryptowallets/add-crypto-wallet", {
        method: "POST",
        body: JSON.stringify({ cryptoWalletAddress, cryptoWalletTypeId }),
      });
      const message = await response.json();
      cryptoWalletsMutate();
      setCryptoWalletAddress("");
      setCryptoWalletTypeId(cryptoWalletTypesData[0].id);
      setCryptoWalletTypeName(cryptoWalletTypesData[0].name);
      response.status === 201 ? toast.success(message) : toast.error(message);
    }
  };
  useEffect(() => {
    if (cryptoWalletTypesData) {
      setCryptoWalletTypeId(cryptoWalletTypesData[0].id);
      setCryptoWalletTypeName(cryptoWalletTypesData[0].name);
    }
  }, [cryptoWalletTypesData]);

  return !cryptoWalletTypesIsLoading ? (
    cryptoWalletTypesData.length > 0 ? (
      <form className="flex flex-row items-end justify-between">
        <div className="flex flex-col">
          <div className="mb-2 flex flex-col">
            <label className="pl-1">Crypto Wallet Address</label>
            <input
              type="text"
              className="overflow-x-scroll rounded-lg border-[1px] pl-1"
              value={cryptoWalletAddress}
              placeholder="1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71"
              onChange={(event) => setCryptoWalletAddress(event.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label>Crypto Wallet Type</label>
            <select
              className="rounded-lg border-[1px] pl-1"
              value={cryptoWalletTypeName}
              onChange={(event) => handleCryptoWalletType(event.target.value)}
            >
              {cryptoWalletTypesData?.map((cryptoWalletType) => {
                return (
                  <option
                    key={cryptoWalletType.id}
                    id={cryptoWalletType.id.toString()}
                    value={cryptoWalletType.name}
                  >
                    {cryptoWalletType.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <button
          type="button"
          className="rounded-full bg-green-500 px-2 text-white"
          onClick={addCryptoWallet}
        >
          Add
        </button>
      </form>
    ) : (
      <div>No Crypto Wallets</div>
    )
  ) : (
    <div className="flex justify-center">
      <Loader />
    </div>
  );
}

function CryptoWalletList({
  cryptoWalletsData,
  cryptoWalletsIsLoading,
  cryptoWalletsMutate,
  cryptoWalletTypesData,
  cryptoWalletTypesIsLoading,
}: {
  cryptoWalletsData: (CryptoWallet & {
    type: CryptoWalletType;
  })[];
  cryptoWalletsIsLoading: boolean;
  cryptoWalletsMutate: KeyedMutator<
    (CryptoWallet & {
      type: CryptoWalletType;
    })[]
  >;
  cryptoWalletTypesData: CryptoWalletType[];
  cryptoWalletTypesIsLoading: boolean;
}) {
  const [cryptoWallet, setCryptoWallet] = useState<
    CryptoWallet & {
      type: CryptoWalletType;
    }
  >();

  return (
    <div className="flex flex-row">
      <div className="grid w-full rounded-lg border-2 border-black text-center">
        <div className="grid grid-cols-2 border-b-2 border-black bg-black p-1 text-lg font-semibold text-white">
          <div>Address</div>
          <div className="grid grid-cols-2">
            <div>Type</div>
            <div>Active</div>
          </div>
        </div>
        {!cryptoWalletsIsLoading ? (
          cryptoWalletsData.length > 0 ? (
            cryptoWalletsData.map((cryptoWallet) => {
              return (
                <div
                  key={cryptoWallet.id}
                  className="grid h-7 w-full cursor-pointer grid-cols-4 even:bg-slate-300 hover:bg-white"
                  onClick={() => setCryptoWallet(cryptoWallet)}
                >
                  <div className="col-span-2 overflow-x-scroll pl-1">
                    {cryptoWallet.address}
                  </div>
                  <div>{cryptoWallet.type.name}</div>
                  <div
                    className={`${
                      cryptoWallet.active ? "bg-green-500" : "bg-red-500"
                    } overflow-hidden `}
                  >
                    {cryptoWallet.active ? "Yes" : "No"}
                  </div>
                </div>
              );
            })
          ) : (
            <div>No Crypto Wallets</div>
          )
        ) : (
          <div className="flex justify-center">
            <Loader />
          </div>
        )}
      </div>
      {cryptoWallet ? (
        <CryptoWalletInfo
          cryptoWallet={cryptoWallet}
          setCryptoWallet={setCryptoWallet}
          cryptoWalletsMutate={cryptoWalletsMutate}
          cryptoWalletTypesData={cryptoWalletTypesData}
          cryptoWalletTypesIsLoading={cryptoWalletTypesIsLoading}
        />
      ) : null}
    </div>
  );
}
function CryptoWalletInfo({
  cryptoWallet,
  setCryptoWallet,
  cryptoWalletsMutate,
  cryptoWalletTypesData,
  cryptoWalletTypesIsLoading,
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
  cryptoWalletsMutate: KeyedMutator<
    (CryptoWallet & {
      type: CryptoWalletType;
    })[]
  >;
  cryptoWalletTypesData: CryptoWalletType[];
  cryptoWalletTypesIsLoading: boolean;
}) {
  const [formWallet, setFormWallet] = useState<
    CryptoWallet & {
      type: CryptoWalletType;
    }
  >(cryptoWallet);

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const handleCryptoWalletType = (name: string) => {
    for (let i = 0; i < cryptoWalletTypesData.length; i++) {
      if (cryptoWalletTypesData[i].name === name) {
        setFormWallet({
          ...formWallet,
          typeId: cryptoWalletTypesData[i].id,
          type: { id: Number(cryptoWalletTypesData[i].id), name },
        });
        return;
      }
    }
    return;
  };

  const editWalletAddress = async () => {
    const response = await fetch("/admin/cryptowallets/edit-crypto-wallet", {
      method: "POST",
      body: JSON.stringify({ formWallet }),
    });
    const message = await response.json();
    cryptoWalletsMutate();
    setCryptoWallet(null);
    response.status === 200 ? toast.success(message) : toast.error(message);
  };

  useEffect(() => {
    setFormWallet(cryptoWallet);
  }, [cryptoWallet]);
  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 flex h-full w-full overflow-y-scroll bg-black bg-opacity-50 md:inset-0 "
      onClick={() => setCryptoWallet(null)}
    >
      <div
        className="relative m-auto w-2/3 rounded-lg bg-white p-2 md:h-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {showDeleteConfirmationModal ? (
          <DeleteConfirmationModal
            cryptoWalletId={formWallet.id}
            setCryptoWallet={setCryptoWallet}
            setShowDeleteConfirmationModal={setShowDeleteConfirmationModal}
            cryptoWalletMutate={cryptoWalletsMutate}
          />
        ) : null}
        <div className="">
          <div className="flex flex-col pb-1 ">
            <label className="mr-5 text-lg font-bold">Address</label>
            <input
              className="overflow-x-scroll rounded-lg border-[1px] pl-1"
              value={formWallet.address}
              onChange={(event) =>
                setFormWallet({ ...formWallet, address: event.target.value })
              }
            />
          </div>
          <div className="flex flex-col pb-2 ">
            <label className="text-lg font-bold">Type</label>
            <select
              value={formWallet.type.name}
              className="border-[1px] pl-1"
              onChange={(event) => handleCryptoWalletType(event.target.value)}
            >
              {!cryptoWalletTypesIsLoading
                ? cryptoWalletTypesData.map((type) => {
                    return (
                      <option
                        key={type.id}
                        id={type.id.toString()}
                        value={type.name}
                      >
                        {type.name}
                      </option>
                    );
                  })
                : null}
            </select>
          </div>
          <div className="flex flex-row pb-2">
            <label className="mr-5 text-lg font-bold">Active:</label>
            <button
              className={`${
                formWallet.active ? "bg-green-500" : "bg-red-500"
              } rounded-full px-2 text-white`}
              onClick={() =>
                setFormWallet({ ...formWallet, active: !formWallet.active })
              }
            >
              {formWallet.active ? "Enabled" : "Disabled"}
            </button>
          </div>
          <div className="flex w-full">
            <button
              className="mx-auto w-1/4 rounded-full bg-blue-700 px-2 py-1 text-white"
              onClick={editWalletAddress}
            >
              Save
            </button>{" "}
            <button
              className="mx-auto w-1/4 rounded-full bg-red-700 px-2 py-1 text-white"
              onClick={() => setShowDeleteConfirmationModal(true)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function DeleteConfirmationModal({
    setShowDeleteConfirmationModal,
    cryptoWalletId,
    setCryptoWallet,
    cryptoWalletMutate,
  }: {
    setShowDeleteConfirmationModal: React.Dispatch<
      React.SetStateAction<boolean>
    >;
    cryptoWalletId: number;
    setCryptoWallet: React.Dispatch<
      React.SetStateAction<
        CryptoWallet & {
          type: CryptoWalletType;
        }
      >
    >;
    cryptoWalletMutate: KeyedMutator<
      (CryptoWallet & {
        type: CryptoWalletType;
      })[]
    >;
  }) {
    const deleteCryptoWallet = async (event) => {
      event.preventDefault();
      toast.loading("Loading...");

      const response = await fetch(
        `/admin/cryptowallets/delete--crypto-wallet/${cryptoWalletId}`,
        {
          method: "DELETE",
        }
      );
      const message = await response.json();
      toast.dismiss();
      cryptoWalletMutate();
      setCryptoWallet(null);
      setShowDeleteConfirmationModal(false);

      response.status === 200 ? toast.success(message) : toast.error(message);
    };

    function closeOnEscKeyDown(event) {
      if ((event.charCode || event.keyCode) === 27) {
        setShowDeleteConfirmationModal(false);
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
        className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] w-full overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 p-4 md:inset-0 md:h-full "
        onClick={() => setShowDeleteConfirmationModal(false)}
      >
        <div
          className="relative m-auto h-full w-1/3 max-w-2xl md:h-auto "
          onClick={(e) => e.stopPropagation()}
        >
          <div className=" relative flex flex-col items-center rounded-lg bg-white shadow dark:bg-gray-700 ">
            <h1 className="p-2 text-lg">
              Are you sure you wanted to delete this crypto wallet? This action
              is irreversible and cannot be canceled.
            </h1>
            <div className="flex flex-row gap-8 p-2">
              <button
                className=" rounded-full border-2 border-black bg-gray-400 p-2 text-lg text-white hover:-translate-y-2 hover:shadow-lg "
                onClick={() => setShowDeleteConfirmationModal(false)}
              >
                Cancel
              </button>
              <button
                className=" rounded-full border-2 border-black bg-red-600 p-2 text-lg text-white hover:-translate-y-2 hover:shadow-lg"
                onClick={deleteCryptoWallet}
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
