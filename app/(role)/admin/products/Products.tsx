import useSWR, { KeyedMutator } from "swr";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Product } from "@prisma/client";
import React, { FormEvent, useEffect, useState } from "react";
import Loader from "app/Loader";

export function ProductForm({ mutate }: { mutate: KeyedMutator<any> }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [productTypeName, setProductTypeName] = useState("");
  const [productType, setProductType] = useState("");
  const [price, setPrice] = useState("");
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error, isLoading, mutate: productTypesMutate } = useSWR("/admin/products/get-product-types", fetcher);

  useEffect(() => {
    if (data) {
      if (data.productTypes.length > 0) {
        setProductType(data.productTypes[0].id);
      }
    }
  });

  async function submitForm(event) {
    event.preventDefault();
    toast.loading("Loading...");
    console.log(productType);
    const response = await fetch("/api/admin/product/create-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price, productType }),
    });
    const data = await response.json();
    mutate();
    setName("");
    setPrice("");
    setProductType(null);
    toast.dismiss();
    data.status === "ok" ? toast.success(data.message) : toast.error(data.message);
  }

  const addProductType = async (event) => {
    event.preventDefault();
    const response = await fetch("/admin/products/add-product-type", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productTypeName }),
    });
    const data = await response.json();
    setProductTypeName("");
    productTypesMutate();
    data.status === 200 ? toast.success(data.message) : toast.error(data.message);
  };

  return (
    <div className="flex flex-row">
      <div>
        <h1 className="text-4xl font-bold pb-5">Create Product Type</h1>

        <form className="flex flex-row items-center">
          <div className="flex flex-col gap-2 mr-3">
            <div className="flex justify-between gap-2">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={productTypeName}
                placeholder="Product Type"
                onChange={(e) => setProductTypeName(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-green-500 rounded-full p-2" onClick={(event) => addProductType(event)}>
              Add Product Type
            </button>
          </div>
        </form>
      </div>

      <div className="border-l-[1px] border-black"></div>
      <div>
        <h1 className="text-4xl font-bold pb-5">Create Product</h1>

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
            <div>
              <label htmlFor="productType">Product Type</label>
              <select id="productType" onChange={(event) => setProductType(event.target.value)}>
                {data &&
                  data.productTypes.map((type) => {
                    console.log(type);
                    return <option value={type.id}>{type.name}</option>;
                  })}
              </select>
            </div>
          </div>
          <button type="submit" className="bg-green-500 rounded-full p-2" onClick={(event) => submitForm(event)}>
            Add Product
          </button>
        </form>
      </div>
    </div>
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
  return (
    <div>
      <div className="grid border-2 relative border-black text-center ">
        <div className="grid grid-cols-4 bg-black text-white font-bold">
          <div className="px-2">Id</div>
          <div className="px-2">Name</div>
          <div className="px-2">Price</div>
          <div className="px-2">Type</div>
          <div className="px-2">Available</div>
        </div>
        {!isLoading ? (
          data.products.map((product) => {
            return (
              <div key={product.id} className="grid grid-cols-4 hover:bg-white cursor-pointer" onClick={() => setProduct(product)}>
                <div className="px-2">{product.id}</div>
                <div className="px-2">{product.name}</div>
                <div className="px-2">${product.price.toString()}</div>
                <div className="px-2">{product.type ? `${product.type.name}` : null}</div>
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
    </div>
  );
}

export function ProductDetails({
  product,
  setProduct,
  mutate,
  typesData,
}: {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  mutate: KeyedMutator<any>;
  typesData: any;
}) {
  const [formProduct, setFormProduct] = useState<Product>(product);
  const [checker, setChecker] = useState<boolean>(productsAreEqual(product, formProduct));
  const [active, setActive] = useState<boolean>(false);
  const [variant, setVariant] = useState({ variantName: "", variantPrice: 0 });

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const {
    data: variantsData,
    error: variantsError,
    isLoading: variantsIsLoading,
    mutate: variantsMutate,
  } = useSWR(`/admin/products/get-product-variants/${product.id}`, fetcher);
  console.log(variantsData);
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

  const createProductVariant = async (event) => {
    event.preventDefault();
    const data = await fetch("/admin/products/create-product-variant", {
      method: "POST",
      body: JSON.stringify({ id: product.id, variant }),
    });
    const response = await data.json();
    variantsMutate();
    toast.success(response.message);
    console.log(response);
  };

  useEffect(() => {
    setChecker(productsAreEqual(product, formProduct));
  }, [formProduct, product]);
  useEffect(() => {
    setFormProduct(product);
    setActive(product.active);
  }, [product]);

  return product ? (
    <form className="flex flex-col items-center  ">
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
          <div className="flex justify-between gap-2">
            <label>Category</label>
            <select onChange={(event) => setFormProduct({ ...formProduct, productTypeId: Number(event.target.value) })}>
              {typesData &&
                typesData.productTypes.map((type) => {
                  return <option value={type.id}>{type.name}</option>;
                })}
            </select>
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
      <div className="border-black border-2 p-2">
        <h1>Product Variants</h1>
        <div className="flex flex-row items-center">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label>Variant Name</label>
              <input
                className="bg-white border-black border-[1px]"
                type="text"
                value={variant.variantName}
                onChange={(event) => setVariant({ ...variant, variantName: event.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label>Variant Price</label>
              <input
                className="bg-white border-black border-[1px]"
                type="number"
                value={variant.variantPrice}
                onChange={(event) => setVariant({ ...variant, variantPrice: Number(event.target.value) })}
              />
            </div>
          </div>
          <button className="bg-blue-600 rounded-full h-10" onClick={(event) => createProductVariant(event)}>
            Add Variant
          </button>
        </div>
        <div>
          {variantsData &&
            variantsData.productVariants.map((variant) => {
              return <div>{variant.name}</div>;
            })}
        </div>
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
