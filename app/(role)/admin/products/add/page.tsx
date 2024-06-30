// "use client";
// import { Category, Product } from "@prisma/client";
// import {
//   FormContainer,
//   FormHeading,
//   FormInput,
//   FormInputCurrency,
//   FormTextArea,
//   FormTitle,
// } from "app/(components)/Form";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { BsArrowLeftShort } from "react-icons/bs";
// import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
// import useSWR from "swr";
// import {
//   CategoriesContainer,
//   DetailsContainer,
//   PriceContainer,
// } from "../[id]/(components)/Product";

// export default function AddProductPage() {
//   const router = useRouter();
//   const {
//     data: categoriesData,
//     error: categoriesError,
//     isLoading: categoriesIsLoading,
//     mutate: categoriesMutate,
//   } = useSWR<Category[]>("/admin/categories/api/get-categories", (url) =>
//     fetch(url).then((res) => res.json())
//   );
//   const [product, setProduct] = useState<Product>({
//     id: null,
//     name: "",
//     price: 0,
//     sku: null,
//     quantity: null,
//     description: null,
//     slug: null,
//     active: true,
//   });
//   const [defaultImage, setDefaultImage] = useState({
//     imageName: "",
//     imagePath: "",
//     oldImagePubId: "",
//   });
//   const [showCategories, setShowCategories] = useState(false);
//   const [selectedCategories, setSelectedCategories] = useState(
//     new Map<number, Category>()
//   );
//   console.log(categoriesData);

//   const addProduct = async (event) => {
//     event.preventDefault();
//     toast.loading("Loading...");
//     console.log(selectedCategories);
//     const response = await fetch("/admin/products/api/create-product", {
//       method: "POST",
//       body: JSON.stringify({
//         product,
//         defaultImage,
//         selectedCategories: Object.fromEntries(selectedCategories),
//       }),
//     });

//     const data = await response.json();
//     toast.dismiss();

//     if (response.status === 201) {
//       toast.success(data.message);

//       router.push(`/admin/products/${data.id}`);
//     } else {
//       toast.error(data.message);
//     }
//   };

//   return (
//     <div className="mx-auto h-full w-[90%]">
//       <FormTitle className="flex flex-row items-center gap-3">
//         <Link href="/admin/products">
//           <BsArrowLeftShort size={30} />
//         </Link>
//         Add Product
//       </FormTitle>
//       <pre>{JSON.stringify(product)}</pre>
//       <form onSubmit={addProduct}>
//         <DetailsContainer
//           product={product}
//           setProduct={setProduct}
//           defaultImage={defaultImage}
//           setDefaultImage={setDefaultImage}
//         />
//         <PriceContainer product={product} setProduct={setProduct} />
//         <CategoriesContainer
//           categoriesData={categoriesData}
//           selectedCategories={selectedCategories}
//           setSelectedCategories={setSelectedCategories}
//           setShowCategories={setShowCategories}
//           showCategories={showCategories}
//         />

//         <button
//           type="submit"
//           className="w-full rounded-lg bg-green-600 py-3 text-white"
//         >
//           Save
//         </button>
//       </form>
//     </div>
//   );
// }
// const CategoriesDropdown = ({
//   categoriesData,
//   showCategories,
//   setShowCategories,
//   selectedCategories,
//   setSelectedCategories,
// }: {
//   categoriesData: Category[];
//   showCategories: boolean;
//   selectedCategories: Map<string, Category>;
//   setShowCategories: React.Dispatch<React.SetStateAction<boolean>>;
//   setSelectedCategories: React.Dispatch<
//     React.SetStateAction<Map<string, Category>>
//   >;
// }) => {
//   const handleCheckedCategory = (event, category: Category) => {
//     if (event.target.checked) {
//       setSelectedCategories(
//         new Map(selectedCategories.set(event.target.value, category))
//       );
//     } else {
//       if (selectedCategories.delete(event.target.value))
//         setSelectedCategories(new Map(selectedCategories));
//     }
//   };
//   // useEffect(() => {
//   //   console.log(selectedCategories);
//   // }, [selectedCategories]);

//   return (
//     <div className="relative">
//       <div
//         className="flex h-14 w-full items-center justify-between rounded-lg border-2 border-[#cbdcf3] p-3  text-gray-900  shadow-md focus:border focus:border-black focus:shadow-[0_0_0_4px_#cbdcf3] focus:outline-none"
//         onClick={(e) => {
//           e.stopPropagation();
//           setShowCategories(!showCategories);
//         }}
//       >
//         {selectedCategories.size ? (
//           <span>
//             {selectedCategories.size === 1
//               ? selectedCategories.entries().next().value[1].name
//               : selectedCategories.size === 2
//               ? `${selectedCategories.entries().next().value[1].name} and ${
//                   selectedCategories.entries().next().value[1].name
//                 }`
//               : `${selectedCategories.entries().next().value[1].name}, ${
//                   selectedCategories.entries().next().value[1].name
//                 }, ${selectedCategories.size - 2} more`}
//           </span>
//         ) : (
//           <span>Choose a category</span>
//         )}
//         {showCategories ? (
//           <span>
//             <MdKeyboardArrowUp size={20} />
//           </span>
//         ) : (
//           <span>
//             <MdKeyboardArrowDown size={20} />
//           </span>
//         )}
//       </div>
//       {showCategories ? (
//         <ul className="absolute left-0  max-h-60 w-full overflow-y-scroll  rounded-lg border-2 border-[#cbdcf3] bg-white  shadow-md ">
//           {categoriesData.map((categoryData) => {
//             return (
//               <li
//                 key={categoryData.id}
//                 className="my-auto flex h-14 w-full flex-row items-center gap-3 border-b border-[#cbdcf3] px-3 hover:bg-[#cbdcf3]"
//               >
//                 <input
//                   id={categoryData.id.toString()}
//                   type="checkbox"
//                   name="categories"
//                   checked={selectedCategories.has(categoryData.id.toString())}
//                   value={categoryData.id}
//                   onChange={(event) =>
//                     handleCheckedCategory(event, categoryData)
//                   }
//                 />
//                 <label htmlFor={categoryData.id.toString()}>
//                   {categoryData.name}
//                 </label>
//               </li>
//             );
//           })}
//         </ul>
//       ) : null}
//     </div>
//   );
// };
