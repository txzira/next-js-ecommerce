import useSWR, { KeyedMutator } from "swr";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Product } from "@prisma/client";
import React, { FormEvent, useEffect, useState } from "react";
import Loader from "app/Loader";

export function ProductForm({ mutate }: { mutate: KeyedMutator<any> }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  async function submitForm(event) {
    event.preventDefault();

    const response = await fetch("/api/admin/product/create-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price }),
    });
    const data = await response.json();
    mutate();
    setName("");
    setPrice("");
    data.status === "ok" ? toast.success(data.message) : toast.error(data.message);
  }

  return (
    <form className="flex flex-row items-center" onSubmit={submitForm}>
      <div className="flex flex-col gap-2 mr-3">
        <div className="flex justify-between gap-2">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" value={name} placeholder="Product Name" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex justify-between gap-2">
          <label htmlFor="price">Price</label>
          <input type="number" id="price" value={price} placeholder="0.00" onChange={(e) => setPrice(e.target.value)} />
        </div>
      </div>
      <button type="submit" className="bg-green-500 rounded-full p-2">
        Add Product
      </button>
    </form>
  );
}

export function ProductTable({
  setProduct,
  data,
  isLoading,
}: {
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  data: any;
  isLoading: boolean;
}) {
  console.log(data);
  return (
    <div className="grid border-2 relative border-black text-center">
      <div className="grid grid-cols-4 bg-black text-white font-bold">
        <div className="px-2">Id</div>
        <div className="px-2">Name</div>
        <div className="px-2">Price</div>
        <div className="px-2">Available</div>
      </div>
      {!isLoading ? (
        data.products.map((product) => {
          return (
            <div key={product.id} className="grid grid-cols-4 hover:bg-white cursor-pointer" onClick={() => setProduct(product)}>
              <div className="px-2">{product.id}</div>
              <div className="px-2">{product.name}</div>
              <div className="px-2">{product.price.toString()}</div>
              <div className="px-2">{product.active ? "yes" : "no"}</div>
            </div>
          );
        })
      ) : (
        <div className="flex justify-center py-5">
          <Loader />
        </div>
      )}
    </div>
  );
}

export function ProductDetails({
  product,
  setProduct,
  mutate,
}: {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  mutate: KeyedMutator<any>;
}) {
  const [formProduct, setFormProduct] = useState<Product>(product);
  const [checker, setChecker] = useState<boolean>(productsAreEqual(product, formProduct));
  const [active, setActive] = useState<boolean>(false);
  // const [show, setShow] = useState<boolean>(false);

  const editProduct = async (event) => {
    event.preventDefault();
    const data = await fetch("/admin/products/edit-product", {
      method: "POST",
      body: JSON.stringify({ formProduct }),
    });
    const response = await data.json();
    mutate();
    setProduct(null);
    toast.success(response.message);
  };

  const setProductAvailability = async (event) => {
    event.preventDefault();
    const data = await fetch("/admin/products/set-available", {
      method: "POST",
      body: JSON.stringify({ id: formProduct.id, active: !active }),
    });
    const response = await data.json();
    mutate();
    setActive(!active);
    toast.success(response.message);
  };

  useEffect(() => {
    setChecker(productsAreEqual(product, formProduct));
  }, [formProduct, product]);
  useEffect(() => {
    setFormProduct(product);
    setActive(product.active);
  }, [product]);

  return product ? (
    <form className="flex flex-col items-center ">
      <div className="flex flex-row">
        <div className="flex flex-col mr-3 gap-2">
          <div className="flex justify-between  gap-2">
            <label>Name</label>
            <input
              type="text"
              value={formProduct.name}
              onChange={(event) => setFormProduct({ ...formProduct, name: event.target.value })}
            />
          </div>
          <div className="flex justify-between gap-2">
            <label>Price</label>
            <input
              type="number"
              value={formProduct.price}
              onChange={(event) => setFormProduct({ ...formProduct, price: Number(event.target.value) })}
            />
          </div>
        </div>
        <button
          type="button"
          className={`${checker ? "bg-gray-500" : "bg-yellow-500"} text-white font-semibold rounded-full px-6 py-1`}
          disabled={checker}
          onClick={(event) => editProduct(event)}
        >
          Edit
        </button>
      </div>

      <div className="flex items-center gap-3 my-5">
        <span>Toggle Availability:</span>
        <label
          htmlFor="approval"
          className={`flex cursor-pointer ${active ? "bg-green-500" : "bg-gray-500"}  w-20 h-10 rounded-full relative items-center `}
        >
          <input
            type="checkbox"
            id="approval"
            className="sr-only peer"
            checked={active}
            onChange={(event) => setProductAvailability(event)}
          />
          <span className="w-10 h-10 absolute bg-white rounded-full  peer-checked:left-10 shadow-xl"></span>
        </label>
      </div>
    </form>
  ) : null;

  function productsAreEqual(product1: Product, product2: Product) {
    if (product1.name === product2.name && product1.price === product2.price) {
      return true;
    } else {
      return false;
    }
  }
}

{
  /* {show ? <DeleteConfirmationModal setShow={setShow} productId={formProduct.id} setProduct={setProduct} mutate={mutate} /> : null} */
}

// function DeleteConfirmationModal({
//   setShow,
//   productId,
//   setProduct,
//   mutate,
// }: {
//   setShow: React.Dispatch<React.SetStateAction<boolean>>;
//   productId: number;
//   setProduct: React.Dispatch<React.SetStateAction<Product>>;

//   mutate: KeyedMutator<any>;
// }) {
//   const deleteProduct = async (event) => {
//     event.preventDefault();
//     toast.loading("Loading...");
//     const data = await fetch(`/admin/products/delete-product/${productId}`, {
//       method: "DELETE",
//     });
//     const response = await data.json();
//     mutate();
//     toast.dismiss();
//     if (response.status === 200) toast.success(response.message);
//     else {
//       toast.error(response.message);
//     }
//     setProduct(null);
//     setShow(false);
//   };

//   function closeOnEscKeyDown(event) {
//     if ((event.charCode || event.keyCode) === 27) {
//       setShow(false);
//     }
//   }
//   useEffect(() => {
//     document.body.addEventListener("keydown", closeOnEscKeyDown);
//     return function cleanup() {
//       document.body.removeEventListener("keydown", closeOnEscKeyDown);
//     };
//   }, []);

//   return (
//     <div
//       className="flex fixed bg-opacity-50 top-0 left-0 right-0 p-4 overflow-x-hidden overflow-y-auto bg-black w-full md:h-full md:inset-0 h-[calc(100%-1rem)] z-50 "
//       onClick={() => setShow(false)}
//     >
//       <div className="relative w-1/3 h-full max-w-2xl md:h-auto m-auto " onClick={(e) => e.stopPropagation()}>
//         <div className=" flex flex-col items-center relative bg-white rounded-lg shadow dark:bg-gray-700 ">
//           <h1 className="text-lg p-2">Are you sure you wanted to delete this product? This action is irreversible.</h1>
//           <div className="flex flex-row gap-8 p-2">
//             <button
//               className=" p-2 rounded-full border-2 text-lg border-black bg-gray-400 text-white hover:shadow-lg hover:-translate-y-2 "
//               onClick={() => setShow(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className=" p-2 rounded-full border-2 text-lg border-black bg-red-600 text-white hover:shadow-lg hover:-translate-y-2"
//               onClick={(event) => deleteProduct(event)}
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
