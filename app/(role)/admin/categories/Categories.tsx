import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { KeyedMutator } from "swr";

export function CategoryCreateForm({ categoriesData, categoriesMutate }: { categoriesData: any; categoriesMutate: KeyedMutator<any> }) {
  const [categoryName, setCategoryName] = useState("");
  console.log(categoriesData);
  async function AddCategory(event) {
    event.preventDefault();
    toast.loading("Loading...");
    const response = await fetch("/admin/categories/create-category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryName }),
    });
    const data = await response.json();
    const res2 = await fetch("/admin/categories/get-categories");
    const dat2 = await res2.json();
    console.log(dat2);
    categoriesMutate();
    setCategoryName("");
    toast.dismiss();
    data.status === 200 ? toast.success(data.message) : toast.error(data.message);
  }

  return (
    <form>
      <h2 className="pb-1 text-2xl font-semibold">Create Category</h2>
      <div className="flex flex-row items-end">
        <div className="flex flex-col">
          <label htmlFor="name" className="pl-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="pl-1 border-[1px] rounded-lg"
            value={categoryName}
            placeholder="Bottoms"
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>
        <button type="submit" className=" mx-auto px-2 bg-green-500 text-white rounded-xl" onClick={AddCategory}>
          Add
        </button>
      </div>
    </form>
  );
}
export function CategoryList({ categoriesData, categoriesMutate }: { categoriesData: any; categoriesMutate: KeyedMutator<any> }) {
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [category, setCategory] = useState<Category>(null);

  const handleUpdate = (cat: Category, active: boolean) => {
    setCategory(cat);
    setShowUpdate(active);
  };
  const handleDelete = (cat: Category, active: boolean) => {
    setCategory(cat);
    setShowDelete(active);
  };

  return (
    <div className="border-black border-2 rounded-lg mb-5">
      <div className="grid grid-cols-3 rounded-t-md border-black bg-black text-white p-1 text-lg font-semibold">
        <div className="col-span-2">Category Name</div>
        <div>Actions</div>
      </div>
      {categoriesData && categoriesData.categories.length > 0 ? (
        categoriesData.categories.map((cat: Category) => {
          return (
            <div key={cat.id} className="grid grid-cols-3 h-7 items-center even:bg-slate-300">
              <div className="pl-1 col-span-2">{cat.name}</div>
              <div className="flex justify-evenly items-center">
                <button title="Edit" onClick={() => handleUpdate(cat, true)}>
                  <MdOutlineEdit style={{ color: "black" }} size={30} />
                </button>
                <button title="Delete" onClick={() => handleDelete(cat, true)}>
                  <MdDeleteOutline style={{ color: "red" }} size={30} />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center">No Categories.</div>
      )}
      {showUpdate && category ? (
        <UpdateCategoryModal category={category} handleUpdate={handleUpdate} categoriesMutate={categoriesMutate} />
      ) : null}
      {showDelete && category ? (
        <DeleteCategoryConfirmationModal category={category} handleDelete={handleDelete} categoriesMutate={categoriesMutate} />
      ) : null}
    </div>
  );
}

function UpdateCategoryModal({
  handleUpdate,
  category,
  categoriesMutate,
}: {
  handleUpdate: (cat: Category, active: boolean) => void;
  category: Category;

  categoriesMutate: KeyedMutator<any>;
}) {
  const [newCategoryName, setNewCategoryName] = useState(category.name);
  const updateCategory = async (event) => {
    event.preventDefault();
    toast.loading("Loading...");
    const data = await fetch("/admin/categories/update-category", {
      method: "POST",
      body: JSON.stringify({ categoryId: category.id, newCategoryName }),
    });
    const response = await data.json();
    toast.dismiss();
    categoriesMutate();
    handleUpdate(null, false);
    toast.success(response.message);
  };

  function closeOnEscKeyDown(event) {
    if ((event.charCode || event.keyCode) === 27) {
      handleUpdate(null, false);
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
      className="flex fixed w-full h-full bg-opacity-50 top-0 left-0 right-0 overflow-y-auto bg-black md:inset-0 z-50 "
      onClick={() => handleUpdate(null, false)}
    >
      <div className="flex flex-col items-center relative md:h-auto m-auto bg-white rounded-lg " onClick={(e) => e.stopPropagation()}>
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
  );
}

function DeleteCategoryConfirmationModal({
  category,
  handleDelete,
  categoriesMutate,
}: {
  category: Category;
  handleDelete: (cat: Category, active: boolean) => void;
  categoriesMutate: KeyedMutator<any>;
}) {
  const deleteCategory = async (event) => {
    event.preventDefault();
    toast.loading("Loading...");

    const data = await fetch(`/admin/categories/delete-category/${category.id}`, {
      method: "DELETE",
    });
    const response = await data.json();
    toast.dismiss();
    categoriesMutate();
    handleDelete(null, false);
    toast.success(response.message);
  };

  function closeOnEscKeyDown(event) {
    if ((event.charCode || event.keyCode) === 27) {
      handleDelete(null, false);
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
      className="flex fixed bg-opacity-50 top-0 left-0 right-0 p-4  overflow-y-auto bg-black w-full h-full md:inset-0  z-50 "
      onClick={() => handleDelete(null, false)}
    >
      <div className="relative flex flex-col m-auto items-center bg-white rounded-lg " onClick={(e) => e.stopPropagation()}>
        <p className="p-2">
          Are you sure you wanted to delete this category? All relavant products will have this category removed. This action is
          irreversible and cannot be canceled.
        </p>
        <div className="flex flex-row gap-8 p-2">
          <button
            className=" p-2 rounded-full border-2 text-lg border-black bg-gray-400 text-white hover:shadow-lg hover:-translate-y-2 "
            onClick={() => handleDelete(null, false)}
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
  );
}
