import { useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import useSWR from "swr";

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
