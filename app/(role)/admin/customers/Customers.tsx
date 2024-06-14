import { User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "app/Loader";
import { KeyedMutator } from "swr";
import { BsFillTrashFill } from "react-icons/bs";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

export function CustomerTable({
  setCustomer,
  setCursor,
  setLimit,
  customersData,
  customersIsLoading,
  limit,
}: {
  setCustomer: React.Dispatch<React.SetStateAction<User>>;
  setCursor: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  customersData: { customers: User[]; customerCount: number };
  customersIsLoading: boolean;
  limit: number;
}) {
  const [pages, setPages] = useState<number>();
  const [page, setPage] = useState<number>(1);

  const changeLimit = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setLimit(Number(event.target.value));
    setPage(1);
    setCursor(0);
  };

  const prevPage = () => {
    if (page > 1) {
      setCursor(customersData.customers[0].id);
      if (limit > 0) {
        setLimit(limit * -1);
      }

      setPage(page - 1);
      setCustomer(null);
    } else {
      toast.error("Request page out of bounds");
    }
  };
  const nextPage = () => {
    if (page < pages) {
      setCursor(customersData.customers[customersData.customers.length - 1].id);
      if (limit < 0) {
        setLimit(limit * -1);
      }
      setPage(page + 1);
      setCustomer(null);
    } else {
      toast.error("Request page out of bounds");
    }
  };

  useEffect(() => {
    if (customersData.customerCount) {
      setPages(Math.ceil(Number(customersData.customerCount) / Math.abs(limit)));
    }
  }, [customersData, limit]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-4xl font-bold pb-5">Customer List</h1>
        <select onChange={(event) => changeLimit(event)}>
          <option value="10" selected={true}>
            10
          </option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div className="flex flex-col justify-between border-2 border-black  h-[500px] rounded-lg bg-white ">
        <div>
          <div className="grid grid-cols-5 bg-black text-white font-bold h-12">
            <div className="py-3 col-span-2 pl-1">Email</div>
            <div className="py-3 col-span-2 pl-2">Name</div>
            <div className="py-3">Verified</div>
          </div>
          <div className="h-[400px] overflow-y-scroll">
            {!customersIsLoading ? (
              customersData.customers.length > 0 ? (
                customersData.customers.map((customer: User) => {
                  return (
                    <div
                      key={customer.id}
                      className="grid grid-cols-5 hover:bg-white cursor-pointer h-10 "
                      onClick={() => setCustomer(customer)}
                    >
                      <div className="py-2 col-span-2 overflow-x-scroll pl-1">{customer.email}</div>
                      <div className="py-2 col-span-2 overflow-x-scroll pl-2">
                        {customer.firstName} {customer.lastName}
                      </div>
                      <div className="py-2">{customer.verifiedByAdmin ? "yes" : "no"}</div>
                    </div>
                  );
                })
              ) : (
                <div>No Customers.</div>
              )
            ) : (
              <div className="flex justify-center py-5">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 border-t-[1px] items-center border-black h-10">
          <div className="py-2">{page > 1 ? <button onClick={() => prevPage()}>&lt;-</button> : null}</div>
          {pages ? (
            <div>
              Page {page} of {pages}
            </div>
          ) : (
            <div>Page - of -</div>
          )}
          <div className="py-2">{page < pages ? <button onClick={() => nextPage()}>-&gt;</button> : null}</div>
        </div>
      </div>
    </div>
  );
}

export function CustomerDetails({
  customer,
  setCustomer,
  customersMutate,
}: {
  customer: User;
  setCustomer: React.Dispatch<React.SetStateAction<User>>;
  customersMutate: KeyedMutator<{
    customers: User[];
    customerCount: number;
  }>;
}) {
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

  function CustomerField({ title, value }) {
    return (
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p>{value}</p>
      </div>
    );
  }
  const verifyCustomer = async (id, status) => {
    const response = await fetch("/admin/customers/verify-customer", {
      method: "POST",
      body: JSON.stringify({ id, verify: status }),
    });
    const message = await response.json();
    customersMutate();
    setCustomer(null);
    response.status === 200 ? toast.success(message) : toast.error(message);
  };

  return (
    <div
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 bg-black w-full h-full md:inset-0 z-50 overflow-y-scroll"
      onClick={() => setCustomer(null)}
    >
      <div className="relative p-2 w-4/5 m-auto bg-white rounded-xl" onClick={(e) => e.stopPropagation()}>
        {customer ? (
          <div>
            <h1 className="pb-1 text-2xl font-bold">Customer Information</h1>

            <div className="flex flex-row justify-between">
              <CustomerField title="Id" value={customer.id} />
              <CustomerField title="Verification Status" value={customer.verifiedByAdmin ? "Approved" : "Awaiting Approval"} />
            </div>
            <CustomerField title="Email" value={customer.email} />
            <div className="flex flex-row gap-10">
              <CustomerField title="First Name" value={customer.firstName} />
              <CustomerField title="Last Name" value={customer.lastName} />
            </div>
            <CustomerField title="Role" value={customer.role} />
            <div className="flex flex-col w-3/4 mx-auto mt-5">
              <button
                className={`flex flex-row items-center justify-center rounded-full border-[1px] p-2  ${
                  customer.verifiedByAdmin ? "bg-yellow-400 text-black" : "bg-green-600 text-white"
                }`}
                onClick={() => verifyCustomer(customer.id, customer.verifiedByAdmin)}
              >
                {customer.verifiedByAdmin ? (
                  <>
                    <AiOutlineClose size={20} />
                    <span className="ml-2">Cancel Membership</span>
                  </>
                ) : (
                  <>
                    <AiOutlineCheck size={20} />
                    <span className="ml-2">Approve Membership</span>
                  </>
                )}
              </button>
              {showDeleteConfirmationModal ? (
                <DeleteConfirmationModal
                  setShowDeleteConfirmationModal={setShowDeleteConfirmationModal}
                  customersMutate={customersMutate}
                  customerId={customer.id}
                />
              ) : (
                <button
                  className="flex flex-row items-center justify-center rounded-full border-[1px] p-2 bg-red-600 text-white"
                  onClick={() => setShowDeleteConfirmationModal(true)}
                >
                  <BsFillTrashFill size={20} />
                  <span className="ml-2">Delete Customer</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <CustomerField title="Id" value="" />
            <CustomerField title="Email" value="" />
            <CustomerField title="First Name" value="" />
            <CustomerField title="Last Name" value="" />
            <CustomerField title="Role" value="" />
            <CustomerField title="Verification Status" value="" />
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteConfirmationModal({
  setShowDeleteConfirmationModal,
  customerId,
  customersMutate,
}: {
  setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  customerId: number;
  customersMutate: KeyedMutator<{
    customers: User[];
    customerCount: number;
  }>;
}) {
  const deleteCustomer = async () => {
    toast.loading("Loading...");
    const response = await fetch(`/admin/customers/delete-customer/${customerId}`, {
      method: "DELETE",
    });
    const message = await response.json();
    toast.dismiss();
    customersMutate();
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
    <div className="m-auto">
      <h1 className="text-lg p-2">Are you sure you wanted to delete this user? This action is irreversible.</h1>
      <div className="flex flex-row justify-evenly p-2">
        <button
          className=" p-2 rounded-full border-2 text-lg border-black bg-gray-400 text-white hover:shadow-lg hover:-translate-y-2 "
          onClick={() => setShowDeleteConfirmationModal(false)}
        >
          Cancel
        </button>
        <button
          className=" p-2 rounded-full border-2 text-lg border-black bg-red-600 text-white hover:shadow-lg hover:-translate-y-2"
          onClick={() => deleteCustomer()}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
