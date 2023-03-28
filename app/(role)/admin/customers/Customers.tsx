import { User } from "@prisma/client";
import { verify } from "crypto";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "app/Loader";
import { KeyedMutator } from "swr";

export function CustomerTable({
  setCustomer,
  data,
  isLoading,
}: {
  setCustomer: React.Dispatch<React.SetStateAction<User>>;
  data: any;
  isLoading: boolean;
}) {
  return (
    <div className="grid border-2 relative border-black text-center">
      <div className="grid grid-cols-6 bg-black text-white font-bold">
        <div className="py-3">Id</div>
        <div className="py-3">Email</div>
        <div className="py-3">First Name</div>
        <div className="py-3">Last Name</div>
        <div className="py-3">Role</div>
        <div className="py-3">Verified</div>
      </div>
      {!isLoading ? (
        data ? (
          data.customers.map((customer) => {
            return (
              <div key={customer.id} className="grid grid-cols-6 hover:bg-white" onClick={() => setCustomer(customer)}>
                <div className="py-2">{customer.id}</div>
                <div className="py-2">{customer.email}</div>
                <div className="py-2">{customer.firstName}</div>
                <div className="py-2">{customer.lastName}</div>
                <div className="py-2">{customer.role}</div>
                <div className="py-2">{customer.verified ? "yes" : "no"}</div>
              </div>
            );
          })
        ) : null
      ) : (
        <div className="flex justify-center py-5">
          <Loader />
        </div>
      )}
      <div className="grid grid-cols-6">
        <div className="py-2">
          <button>&lt;-</button>
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div className="py-2">
          <button>-&gt;</button>
        </div>
      </div>
    </div>
  );
}

export function CustomerDetails({
  customer,
  setCustomer,
  mutate,
}: {
  customer: User;
  setCustomer: React.Dispatch<React.SetStateAction<User>>;
  mutate: KeyedMutator<any>;
}) {
  const [show, setShow] = useState(false);

  function CustomerField({ title, value }) {
    return (
      <div>
        <span>{title}:</span>
        <span>{value}</span>
      </div>
    );
  }
  const verifyCustomer = async (id, status) => {
    const data = await fetch("/admin/customers/verify-customer", {
      method: "POST",
      body: JSON.stringify({ id, verify: status }),
    });
    const response = await data.json();
    mutate();
    setCustomer(null);
    toast.success(response.message);
  };

  console.log(customer);
  return customer ? (
    <div>
      {show && <DeleteConfirmationModal setShow={setShow} mutate={mutate} customerId={customer.id} />}
      <CustomerField title="Id" value={customer.id} />
      <CustomerField title="Email" value={customer.email} />
      <CustomerField title="First Name" value={customer.firstName} />
      <CustomerField title="Last Name" value={customer.lastName} />
      <CustomerField title="Role" value={customer.role} />
      <CustomerField title="Verification Status" value={customer.verified ? "Approved" : "Awaiting Approval"} />
      <button
        className={`rounded-full border-black border-2 p-2 hover:text-white ${
          customer.verified ? "hover:bg-yellow-400 " : "hover:bg-green-600"
        }`}
        onClick={() => verifyCustomer(customer.id, customer.verified)}
      >
        {customer.verified ? "Cancel Membership" : "Approve Membership"}
      </button>
      <button className="rounded-full border-black border-2 p-2 hover:bg-red-700 hover:text-white" onClick={() => setShow(true)}>
        Delete Customer
      </button>
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
  );
}

function DeleteConfirmationModal({
  setShow,
  customerId,
  mutate,
}: {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  customerId: number;
  mutate: any;
}) {
  const deleteCustomer = async () => {
    toast.loading("Loading...");
    const response = await fetch(`/admin/customers/delete-customer/${customerId}`, {
      method: "DELETE",
    });
    const json = await response.json();
    console.log(json);
    mutate();
    toast.dismiss();
    if (json.status === 200) toast.success(json.message);
    else {
      toast.error(json.message);
    }
    setShow(false);
    window.location.reload();
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
  }, []);

  return (
    <div
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 p-4 overflow-x-hidden overflow-y-auto bg-black w-full md:h-full md:inset-0 h-[calc(100%-1rem)] z-50 "
      onClick={() => setShow(false)}
    >
      <div className="relative w-1/3 h-full max-w-2xl md:h-auto m-auto " onClick={(e) => e.stopPropagation()}>
        <div className=" flex flex-col items-center relative bg-white rounded-lg shadow dark:bg-gray-700 ">
          <h1 className="text-lg p-2">Are you sure you wanted to delete this user? This action is irreversible.</h1>
          <div className="flex flex-row gap-8 p-2">
            <button
              className=" p-2 rounded-full border-2 text-lg border-black bg-gray-400 text-white hover:shadow-lg hover:-translate-y-2 "
              onClick={() => setShow(false)}
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
      </div>
    </div>
  );
}
