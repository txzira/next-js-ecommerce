import { Category } from "@prisma/client";
import Loader from "app/Loader";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { KeyedMutator } from "swr";

export function CategoryCreateForm({
  categoriesMutate,
}: {
  categoriesMutate: KeyedMutator<any>;
}) {
  const [categoryName, setCategoryName] = useState("");

  const addCategory = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    toast.loading("Loading...");
    const response = await fetch("/admin/categories/create-category", {
      method: "POST",
      body: JSON.stringify({ categoryName }),
    });
    const message = await response.json();
    toast.dismiss();
    categoriesMutate();
    setCategoryName("");
    response.status === 201 ? toast.success(message) : toast.error(message);
  };

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
            className="rounded-lg border-[1px] pl-1"
            value={categoryName}
            placeholder="Bottoms"
            onChange={(event) => setCategoryName(event.target.value)}
          />
        </div>
        <button
          type="submit"
          className=" mx-auto rounded-xl bg-green-500 px-2 text-white"
          onClick={(event) => addCategory(event)}>
          Add
        </button>
      </div>
    </form>
  );
}
export function CategoryList({
  categoriesData,
  categoriesIsLoading,
  categoriesMutate,
}: {
  categoriesData: Category[] | undefined;
  categoriesIsLoading: boolean;
  categoriesMutate: KeyedMutator<any>;
}) {
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleUpdate = (category: Category | null, active: boolean) => {
    setSelectedCategory(category);
    setShowUpdate(active);
  };

  const handleDelete = (category: Category | null, active: boolean) => {
    setSelectedCategory(category);
    setShowDelete(active);
  };

  return (
    <div className="mb-5 rounded-lg border-2 border-black">
      <div className="grid grid-cols-3 rounded-t-md border-black bg-black p-1 text-lg font-semibold text-white">
        <div className="col-span-2">Category Name</div>
        <div>Actions</div>
      </div>
      {!categoriesIsLoading ? (
        categoriesData && categoriesData.length > 0 ? (
          categoriesData.map((cat: Category) => {
            return (
              <Link
                href={`/admin/categories/${cat.id}`}
                key={cat.id}
                className="grid h-7 grid-cols-3 items-center even:bg-slate-300">
                <div className="col-span-2 pl-1">
                  <p>{cat.name}</p>
                </div>
                <div className="flex items-center justify-evenly">
                  <button title="Edit" onClick={() => handleUpdate(cat, true)}>
                    <MdOutlineEdit style={{ color: "black" }} size={30} />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => handleDelete(cat, true)}>
                    <MdDeleteOutline style={{ color: "red" }} size={30} />
                  </button>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="grid">
            <p className="text-center">No Categories.</p>
          </div>
        )
      ) : (
        <div className="flex justify-center py-5">
          <Loader />
        </div>
      )}
      {showUpdate && selectedCategory ? (
        <UpdateCategoryModal
          category={selectedCategory}
          handleUpdate={handleUpdate}
          categoriesMutate={categoriesMutate}
        />
      ) : null}
      {showDelete && selectedCategory ? (
        <DeleteCategoryConfirmationModal
          category={selectedCategory}
          handleDelete={handleDelete}
          categoriesMutate={categoriesMutate}
        />
      ) : null}
    </div>
  );
}

function UpdateCategoryModal({
  handleUpdate,
  category,
  categoriesMutate,
}: {
  handleUpdate: (cat: Category | null, active: boolean) => void;
  category: Category;
  categoriesMutate: KeyedMutator<any>;
}) {
  const [newCategoryName, setNewCategoryName] = useState(category.name);
  const updateCategory = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    toast.loading("Loading...");
    const response = await fetch("/admin/categories/update-category", {
      method: "POST",
      body: JSON.stringify({ categoryId: category.id, newCategoryName }),
    });
    const message = await response.json();
    toast.dismiss();
    categoriesMutate();
    handleUpdate(null, false);
    response.status === 200 ? toast.success(message) : toast.error(message);
  };

  function closeOnEscKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      handleUpdate(null, false);
    }
  }
  useEffect(() => {
    document.body.addEventListener("keydown", (event) =>
      closeOnEscKeyDown(event)
    );
    return function cleanup() {
      document.body.removeEventListener("keydown", (event) =>
        closeOnEscKeyDown(event)
      );
    };
  });

  return (
    <div
      className="fixed left-0 right-0 top-0 z-10 flex h-full w-full overflow-y-auto bg-black bg-opacity-50 md:inset-0 "
      onClick={() => handleUpdate(null, false)}>
      <div
        className="relative m-auto flex flex-col items-center rounded-lg bg-white md:h-auto "
        onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col">
          <label className="md:text-lg">Category Name</label>
          <input
            className="rounded-lg border-[1px] border-black md:p-2"
            type="text"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
          />
        </div>
        <pre>{newCategoryName}</pre>
        <div className="flex flex-row gap-8 p-2">
          <button
            className=" rounded-full border-2 border-black bg-red-600 p-2 text-lg text-white hover:-translate-y-2 hover:shadow-lg"
            onClick={(event) => updateCategory(event)}>
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
  handleDelete: (cat: Category | null, active: boolean) => void;
  categoriesMutate: KeyedMutator<any>;
}) {
  const deleteCategory = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    toast.loading("Loading...");

    const response = await fetch(
      `/admin/categories/delete-category/${category.id}`,
      {
        method: "DELETE",
      }
    );
    const message = await response.json();
    toast.dismiss();
    categoriesMutate();
    handleDelete(null, false);
    response.status === 200 ? toast.success(message) : toast.error(message);
  };

  function closeOnEscKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      handleDelete(null, false);
    }
  }
  useEffect(() => {
    document.body.addEventListener("keydown", (event) =>
      closeOnEscKeyDown(event)
    );
    return function cleanup() {
      document.body.removeEventListener("keydown", (event) =>
        closeOnEscKeyDown(event)
      );
    };
  });

  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 flex h-full  w-full overflow-y-auto bg-black bg-opacity-50 p-4  md:inset-0 "
      onClick={() => handleDelete(null, false)}>
      <div
        className="relative m-auto flex flex-col items-center rounded-lg bg-white "
        onClick={(e) => e.stopPropagation()}>
        <p className="p-2">
          Are you sure you wanted to delete this category? All relavant products
          will have this category removed. This action is irreversible and
          cannot be canceled.
        </p>
        <div className="flex flex-row gap-8 p-2">
          <button
            className=" rounded-full border-2 border-black bg-gray-400 p-2 text-lg text-white hover:-translate-y-2 hover:shadow-lg "
            onClick={() => handleDelete(null, false)}>
            Cancel
          </button>
          <button
            className=" rounded-full border-2 border-black bg-red-600 p-2 text-lg text-white hover:-translate-y-2 hover:shadow-lg"
            onClick={(event) => deleteCategory(event)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
