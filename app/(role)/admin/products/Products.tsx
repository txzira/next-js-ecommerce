import useSWR, { KeyedMutator } from "swr";
import { toast } from "react-hot-toast";
import { Product, ProductVariant } from "@prisma/client";
import React, { useEffect, useState } from "react";
import Loader from "app/Loader";
import { AiOutlineClose } from "react-icons/ai";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";

export function ProductForm({ mutate }: { mutate: KeyedMutator<any> }) {
  const [name, setName] = useState("");
  const [productType, setProductType] = useState(null);
  const [price, setPrice] = useState("");
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesIsLoading,
    mutate: categoriesMutate,
  } = useSWR("/admin/categories/get-categories", fetcher);

  async function CreateProduct(event) {
    event.preventDefault();
    toast.loading("Loading...");
    const response = await fetch("/admin/products/create-product", {
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
    data.status === 200 ? toast.success(data.message) : toast.error(data.message);
  }

  return (
    <form className="" onSubmit={CreateProduct}>
      <h1 className="pb-1 text-2xl font-semibold">Create Product</h1>
      <div className="flex flex-row justify-between mb-2">
        <div className="flex flex-col w-2/3">
          <label htmlFor="name" className="pl-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="pl-1 border-[1px] rounded-lg"
            value={name}
            placeholder="Product Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-1/4">
          <label htmlFor="price" className="pl-1">
            Price
          </label>
          <input
            type="number"
            id="price"
            className="pl-1 border-[1px] rounded-lg"
            value={price}
            placeholder="0.00"
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-end">
        <div className="flex flex-col">
          <label htmlFor="productType" className="pl-1">
            Product Type
          </label>
          <select id="productType" className="border-[1px] rounded-lg" onChange={(event) => setProductType(event.target.value)}>
            <option value={null}>None</option>
            {categoriesData &&
              categoriesData.categories.map((category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
          </select>
        </div>
        <button type="submit" className="px-2 bg-green-500 rounded-xl text-white" onClick={(event) => CreateProduct(event)}>
          Add
        </button>
      </div>
    </form>
  );
}

export function ProductTable({
  setProduct,
  data,
  isLoading,
  categoriesData,
  setCategory,
}: {
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  data: any;
  isLoading: boolean;
  categoriesData: any;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}) {
  function showProductDetailsModal(product) {
    setProduct(product);
  }

  return (
    <div>
      <div className="flex flex-row items-center w-1/3 mb-2 pl-1">
        <label className="mr-2">Categories: </label>
        <select className="border-[1px] rounded-lg" onChange={(event) => setCategory(event.target.value)}>
          <option value="All">All</option>
          {categoriesData
            ? categoriesData.categories.map((category) => {
                return (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                );
              })
            : null}
        </select>
      </div>
      <div className="grid border-2 border-black rounded-lg  ">
        <div className="grid grid-cols-4 rounded-t-md border-black bg-black text-white p-1 text-lg font-semibold justify-evenly">
          <div className="col-span-2 w-5/6">Name</div>
          <div className="">Price</div>
          <div className="">Category</div>
        </div>
        {!isLoading ? (
          data.products.map((product) => {
            return (
              <div
                key={product.id}
                className="grid grid-cols-4 hover:bg-white cursor-pointer even:bg-slate-300 last:rounded-b-lg"
                onClick={() => showProductDetailsModal(product)}
              >
                <div className="pl-1 col-span-2 w-5/6">{product.name}</div>
                <div className="">${product.price.toString()}</div>
                <div className="">{product.category ? `${product.category.name}` : null}</div>
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
  categoriesData,
}: {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  mutate: KeyedMutator<any>;
  categoriesData: any;
}) {
  const [formProduct, setFormProduct] = useState<Product>(product);
  const [variant, setVariant] = useState({ variantName: "", variantPrice: 0 });
  const [variantDetails, setVariantDetails] = useState<ProductVariant>(null);
  const [showDelete, setShowDelete] = useState(false);

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
    toast.success(response.message);
  };

  const createProductVariant = async (event) => {
    event.preventDefault();
    if (!variant.variantName) {
      toast.error("Cannot add variant with empty name.");
      return;
    }
    const data = await fetch("/admin/products/create-product-variant", {
      method: "POST",
      body: JSON.stringify({ id: product.id, variant }),
    });
    const response = await data.json();
    variantsMutate();
    toast.success(response.message);
  };

  useEffect(() => {
    setFormProduct(product);
  }, [product]);

  function closeOnEscKeyDown(event) {
    if ((event.charCode || event.keyCode) === 27) {
      setProduct(null);
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
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 bg-black w-full h-full md:inset-0 ] z-50 overflow-y-scroll "
      onClick={() => setProduct(null)}
    >
      <div className="relative p-2 w-4/5 m-auto bg-white rounded-xl" onClick={(e) => e.stopPropagation()}>
        {product ? (
          <form>
            <h1 className="flex items-center pb-1 text-2xl font-semibold">
              <button className="rounded-lg" onClick={() => setProduct(null)}>
                <AiOutlineClose size={30} color="" />
              </button>
              <span>Edit Product</span>
            </h1>
            <div className="flex flex-row justify-between mb-3">
              <div className="flex flex-col w-3/5">
                <label>Name</label>
                <input
                  type="text"
                  className="pl-1 border-[1px] rounded-lg"
                  value={formProduct.name}
                  onChange={(event) => setFormProduct({ ...formProduct, name: event.target.value })}
                />
              </div>
              <div className="flex flex-col">
                <label>Category</label>
                <select
                  className="border-[1px] rounded-lg"
                  onChange={(event) => setFormProduct({ ...formProduct, productCategoryId: Number(event.target.value) })}
                >
                  <option defaultChecked={true} value={null}>
                    --Unset--
                  </option>
                  {categoriesData &&
                    categoriesData.categories.map((type) => {
                      return (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
            <div className="flex flex-row justify-between mb-3">
              <div className="flex flex-col w-1/4">
                <label>Price</label>
                <input
                  type="number"
                  className="pl-1 border-[1px] rounded-lg"
                  value={formProduct.price}
                  onChange={(event) => setFormProduct({ ...formProduct, price: Number(event.target.value) })}
                />
              </div>
              <div className="flex flex-col items-center">
                <span>Toggle Availability:</span>
                <label
                  htmlFor="approval"
                  className={`flex cursor-pointer ${
                    formProduct.active ? "bg-green-500" : "bg-gray-500"
                  }  w-20 h-10 rounded-full relative items-center `}
                >
                  <input
                    type="checkbox"
                    id="approval"
                    className="sr-only peer"
                    checked={formProduct.active}
                    onChange={() => setFormProduct({ ...formProduct, active: !formProduct.active })}
                  />
                  <span className="w-10 h-10 absolute bg-white rounded-full  peer-checked:left-10 shadow-xl"></span>
                </label>
              </div>
            </div>
            <div className="flex justify-center mb-3">
              <button
                type="button"
                className={`bg-blue-900 text-white font-semibold rounded-full px-2 py-1`}
                onClick={(event) => editProduct(event)}
              >
                Save
              </button>
            </div>
          </form>
        ) : null}

        {!variantDetails ? (
          <ProductVariantsTable variantsData={variantsData} setVariantDetails={setVariantDetails} setShowDelete={setShowDelete} />
        ) : !showDelete ? (
          <ProductVariantDetails variant={variantDetails} setVariantDetails={setVariantDetails} mutate={variantsMutate} />
        ) : (
          <DeleteConfirmation
            variant={variantDetails}
            setVariantDetails={setVariantDetails}
            mutate={variantsMutate}
            setShowDelete={setShowDelete}
          />
        )}

        <form>
          <h1 className="pb-1 text-2xl font-semibold">Create Variant</h1>
          <div className="flex flex-col">
            <div className="flex flex-col w-2/3">
              <label>Variant Name</label>
              <input
                className="p-1 border-[1px] bg-white rounded-lg"
                type="text"
                value={variant.variantName}
                onChange={(event) => setVariant({ ...variant, variantName: event.target.value })}
              />
            </div>
            <div className="flex flex-row items-end justify-between">
              <div className="flex flex-col w-1/4">
                <label className="whitespace-nowrap">Variant Price</label>
                <input
                  className="p-1 border-[1px] bg-white rounded-lg"
                  type="number"
                  value={variant.variantPrice}
                  onChange={(event) => setVariant({ ...variant, variantPrice: Number(event.target.value) })}
                />
              </div>
              <button className="whitespace-nowrap bg-green-600 rounded-full px-2 py-1 " onClick={(event) => createProductVariant(event)}>
                Add Variant
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductVariantsTable({
  variantsData,
  setVariantDetails,
  setShowDelete,
}: {
  variantsData;
  setVariantDetails: React.Dispatch<React.SetStateAction<ProductVariant>>;
  setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleDelete = (variant) => {
    setVariantDetails(variant);
    setShowDelete(true);
  };
  return (
    <div>
      <h1 className="pb-1 text-2xl font-semibold">Product Variants</h1>
      <div className="border-black border-[1px] rounded-lg ">
        <div className="grid grid-cols-6 p-1 bg-black text-white rounded-t-md  ">
          <div className="col-span-2">Name</div>
          <div className="">Price</div>
          <div className="col-span-2">Availability</div>
          <div></div>
        </div>
        {variantsData && variantsData.productVariants.length > 0 ? (
          variantsData.productVariants.map((variant: ProductVariant) => {
            return (
              <div key={variant.id} className="grid grid-cols-6 even:bg-slate-300 last:rounded-b-lg">
                <div className="pl-1 col-span-2">{variant.name}</div>
                <div className="">{variant.price}</div>
                <div className="col-span-2">{variant.available ? "In Stock" : "Out of Stock"}</div>
                <div className="flex justify-evenly">
                  <button onClick={() => setVariantDetails(variant)}>
                    <MdOutlineEdit />
                  </button>
                  <button onClick={() => handleDelete(variant)}>
                    <MdDeleteOutline color="red" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center">No Product Variants.</div>
        )}
      </div>
    </div>
  );
}

function ProductVariantDetails({
  variant,
  setVariantDetails,
  mutate,
}: {
  variant: ProductVariant;
  setVariantDetails: React.Dispatch<React.SetStateAction<ProductVariant>>;
  mutate: KeyedMutator<any>;
}) {
  const [details, setDetails] = useState(variant);

  const editVariant = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const data = await fetch("/admin/products/edit-product-variant", { method: "PUT", body: JSON.stringify({ details }) });
    const response = await data.json();
    if (response.status === 200) {
      toast.success(response.message);
      mutate();
      setVariantDetails(null);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <form>
      <h1 className="flex items-center pb-1 text-2xl font-semibold">
        <button className="bg-black rounded-lg" onClick={() => setVariantDetails(null)}>
          <BsFillArrowLeftSquareFill size={40} color="white" />
        </button>
        <span>Edit Variant</span>
      </h1>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col w-1/2 mb-3">
          <label>Variant Name</label>
          <input
            className="pl-1 border-[1px] bg-white rounded-lg"
            type="text"
            value={details.name}
            onChange={(event) => setDetails({ ...details, name: event.target.value })}
          />
        </div>
        <div className="flex flex-col w-2/5">
          <label className="">Variant Price</label>
          <input
            className="pl-1 border-[1px] bg-white rounded-lg"
            type="number"
            value={details.price}
            onChange={(event) => setDetails({ ...details, price: Number(event.target.value) })}
          />
        </div>
      </div>
      <div className="flex flex-row items-end justify-between">
        <div className="flex flex-col items-center">
          <span>Toggle Availability:</span>
          <label
            htmlFor="variantAvailability"
            className={`flex cursor-pointer ${
              details.available ? "bg-green-500" : "bg-gray-500"
            }  w-20 h-9 rounded-full relative items-center `}
          >
            <input
              type="checkbox"
              id="variantAvailability"
              className="sr-only peer/variant"
              checked={details.available}
              onChange={() => setDetails({ ...details, available: !details.available })}
            />
            <span className="w-10 h-9 absolute bg-white rounded-full  peer-checked/variant:left-10 shadow-xl"></span>
          </label>
        </div>
        <button className="bg-blue-900 text-white rounded-full px-2 py-1" onClick={(event) => editVariant(event)}>
          Save
        </button>
      </div>
    </form>
  );
}

function DeleteConfirmation({
  variant,
  setVariantDetails,
  mutate,
  setShowDelete,
}: {
  variant: ProductVariant;
  setVariantDetails: React.Dispatch<React.SetStateAction<ProductVariant>>;
  mutate: KeyedMutator<any>;
  setShowDelete;
}) {
  const deleteVariant = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const data = await fetch(`/admin/products/delete-product-variant/${variant.id}`, { method: "DELETE" });
    const response = await data.json();
    if (response.status === 200) {
      toast.success(response.message);
      mutate();
      setVariantDetails(null);
      setShowDelete(false);
    } else {
      toast.error(response.message);
    }
  };

  const handleCancel = () => {
    setVariantDetails(null);
    setShowDelete(false);
  };

  return (
    <div>
      <p>Are you sure you want to delete variant &quot;{variant.name}&quot;? </p>
      <div className="flex flex-row justify-evenly">
        <button className="px-2 py-1 bg-gray-300 text-white rounded-full" onClick={() => handleCancel()}>
          Cancel
        </button>
        <button className="px-2 py-1 bg-red-600  text-white rounded-full" onClick={(event) => deleteVariant(event)}>
          Delete
        </button>
      </div>
    </div>
  );
}
