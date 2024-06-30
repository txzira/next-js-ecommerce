// import useSWR, { KeyedMutator } from "swr";
// import { toast } from "react-hot-toast";
// import { Category, Product, ProductVariant } from "@prisma/client";
// import React, { useEffect, useState } from "react";
// import Loader from "app/Loader";
// import { AiOutlineClose } from "react-icons/ai";
// import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
// import { BsFillArrowLeftSquareFill } from "react-icons/bs";
// import { IoMdAdd } from "react-icons/io";
// import Link from "next/link";

// export function ProductForm({
//   productsMutate,
// }: {
//   productsMutate: KeyedMutator<
//     (Product & {
//       category: Category;
//     })[]
//   >;
// }) {
//   const [name, setName] = useState("");
//   const [productCategory, setProductCategory] = useState(null);
//   const [price, setPrice] = useState("");

//   const {
//     data: categoriesData,
//     error: categoriesError,
//     isLoading: categoriesIsLoading,
//     mutate: categoriesMutate,
//   } = useSWR("/admin/categories/api/get-categories", (url) =>
//     fetch(url).then((res) => res.json())
//   );

//   const createProduct = async (event) => {
//     event.preventDefault();
//     toast.loading("Loading...");
//     const response = await fetch("/admin/products/create-product", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name, price, productCategory }),
//     });
//     const message = await response.json();
//     productsMutate();
//     setName("");
//     setPrice("");
//     setProductCategory(null);
//     toast.dismiss();
//     response.status === 201 ? toast.success(message) : toast.error(message);
//   };

//   return (
//     <form onSubmit={createProduct}>
//       <h1 className="pb-1 text-2xl font-semibold">Create Product</h1>
//       <div className="mb-2 flex flex-row justify-between">
//         <div className="flex w-2/3 flex-col">
//           <label htmlFor="name" className="pl-1">
//             Name
//           </label>
//           <input
//             type="text"
//             id="name"
//             className="rounded-lg border-[1px] pl-1"
//             value={name}
//             placeholder="Product Name"
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>
//         <div className="flex w-1/4 flex-col">
//           <label htmlFor="price" className="pl-1 ">
//             Price
//           </label>
//           <input
//             type="number"
//             id="price"
//             className="rounded-lg border-[1px] pl-1"
//             value={price}
//             placeholder="0.00"
//             onChange={(e) => setPrice(e.target.value)}
//           />
//         </div>
//       </div>
//       <div className="flex flex-row items-end justify-between">
//         <div className="flex flex-col">
//           <label htmlFor="productType" className="pl-1 ">
//             Product Type
//           </label>
//           <select
//             id="productType"
//             className="rounded-lg border-[1px]"
//             onChange={(event) => setProductCategory(event.target.value)}
//           >
//             <option value={null}>None</option>
//             {categoriesData &&
//               categoriesData.map((category) => {
//                 return (
//                   <option key={category.id} value={category.id}>
//                     {category.name}
//                   </option>
//                 );
//               })}
//           </select>
//         </div>
//         <button
//           type="submit"
//           className="flex flex-row items-center rounded-full bg-green-500 px-3 py-1.5 text-xs text-white "
//           onClick={(event) => createProduct(event)}
//         >
//           <IoMdAdd size={14} />
//           <span>ADD</span>
//         </button>
//       </div>
//     </form>
//   );
// }

// export function ProductTable({
//   setProduct,
//   productsData,
//   productsIsLoading,
//   categoriesData,
//   setCategory,
// }: {
//   setProduct: React.Dispatch<
//     React.SetStateAction<
//       Product & {
//         category: Category;
//       }
//     >
//   >;
//   productsData: (Product & {
//     category: Category;
//   })[];
//   productsIsLoading: boolean;
//   categoriesData: Category[];
//   setCategory: React.Dispatch<React.SetStateAction<string>>;
// }) {
//   return (
//     <div className="w-full">
//       <div className="mb-2 flex w-1/3 flex-row items-center pl-1">
//         <label className="mr-2">Categories: </label>
//         <select
//           className="rounded-lg border-[1px]"
//           onChange={(event) => setCategory(event.target.value)}
//         >
//           <option value="All">All</option>
//           {categoriesData
//             ? categoriesData.map((category) => {
//                 return (
//                   <option key={category.id} value={category.name}>
//                     {category.name}
//                   </option>
//                 );
//               })
//             : null}
//         </select>
//       </div>
//       <div className="grid rounded-lg border-2 border-black  ">
//         <div className="grid grid-cols-4 justify-evenly rounded-t-md border-black bg-black p-1 text-lg font-semibold text-white">
//           <div className="col-span-2 w-5/6">Name</div>
//           <div className="">Price</div>
//           <div className="">Category</div>
//         </div>
//         {!productsIsLoading ? (
//           productsData.length > 0 ? (
//             productsData.map((product) => {
//               return (
//                 <Link
//                   key={product.id}
//                   className="grid cursor-pointer grid-cols-4 last:rounded-b-lg even:bg-slate-300 hover:bg-white"
//                   href={`/admin/products/${product.id}`}
//                 >
//                   <div className="col-span-2 w-5/6 pl-1">{product.name}</div>
//                   <div className="">${product.price.toString()}</div>
//                   <div className="">
//                     {product.category ? `${product.category.name}` : null}
//                   </div>
//                 </Link>
//               );
//             })
//           ) : (
//             <div>No Products.</div>
//           )
//         ) : (
//           <div className="flex justify-center py-5">
//             <Loader />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export function ProductDetails({
//   product,
//   setProduct,
//   productsMutate,
//   categoriesData,
// }: {
//   product: Product;
//   setProduct: React.Dispatch<React.SetStateAction<Product>>;
//   productsMutate: KeyedMutator<
//     (Product & {
//       category: Category;
//     })[]
//   >;
//   categoriesData: Category[];
// }) {
//   const [formProduct, setFormProduct] = useState<Product>(product);
//   const [formProductVariant, setFormProductVariant] = useState({
//     name: "",
//     price: 0,
//   });
//   const [productVariant, setProductVariant] = useState<ProductVariant>(null);
//   const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
//     useState(false);

//   const {
//     data: productVariantsData,
//     error: productVariantsError,
//     isLoading: productVariantsIsLoading,
//     mutate: productVariantsMutate,
//   } = useSWR<ProductVariant[]>(
//     `/admin/products/get-product-variants/${product.id}`,
//     (url) => fetch(url).then((res) => res.json())
//   );

//   const editProduct = async (event) => {
//     event.preventDefault();
//     const response = await fetch("/admin/products/edit-product", {
//       method: "POST",
//       body: JSON.stringify({ formProduct }),
//     });
//     const message = await response.json();
//     productsMutate();
//     response.status === 200 ? toast.success(message) : toast.error(message);
//   };

//   const createProductVariant = async (event) => {
//     event.preventDefault();
//     if (!formProductVariant.name) {
//       toast.error("Cannot add variant with empty name.");
//       return;
//     }
//     const response = await fetch("/admin/products/create-product-variant", {
//       method: "POST",
//       body: JSON.stringify({
//         id: product.id,
//         productVariant: formProductVariant,
//       }),
//     });
//     const message = await response.json();
//     productVariantsMutate();
//     response.status === 201 ? toast.success(message) : toast.error(message);
//   };

//   useEffect(() => {
//     setFormProduct(product);
//   }, [product]);

//   function closeOnEscKeyDown(event) {
//     if ((event.charCode || event.keyCode) === 27) {
//       setProduct(null);
//     }
//   }
//   useEffect(() => {
//     document.body.addEventListener("keydown", closeOnEscKeyDown);
//     return function cleanup() {
//       document.body.removeEventListener("keydown", closeOnEscKeyDown);
//     };
//   });

//   return (
//     <div
//       className="fixed left-0 right-0 top-0 z-50 flex h-full w-full overflow-y-scroll bg-black bg-opacity-50 md:inset-0 "
//       onClick={() => setProduct(null)}
//     >
//       <div
//         className="relative m-auto w-4/5 rounded-xl bg-white p-2"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {product ? (
//           <form>
//             <h1 className="flex items-center pb-1 text-2xl font-semibold">
//               <button className="rounded-lg" onClick={() => setProduct(null)}>
//                 <AiOutlineClose size={30} color="" />
//               </button>
//               <span>Edit Product</span>
//             </h1>
//             <div className="mb-3 flex flex-row justify-between">
//               <div className="flex w-3/5 flex-col">
//                 <label>Name</label>
//                 <input
//                   type="text"
//                   className="rounded-lg border-[1px] pl-1"
//                   value={formProduct.name}
//                   onChange={(event) =>
//                     setFormProduct({ ...formProduct, name: event.target.value })
//                   }
//                 />
//               </div>
//               <div className="flex flex-col">
//                 <label>Category</label>
//                 <select
//                   className="rounded-lg border-[1px]"
//                   onChange={(event) =>
//                     setFormProduct({
//                       ...formProduct,

//                       productCategoryId: Number(event.target.value),
//                     })
//                   }
//                 >
//                   <option defaultChecked={true} value={null}>
//                     --Unset--
//                   </option>
//                   {categoriesData &&
//                     categoriesData.map((type) => {
//                       return (
//                         <option key={type.id} value={type.id}>
//                           {type.name}
//                         </option>
//                       );
//                     })}
//                 </select>
//               </div>
//             </div>
//             <div className="mb-3 flex flex-row justify-between">
//               <div className="flex w-1/4 flex-col">
//                 <label>Price</label>
//                 <input
//                   type="number"
//                   className="rounded-lg border-[1px] pl-1"
//                   value={formProduct.price}
//                   onChange={(event) =>
//                     setFormProduct({
//                       ...formProduct,
//                       price: Number(event.target.value),
//                     })
//                   }
//                 />
//               </div>
//               <div className="flex flex-col items-center">
//                 <span>Toggle Availability:</span>
//                 <label
//                   htmlFor="approval"
//                   className={`flex cursor-pointer ${
//                     formProduct.active ? "bg-green-500" : "bg-gray-500"
//                   }  relative h-10 w-20 items-center rounded-full `}
//                 >
//                   <input
//                     type="checkbox"
//                     id="approval"
//                     className="peer sr-only"
//                     checked={formProduct.active}
//                     onChange={() =>
//                       setFormProduct({
//                         ...formProduct,
//                         active: !formProduct.active,
//                       })
//                     }
//                   />
//                   <span className="absolute h-10 w-10 rounded-full bg-white  shadow-xl peer-checked:left-10"></span>
//                 </label>
//               </div>
//             </div>
//             <div className="mb-3 flex justify-center">
//               <button
//                 type="button"
//                 className={`rounded-full bg-blue-900 px-2 py-1 font-semibold text-white`}
//                 onClick={(event) => editProduct(event)}
//               >
//                 Save
//               </button>
//             </div>
//           </form>
//         ) : null}

//         {!productVariant ? (
//           <ProductVariantsTable
//             productVariantsData={productVariantsData}
//             productVariantsIsLoading={productVariantsIsLoading}
//             setProductVariant={setProductVariant}
//             setShowDeleteConfirmationModal={setShowDeleteConfirmationModal}
//           />
//         ) : !showDeleteConfirmationModal ? (
//           <ProductVariantDetails
//             productVariant={productVariant}
//             setProductVariant={setProductVariant}
//             productVariantsMutate={productVariantsMutate}
//           />
//         ) : (
//           <DeleteConfirmation
//             productVariant={productVariant}
//             setProductVariant={setProductVariant}
//             productVariantsMutate={productVariantsMutate}
//             setShowDeleteConfirmationModal={setShowDeleteConfirmationModal}
//           />
//         )}

//         <form>
//           <h1 className="pb-1 text-2xl font-semibold">Create Variant</h1>
//           <div className="flex flex-col">
//             <div className="flex w-2/3 flex-col">
//               <label>Variant Name</label>
//               <input
//                 className="rounded-lg border-[1px] bg-white p-1"
//                 type="text"
//                 value={formProductVariant.name}
//                 onChange={(event) =>
//                   setFormProductVariant({
//                     ...formProductVariant,
//                     name: event.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div className="flex flex-row items-end justify-between">
//               <div className="flex w-1/4 flex-col">
//                 <label className="whitespace-nowrap">Variant Price</label>
//                 <input
//                   className="rounded-lg border-[1px] bg-white p-1"
//                   type="number"
//                   value={formProductVariant.price}
//                   onChange={(event) =>
//                     setFormProductVariant({
//                       ...formProductVariant,
//                       price: Number(event.target.value),
//                     })
//                   }
//                 />
//               </div>
//               <button
//                 className="whitespace-nowrap rounded-full bg-green-600 px-2 py-1 "
//                 onClick={(event) => createProductVariant(event)}
//               >
//                 Add Variant
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// function ProductVariantsTable({
//   productVariantsData,
//   productVariantsIsLoading,
//   setProductVariant,
//   setShowDeleteConfirmationModal,
// }: {
//   productVariantsData: ProductVariant[];
//   productVariantsIsLoading: boolean;
//   setProductVariant: React.Dispatch<React.SetStateAction<ProductVariant>>;
//   setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
// }) {
//   const handleDelete = (variant) => {
//     setProductVariant(variant);
//     setShowDeleteConfirmationModal(true);
//   };

//   return (
//     <div>
//       <h1 className="pb-1 text-2xl font-semibold">Product Variants</h1>
//       <div className="rounded-lg border-[1px] border-black ">
//         <div className="grid grid-cols-6 rounded-t-md bg-black p-1 text-white  ">
//           <div className="col-span-2">Name</div>
//           <div className="">Price</div>
//           <div className="col-span-2">Availability</div>
//           <div></div>
//         </div>
//         {productVariantsIsLoading ? (
//           productVariantsData.length > 0 ? (
//             productVariantsData.map((productVariant: ProductVariant) => {
//               return (
//                 <div
//                   key={productVariant.id}
//                   className="grid grid-cols-6 last:rounded-b-lg even:bg-slate-300"
//                 >
//                   <div className="col-span-2 pl-1">{productVariant.name}</div>
//                   <div className="">{productVariant.price}</div>
//                   <div className="col-span-2">
//                     {productVariant.available ? "In Stock" : "Out of Stock"}
//                   </div>
//                   <div className="flex justify-evenly">
//                     <button onClick={() => setProductVariant(productVariant)}>
//                       <MdOutlineEdit />
//                     </button>
//                     <button onClick={() => handleDelete(productVariant)}>
//                       <MdDeleteOutline color="red" />
//                     </button>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="text-center">No Product Variants.</div>
//           )
//         ) : (
//           <div className="flex justify-center py-5">
//             <Loader />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function ProductVariantDetails({
//   productVariant,
//   setProductVariant,
//   productVariantsMutate,
// }: {
//   productVariant: ProductVariant;
//   setProductVariant: React.Dispatch<React.SetStateAction<ProductVariant>>;
//   productVariantsMutate: KeyedMutator<ProductVariant[]>;
// }) {
//   const [formProductVariant, setFormProductVariant] = useState(productVariant);

//   const editVariant = async (
//     event: React.MouseEvent<HTMLButtonElement, MouseEvent>
//   ) => {
//     event.preventDefault();
//     const response = await fetch("/admin/products/edit-product-variant", {
//       method: "PUT",
//       body: JSON.stringify({ details: formProductVariant }),
//     });
//     const message = await response.json();
//     if (response.status === 200) {
//       toast.success(message);
//       productVariantsMutate();
//       setProductVariant(null);
//     } else {
//       toast.error(message);
//     }
//   };

//   return (
//     <form>
//       <h1 className="flex items-center pb-1 text-2xl font-semibold">
//         <button
//           className="rounded-lg bg-black"
//           onClick={() => setProductVariant(null)}
//         >
//           <BsFillArrowLeftSquareFill size={40} color="white" />
//         </button>
//         <span>Edit Variant</span>
//       </h1>
//       <div className="flex flex-row justify-between">
//         <div className="mb-3 flex w-1/2 flex-col">
//           <label>Variant Name</label>
//           <input
//             className="rounded-lg border-[1px] bg-white pl-1"
//             type="text"
//             value={formProductVariant.name}
//             onChange={(event) =>
//               setFormProductVariant({
//                 ...formProductVariant,
//                 name: event.target.value,
//               })
//             }
//           />
//         </div>
//         <div className="flex w-2/5 flex-col">
//           <label className="">Variant Price</label>
//           <input
//             className="rounded-lg border-[1px] bg-white pl-1"
//             type="number"
//             value={formProductVariant.price}
//             onChange={(event) =>
//               setFormProductVariant({
//                 ...formProductVariant,
//                 price: Number(event.target.value),
//               })
//             }
//           />
//         </div>
//       </div>
//       <div className="flex flex-row items-end justify-between">
//         <div className="flex flex-col items-center">
//           <span>Toggle Availability:</span>
//           <label
//             htmlFor="variantAvailability"
//             className={`flex cursor-pointer ${
//               formProductVariant.available ? "bg-green-500" : "bg-gray-500"
//             }  relative h-9 w-20 items-center rounded-full `}
//           >
//             <input
//               type="checkbox"
//               id="variantAvailability"
//               className="peer/variant sr-only"
//               checked={formProductVariant.available}
//               onChange={() =>
//                 setFormProductVariant({
//                   ...formProductVariant,
//                   available: !formProductVariant.available,
//                 })
//               }
//             />
//             <span className="absolute h-9 w-10 rounded-full bg-white  shadow-xl peer-checked/variant:left-10"></span>
//           </label>
//         </div>
//         <button
//           className="rounded-full bg-blue-900 px-2 py-1 text-white"
//           onClick={(event) => editVariant(event)}
//         >
//           Save
//         </button>
//       </div>
//     </form>
//   );
// }

// function DeleteConfirmation({
//   productVariant,
//   setProductVariant,
//   productVariantsMutate,
//   setShowDeleteConfirmationModal,
// }: {
//   productVariant: ProductVariant;
//   setProductVariant: React.Dispatch<React.SetStateAction<ProductVariant>>;
//   productVariantsMutate: KeyedMutator<ProductVariant[]>;
//   setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
// }) {
//   const deleteVariant = async (
//     event: React.MouseEvent<HTMLButtonElement, MouseEvent>
//   ) => {
//     event.preventDefault();
//     const response = await fetch(
//       `/admin/products/delete-product-variant/${productVariant.id}`,
//       { method: "DELETE" }
//     );
//     const message = await response.json();
//     if (response.status === 200) {
//       toast.success(message);
//       productVariantsMutate();
//       setProductVariant(null);
//       setShowDeleteConfirmationModal(false);
//     } else {
//       toast.error(message);
//     }
//   };

//   const handleCancel = () => {
//     setProductVariant(null);
//     setShowDeleteConfirmationModal(false);
//   };

//   return (
//     <div>
//       <p>
//         Are you sure you want to delete variant &quot;{productVariant.name}
//         &quot;?{" "}
//       </p>
//       <div className="flex flex-row justify-evenly">
//         <button
//           className="rounded-full bg-gray-300 px-2 py-1 text-white"
//           onClick={() => handleCancel()}
//         >
//           Cancel
//         </button>
//         <button
//           className="rounded-full bg-red-600 px-2  py-1 text-white"
//           onClick={(event) => deleteVariant(event)}
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }
