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
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BsArrowLeft } from "react-icons/bs";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import useSWR from "swr";

type CategoryState = {
  name: string;
  slug: string;
  description: string;
  parent: {
    id: any;
    name: string;
  };
};

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AddCategoryPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState({
    name: "",
    slug: "",
    description: "",
    parent: { id: null, name: "" },
  });
  const [nameChangesSlug, setNameChangesSlug] = useState(true);

  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesIsLoading,
    mutate: categoriesMutate,
  } = useSWR<Category[]>("/admin/categories/api/get-categories", (url) =>
    fetch(url).then((res) => res.json())
  );

  const handleCategoryName = (event) => {
    event.preventDefault();
    if (nameChangesSlug) {
      const slug = event.target.value.replace(" ", "-").toLowerCase();
      setCategory({ ...category, name: event.target.value, slug });
    } else {
      setCategory({ ...category, name: event.target.value });
    }
  };

  const handleCategorySlug = (event) => {
    event.preventDefault();
    const slug = event.target.value.replace(" ", "-").toLowerCase();
    setNameChangesSlug(false);
    setCategory({ ...category, slug });
  };

  const addCategory = async (event) => {
    event.preventDefault();
    toast.loading("Loading...");
    const response = await fetch("/admin/categories/api/create-category", {
      method: "POST",
      body: JSON.stringify({ category }),
    });

    const data = await response.json();
    toast.dismiss();
    categoriesMutate();
    setCategory({
      name: "",
      slug: "",
      description: "",
      parent: { id: null, name: "" },
    });
    response.status === 201
      ? toast.success(data.message)
      : toast.error(data.message);
    router.push(`/admin/categories/${data.id}`);
  };

  return (
    <div className="mx-auto h-full w-[90%]" onClick={() => setShow(false)}>
      <form onSubmit={addCategory}>
        <FormTitle className="flex flex-row items-center gap-3">
          <Link href="/admin/categories">
            <BsArrowLeft />
          </Link>
          Add Category
        </FormTitle>
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
            show={show}
            setShow={setShow}
          />
        </FormContainer>
        <button className="w-full rounded-lg bg-green-600 py-3 text-white">
          Save
        </button>
      </form>
    </div>
  );
}

const ParentCategoryDropdown = ({
  category,
  setCategory,
  categoriesData,
  show,
  setShow,
}: {
  category: CategoryState;
  setCategory: React.Dispatch<React.SetStateAction<CategoryState>>;
  categoriesData: Category[];
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="relative">
      <div
        className="flex h-14 w-full items-center justify-between rounded-lg border-2 border-[#cbdcf3] p-3  text-gray-900  shadow-md focus:border focus:border-black focus:shadow-[0_0_0_4px_#cbdcf3] focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          setShow(!show);
        }}
      >
        {category.parent.id ? (
          <span>{category.parent.name}</span>
        ) : (
          <span>Choose parent category</span>
        )}
        {show ? (
          <span>
            <MdKeyboardArrowUp size={20} />
          </span>
        ) : (
          <span>
            <MdKeyboardArrowDown size={20} />
          </span>
        )}
      </div>
      {show ? (
        <ul className="absolute left-0  max-h-60 w-full overflow-y-scroll  rounded-lg border-2 border-[#cbdcf3] bg-white  shadow-md ">
          <li
            className="my-auto flex h-14 w-full items-center border-b border-[#cbdcf3] px-3 hover:bg-[#cbdcf3]"
            onClick={() =>
              setCategory({
                ...category,
                parent: {
                  id: null,
                  name: "",
                },
              })
            }
          ></li>
          {categoriesData.map((categoryData) => {
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
