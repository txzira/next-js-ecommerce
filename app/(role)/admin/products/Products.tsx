import useSWR, { KeyedMutator } from "swr";
import { toast } from "react-hot-toast";
import { Product, ProductVariant } from "@prisma/client";
import React, { useEffect, useState } from "react";
import Loader from "app/Loader";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
export function ProductCategoryPortal({}) {
  const [categoryName, setCategoryName] = useState("");
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error, isLoading, mutate: productTypesMutate } = useSWR("/admin/products/get-categories", fetcher);
  const addCategory = async (event) => {
    event.preventDefault();
    const response = await fetch("/admin/products/create-category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryName }),
    });
    const data = await response.json();
    setCategoryName("");
    productTypesMutate();
    data.status === 200 ? toast.success(data.message) : toast.error(data.message);
  };
  return (
    <div>
      <h1 className="text-4xl font-bold pb-5">Create Category</h1>
      <div className="flex flex-row md:justify-evenly">
        <div>
          <div className="text-lg font-semibold">Add Category</div>
          <form className="flex flex-col gap-2 mr-3">
            <div className="flex justify-between gap-2">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" value={categoryName} placeholder="Bottoms" onChange={(e) => setCategoryName(e.target.value)} />
            </div>
            <button type="submit" className="bg-green-500 rounded-full p-2" onClick={(event) => addCategory(event)}>
              Add Category
            </button>
          </form>
        </div>
        <div className="md:w-1/4 border-black  border-[1px] rounded-lg mb-5 ">
          <div className="grid grid-cols-2  md:p-2 md:rounded-tl-md md:rounded-tr-md  border-black bg-black text-white">
            <div>Category Name</div>
            <div>Actions</div>
          </div>
          {data && data.categories.length > 0 ? (
            data.categories.map((type) => {
              return (
                <div className="grid grid-cols-2 md:px-2 items-center">
                  <div>{type.name}</div>
                  <div>
                    <button title="Edit">
                      <MdOutlineEdit style={{ color: "black" }} size={30} />
                    </button>
                    <button title="Delete">
                      <MdDeleteOutline style={{ color: "red" }} size={30} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center">No Categories.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductForm({ mutate }: { mutate: KeyedMutator<any> }) {
  const [name, setName] = useState("");
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

  return (
    <div className="flex flex-row">
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
  categoriesData,
  category,
  setCategory,
}: {
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  data: any;
  isLoading: boolean;
  categoriesData: any;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div>
      <h1 className="text-4xl font-bold pb-5">Products</h1>
      <div className="flex flex-row">
        <div className="mr-2">Categories:</div>
        <div>
          <button
            className={`px-2 ${category === "All" ? "bg-black text-white" : "hover:bg-black hover:text-white"} `}
            onClick={() => setCategory("All")}
          >
            All
          </button>
          {categoriesData
            ? categoriesData.categories.map((category) => {
                return (
                  <button
                    className={`px-2 ${category === category.name ? "bg-black text-white" : "hover:bg-black hover:text-white"} `}
                    onClick={() => setCategory(category.name)}
                  >
                    {category.name}
                  </button>
                );
              })
            : null}
        </div>
      </div>
      <div className="grid border-2 relative border-black text-center ">
        <div className="grid grid-cols-5 bg-black text-white font-bold">
          <div className="px-2">Id</div>
          <div className="px-2">Name</div>
          <div className="px-2">Price</div>
          <div className="px-2">Type</div>
          <div className="px-2">Available</div>
        </div>
        {!isLoading ? (
          data.products.map((product) => {
            return (
              <div key={product.id} className="grid grid-cols-5 hover:bg-white cursor-pointer" onClick={() => setProduct(product)}>
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
    <div>
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
        </div>
      </form>
    </div>
  ) : null;

  function productsAreEqual(product1: Product, product2: Product) {
    if (product1.name === product2.name && product1.price === product2.price) {
      return true;
    } else {
      return false;
    }
  }
}

function ProductVariantsTable({ variantsData }) {
  console.log(variantsData);
  return (
    <div className="">
      <div className="grid grid-cols-3">
        <div>Name</div>
        <div>Price</div>
        <div>Availability</div>
      </div>

      {variantsData &&
        variantsData.productVariants.map((variant: ProductVariant) => {
          return (
            <div className="grid grid-cols-3">
              <div className="">{variant.name}</div>
              <div>{variant.price}</div>
              <div>{variant.available ? "In Stock" : "Out of Stock"}</div>
            </div>
          );
        })}
    </div>
  );
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
