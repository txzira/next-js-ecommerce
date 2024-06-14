"use client";
import { Category } from "@prisma/client";
import {
  FormContainer,
  FormHeading,
  FormInput,
  FormTextArea,
  FormTitle,
} from "app/(components)/Form";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import useSWR, { KeyedMutator } from "swr";

type CategoryPC = Category & {
  parent: Category;
  children: Category[];
};

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function EditCategoryPage() {
  const { id } = useParams();
  const [nameChangesSlug, setNameChangesSlug] = useState(true);
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [showParentCategory, setShowParentCategory] = useState(false);

  const [category, setCategory] = useState<CategoryPC>(null);

  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesIsLoading,
    mutate: categoriesMutate,
  } = useSWR<Category[]>("/admin/categories/api/get-categories", fetcher);
  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryIsLoading,
    mutate: categoryMutate,
  } = useSWR<CategoryPC>(`/admin/categories/api/get-category/${id}`, fetcher);

  useEffect(() => {
    if (!categoryIsLoading) setCategory(categoryData);
  }, [categoryData, categoryIsLoading]);

  const handleCategoryName = (event) => {
    event.preventDefault();
    if (nameChangesSlug) {
      const slug = event.target.value.replace(" ", "-");
      setCategory({ ...category, name: event.target.value, slug });
    } else {
      setCategory({ ...category, name: event.target.value });
    }
  };

  const handleCategorySlug = (event) => {
    event.preventDefault();
    const slug = event.target.value.replace(" ", "-");
    setNameChangesSlug(false);
    setCategory({ ...category, slug });
  };

  const editCategory = async (event) => {
    event.preventDefault();
    toast.loading("Loading...");
    const response = await fetch("/admin/categories/api/update-category", {
      method: "POST",
      body: JSON.stringify({ category }),
    });
    const message = await response.json();
    toast.dismiss();
    categoriesMutate();

    response.status === 200 ? toast.success(message) : toast.error(message);
  };

  return category ? (
    <div
      className="mx-auto h-full w-[90%]"
      onClick={() => setShowParentCategory(false)}
    >
      {showSubCategory ? (
        <SubCategoryModal
          categoryData={categoryData}
          setShowSubCategory={setShowSubCategory}
          categoryMutate={categoryMutate}
        />
      ) : null}
      <form>
        <FormTitle className="flex flex-row items-center gap-3">
          <Link href="/admin/categories">
            <BsArrowLeft />
          </Link>
          Edit Category
        </FormTitle>
        <FormContainer>
          <FormHeading text="DETAILS" />
          <div className="flex flex-row gap-2">
            <FormInput
              id="name"
              name="name"
              placeholder="Name"
              value={category.name}
              onChange={handleCategoryName}
              text="Name"
            />
            <FormInput
              id="slug"
              name="slug"
              value={category.slug}
              placeholder="permalink"
              onChange={handleCategorySlug}
              text="Permalink"
            />
          </div>
          <FormTextArea
            id="Inventory"
            name="Inventory"
            rows={8}
            placeholder="Inventory Available"
            value={category.description}
            onChange={(event) =>
              setCategory({ ...category, description: event.target.value })
            }
            text="Description"
          />
        </FormContainer>
        <FormContainer>
          <FormHeading text="PARENT" />
          <ParentCategoryDropdown
            category={category}
            setCategory={setCategory}
            categoriesData={categoriesData}
            showParentCategory={showParentCategory}
            setShowParentCategory={setShowParentCategory}
          />
        </FormContainer>
        <FormContainer>
          <div className="flex flex-row items-center justify-between">
            <FormHeading text="SUB-CATEGORY" />
            <button
              type="button"
              className="flex flex-row items-center rounded-full bg-green-500 px-3 py-1.5 text-[10px] tracking-widest text-white"
              onClick={() => setShowSubCategory(true)}
            >
              <IoMdAdd size={14} />
              <span>ADD</span>
            </button>
          </div>
          <ul>
            {category.children.length ? (
              category.children.map((subCategory) => {
                return (
                  <li key={subCategory.id}>
                    <Link href={`/admin/categories/${subCategory.id}`}>
                      {subCategory.name}
                    </Link>
                  </li>
                );
              })
            ) : (
              <li>No Sub-Categories.</li>
            )}
          </ul>
        </FormContainer>
        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 py-3 text-white"
          onClick={(event) => editCategory(event)}
        >
          Save
        </button>
      </form>
    </div>
  ) : null;
}

const ParentCategoryDropdown = ({
  category,
  setCategory,
  categoriesData,
  showParentCategory,
  setShowParentCategory,
}: {
  category: CategoryPC;
  setCategory: React.Dispatch<React.SetStateAction<CategoryPC>>;
  categoriesData: Category[];
  showParentCategory: boolean;
  setShowParentCategory: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="relative">
      <div
        className="flex h-14 w-full items-center justify-between rounded-lg border-2 border-[#cbdcf3] p-3  text-gray-900  shadow-md focus:border focus:border-black focus:shadow-[0_0_0_4px_#cbdcf3] focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          setShowParentCategory(!showParentCategory);
        }}
      >
        {category.parentId ? (
          <span>{category.parent.name}</span>
        ) : (
          <span>Choose parent category</span>
        )}
        {showParentCategory ? (
          <span>
            <MdKeyboardArrowUp size={20} />
          </span>
        ) : (
          <span>
            <MdKeyboardArrowDown size={20} />
          </span>
        )}
      </div>
      {showParentCategory ? (
        <ul className="absolute left-0  max-h-60 w-full overflow-y-scroll  rounded-lg border-2 border-[#cbdcf3] bg-white  shadow-md ">
          <li
            className="my-auto flex h-14 w-full items-center border-b border-[#cbdcf3] px-3 hover:bg-[#cbdcf3]"
            onClick={() =>
              setCategory({
                ...category,
                parent: {
                  id: null,
                  name: "",
                  description: null,
                  slug: null,
                  parentId: null,
                },
              })
            }
          ></li>
          {categoriesData.map((categoryData) => {
            if (categoryData.id === category.id) return;
            return (
              <li
                key={categoryData.id}
                className="my-auto flex h-14 w-full items-center border-b border-[#cbdcf3] px-3 hover:bg-[#cbdcf3]"
                onClick={() =>
                  setCategory({
                    ...category,
                    parent: {
                      id: Number(categoryData.id),
                      name: categoryData.name,
                      description: null,
                      slug: null,
                      parentId: null,
                    },
                  })
                }
              >
                {categoryData.name}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

const SubCategoryModal = ({
  categoryData,
  setShowSubCategory,
  categoryMutate,
}: {
  categoryData: Category & {
    children: Category[];
    parent: Category;
  };
  setShowSubCategory: React.Dispatch<React.SetStateAction<boolean>>;
  categoryMutate: KeyedMutator<
    Category & {
      children: Category[];
      parent: Category;
    }
  >;
}) => {
  const [category, setCategory] = useState({
    name: "",
    slug: "",
    description: "",
    parent: { id: categoryData.id, name: categoryData.name },
  });
  const [nameChangesSlug, setNameChangesSlug] = useState(true);

  const handleCategoryName = (event) => {
    event.preventDefault();
    if (nameChangesSlug) {
      const slug = event.target.value.replace(" ", "-");
      setCategory({ ...category, name: event.target.value, slug });
    } else {
      setCategory({ ...category, name: event.target.value });
    }
  };
  const handleCategorySlug = (event) => {
    event.preventDefault();
    const slug = event.target.value.replace(" ", "-");
    setNameChangesSlug(false);
    setCategory({ ...category, slug });
  };
  const addSubCategory = async (event) => {
    event.preventDefault();
    toast.loading("Loading...");
    const response = await fetch("/admin/categories/create-category", {
      method: "POST",
      body: JSON.stringify({ category }),
    });
    const message = await response.json();
    toast.dismiss();
    categoryMutate();
    setCategory({
      name: "",
      slug: "",
      description: "",
      parent: { id: categoryData.id, name: categoryData.name },
    });
    response.status === 201 ? toast.success(message) : toast.error(message);
  };
  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 flex h-full w-full overflow-y-scroll bg-black bg-opacity-50 md:inset-0 "
      onClick={() => setShowSubCategory(false)}
    >
      <div
        className="relative ml-auto w-4/5 rounded-l-lg bg-white p-2 md:h-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={() => setShowSubCategory(false)}>
          <AiOutlineClose size={30} />
        </button>
        <form>
          <FormTitle>Add Sub-Category</FormTitle>
          <FormContainer>
            <FormHeading text="DETAILS" />
            <div className="flex flex-row gap-2">
              <FormInput
                id="name"
                name="name"
                text="Name"
                placeholder="Name"
                value={category.name}
                onChange={handleCategoryName}
              />
              <FormInput
                id="slug"
                name="slug"
                text="Permalink"
                value={category.slug}
                placeholder="permalink"
                onChange={handleCategorySlug}
              />
            </div>
            <FormTextArea
              id="Inventory"
              name="Inventory"
              rows={8}
              text="Description"
              placeholder="Inventory Available"
              value={category.description}
              onChange={(event) =>
                setCategory({ ...category, description: event.target.value })
              }
            />
          </FormContainer>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-3 text-white"
            onClick={(event) => addSubCategory(event)}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};
