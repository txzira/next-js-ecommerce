import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import useSWR, { KeyedMutator } from "swr";

export function ProductCategoryPortal({}) {
  const [categoryName, setCategoryName] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: categoriesData, error, isLoading, mutate: categoriesMutate } = useSWR("/admin/categories/get-categories", fetcher);
  const addCategory = async (event) => {
    event.preventDefault();
    const response = await fetch("/admin/categories/create-category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryName }),
    });
    const data = await response.json();
    setCategoryName("");
    categoriesMutate();
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
          {categoriesData && categoriesData.categories.length > 0 ? (
            categoriesData.categories.map((category) => {
              return (
                <div className="grid grid-cols-2 md:px-2 items-center">
                  <div>{category.name}</div>
                  <div>
                    <button title="Edit" onClick={() => setShowUpdate(true)}>
                      <MdOutlineEdit style={{ color: "black" }} size={30} />
                    </button>
                    {showUpdate ? (
                      <UpdateCategoryModal
                        categoryId={category.id}
                        categoryName={category.name}
                        setShow={setShowUpdate}
                        categoriesMutate={categoriesMutate}
                      />
                    ) : null}
                    <button title="Delete" onClick={() => setShowDelete(true)}>
                      <MdDeleteOutline style={{ color: "red" }} size={30} />
                    </button>
                    {showDelete ? (
                      <DeleteCategoryConfirmationModal
                        setShow={setShowDelete}
                        categoryId={category.id}
                        categoriesMutate={categoriesMutate}
                      />
                    ) : null}
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

function UpdateCategoryModal({
  setShow,
  categoryId,
  categoryName,
  categoriesMutate,
}: {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  categoryId: number;
  categoryName: string;
  categoriesMutate: KeyedMutator<any>;
}) {
  const [newCategoryName, setNewCategoryName] = useState(categoryName);
  const updateCategory = async (event) => {
    event.preventDefault();
    toast.loading("Loading...");
    const data = await fetch("/admin/categories/update-category", {
      method: "POST",
      body: JSON.stringify({ categoryId, newCategoryName }),
    });
    const response = await data.json();
    toast.dismiss();
    categoriesMutate();
    setShow(false);
    toast.success(response.message);
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
  });

  return (
    <div
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 p-4 overflow-x-hidden overflow-y-auto bg-black w-full md:h-full md:inset-0 h-[calc(100%-1rem)] z-50 "
      onClick={() => setShow(false)}
    >
      <div className="relative w-1/3 h-full max-w-2xl md:h-auto m-auto " onClick={(e) => e.stopPropagation()}>
        <div className=" flex flex-col items-center relative bg-white rounded-lg shadow dark:bg-gray-700 ">
          <div className="flex flex-col">
            <label className="md:text-lg">Category Name</label>
            <input
              className="border-[1px] border-black rounded-lg md:p-2"
              type="text"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
            />
          </div>
          <pre>{newCategoryName}</pre>
          <div className="flex flex-row gap-8 p-2">
            <button
              className=" p-2 rounded-full border-2 text-lg border-black bg-red-600 text-white hover:shadow-lg hover:-translate-y-2"
              onClick={(event) => updateCategory(event)}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteCategoryConfirmationModal({
  setShow,
  categoryId,
  categoriesMutate,
}: {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  categoryId: number;
  categoriesMutate: KeyedMutator<any>;
}) {
  const deleteCategory = async (event) => {
    event.preventDefault();
    toast.loading("Loading...");

    const data = await fetch(`/admin/categories/delete-category/${categoryId}`, {
      method: "DELETE",
    });
    const response = await data.json();
    toast.dismiss();
    categoriesMutate();
    setShow(false);
    toast.success(response.message);
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
  });

  return (
    <div
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 p-4 overflow-x-hidden overflow-y-auto bg-black w-full md:h-full md:inset-0 h-[calc(100%-1rem)] z-50 "
      onClick={() => setShow(false)}
    >
      <div className="relative w-1/3 h-full max-w-2xl md:h-auto m-auto " onClick={(e) => e.stopPropagation()}>
        <div className=" flex flex-col items-center relative bg-white rounded-lg shadow dark:bg-gray-700 ">
          <h1 className="text-lg p-2">
            Are you sure you wanted to delete this category? All relavant products will have this category removed. This action is
            irreversible and cannot be canceled.
          </h1>
          <div className="flex flex-row gap-8 p-2">
            <button
              className=" p-2 rounded-full border-2 text-lg border-black bg-gray-400 text-white hover:shadow-lg hover:-translate-y-2 "
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
            <button
              className=" p-2 rounded-full border-2 text-lg border-black bg-red-600 text-white hover:shadow-lg hover:-translate-y-2"
              onClick={(event) => deleteCategory(event)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
