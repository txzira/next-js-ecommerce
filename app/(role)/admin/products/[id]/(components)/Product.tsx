import {
  Attribute,
  AttributeGroup,
  Category,
  Product,
  ProductImage,
} from "@prisma/client";
import {
  FormContainer,
  FormHeading,
  FormInput,
  FormInputCurrency,
  FormTextArea,
} from "app/(components)/Form";
import Loader from "app/Loader";
import Image from "next/image";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const ImageContainer = ({
  product,
  setProduct,
  defaultImage,
  setDefaultImage,
}: {
  product: Product & {
    categories?: Category[];
    image?: ProductImage;
  };
  setProduct: React.Dispatch<
    React.SetStateAction<
      Product & {
        image?: ProductImage;
        categories?: Category[];
      }
    >
  >;
  defaultImage: { imageName: string; imagePath: any; oldImagePubId: string };
  setDefaultImage: React.Dispatch<
    React.SetStateAction<{
      imageName: string;
      imagePath: any;
      oldImagePubId: string;
    }>
  >;
}) => {
  function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const files = event.target.files;
    if (files)
      Array.from(files).map((file, i) => {
        setFileToBase(file);
      });
    function setFileToBase(file: File) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (event) => {
        setDefaultImage({
          imageName: file.name,
          imagePath: event.target?.result,
          ...(product.image
            ? { oldImagePubId: product.image.publicId }
            : { oldImagePubId: "" }),
        });
      };
    }
  }
  return (
    <div className="mb-4 flex  flex-col rounded-lg border-2 border-[#cbdcf3] p-2 text-gray-900 shadow-md">
      <h2 className="text-xs">Default Image</h2>
      <div className="relative h-32 w-32 ">
        {defaultImage.imagePath ? (
          <Image src={defaultImage.imagePath} alt="default image" fill={true} />
        ) : product?.image ? (
          <Image src={product.image.url} alt="default image" fill={true} />
        ) : (
          <Image
            src="/images/icon-no-image.png"
            alt="default image"
            fill={true}
          />
        )}
      </div>
      <div className="mx-auto my-3 ">
        <input
          id="add-image-button"
          type="file"
          multiple={true}
          hidden
          onChange={(event) => handleImage(event)}
        />
        <label
          htmlFor="add-image-button"
          className="cursor-pointer rounded-md bg-green-500 p-2">
          Upload Image
        </label>
      </div>
    </div>
  );
};

const DetailsContainer = ({
  product,
  setProduct,
  defaultImage,
  setDefaultImage,
}: {
  product: Product & {
    categories?: Category[];
    image?: ProductImage;
  };
  setProduct: React.Dispatch<
    React.SetStateAction<
      Product & {
        image?: ProductImage;
        categories?: Category[];
      }
    >
  >;
  defaultImage: { imageName: string; imagePath: any; oldImagePubId: string };
  setDefaultImage: React.Dispatch<
    React.SetStateAction<{
      imageName: string;
      imagePath: any;
      oldImagePubId: string;
    }>
  >;
}) => {
  return (
    <FormContainer>
      <FormHeading text="DETAILS" />
      <div className="flex h-full flex-row gap-2">
        <ImageContainer
          product={product}
          setProduct={setProduct}
          defaultImage={defaultImage}
          setDefaultImage={setDefaultImage}
        />

        <div className="flex w-full flex-col gap-2">
          <FormInput
            required
            id="name"
            name="name"
            text="Name (required)"
            placeholder="Name"
            value={product.name}
            onChange={(event) =>
              setProduct({ ...product, name: event.target.value })
            }
          />
          <FormInput
            id="SKU"
            name="SKU"
            text="SKU"
            placeholder="SKU"
            value={product?.sku || ""}
            onChange={(event) =>
              setProduct({ ...product, sku: event.target.value })
            }
          />
          <FormInput
            id="Inventory"
            name="Inventory"
            text="Inventory Available"
            placeholder="Inventory Available"
            number={true}
            value={product?.quantity || 0}
            onChange={(event) =>
              setProduct({ ...product, quantity: Number(event.target.value) })
            }
          />
        </div>
      </div>

      <FormTextArea
        id="Inventory"
        name="Inventory"
        text="Description"
        rows={8}
        placeholder="Inventory Available"
        value={product?.description || ""}
        onChange={(event) =>
          setProduct({ ...product, description: event.target.value })
        }
      />
    </FormContainer>
  );
};

const PriceContainer = ({
  product,
  setProduct,
}: {
  product: Product & {
    categories?: Category[];
    image?: ProductImage;
  };
  setProduct: React.Dispatch<
    React.SetStateAction<
      Product & {
        categories?: Category[];
        image?: ProductImage;
      }
    >
  >;
}) => {
  return (
    <FormContainer>
      <FormHeading text="PRICE" />
      <FormInputCurrency
        id="price"
        name="price"
        text="Price (required)"
        placeholder="Price"
        value={product.price}
        onChange={(event) =>
          setProduct({ ...product, price: Number(event.target.value) })
        }
      />
    </FormContainer>
  );
};

const CategoriesContainer = ({
  categoriesData,
  showCategories,
  setShowCategories,
  selectedCategories,
  setSelectedCategories,
}: {
  categoriesData: Category[];
  showCategories: boolean;
  setShowCategories: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategories: Map<number, Category>;
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<Map<number, Category>>
  >;
}) => {
  return (
    <FormContainer>
      <FormHeading text="CATEGORIES" />
      <CategoriesDropdown
        categoriesData={categoriesData}
        showCategories={showCategories}
        setShowCategories={setShowCategories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
    </FormContainer>
  );
};

const CategoriesDropdown = ({
  categoriesData,
  showCategories,
  setShowCategories,
  selectedCategories,
  setSelectedCategories,
}: {
  categoriesData: Category[];
  showCategories: boolean;
  selectedCategories: Map<number, Category>;
  setShowCategories: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<Map<number, Category>>
  >;
}) => {
  const handleCheckedCategory = (
    event: React.ChangeEvent<HTMLInputElement>,
    category: Category
  ) => {
    if (event.target.checked) {
      setSelectedCategories(
        new Map(selectedCategories.set(Number(event.target.value), category))
      );
    } else {
      if (selectedCategories.delete(Number(event.target.value)))
        setSelectedCategories(new Map(selectedCategories));
    }
  };

  const checkCategory = (map: Map<number, Category>, categoryId: number) => {
    return map.has(categoryId) ? true : false;
  };

  return (
    <div className="relative">
      <div
        className="flex h-14 w-full items-center justify-between rounded-lg border-2 border-[#cbdcf3] p-3  text-gray-900  shadow-md focus:border focus:border-black focus:shadow-[0_0_0_4px_#cbdcf3] focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          setShowCategories(!showCategories);
        }}>
        {selectedCategories.size ? (
          <span>
            {selectedCategories.size === 1
              ? selectedCategories.entries().next().value[1].name
              : selectedCategories.size === 2
              ? `${selectedCategories.entries().next().value[1].name} and ${
                  selectedCategories.entries().next().value[1].name
                }`
              : `${selectedCategories.entries().next().value[1].name}, ${
                  selectedCategories.entries().next().value[1].name
                }, ${selectedCategories.size - 2} more`}
          </span>
        ) : (
          <span>Choose a category</span>
        )}
        {showCategories ? (
          <span>
            <MdKeyboardArrowUp size={20} />
          </span>
        ) : (
          <span>
            <MdKeyboardArrowDown size={20} />
          </span>
        )}
      </div>
      {showCategories ? (
        <ul className="absolute left-0  max-h-60 w-full overflow-y-scroll  rounded-lg border-2 border-[#cbdcf3] bg-white  shadow-md ">
          {categoriesData.map((categoryData) => {
            return (
              <li
                className="my-auto flex h-14 w-full flex-row items-center gap-3 border-b border-[#cbdcf3] px-3 hover:bg-[#cbdcf3]"
                key={categoryData.id}>
                <input
                  id={categoryData.id.toString()}
                  type="checkbox"
                  name="categories"
                  checked={checkCategory(selectedCategories, categoryData.id)}
                  value={categoryData.id}
                  onChange={(event) =>
                    handleCheckedCategory(event, categoryData)
                  }
                />
                <label htmlFor={categoryData.id.toString()}>
                  {categoryData.name}
                </label>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};
const VariantsContainer = ({
  attributeGroupsData,
  attributeGroupsIsLoading,
  setShowVariantsModal,
}: {
  attributeGroupsData: (AttributeGroup & {
    attributes: Attribute[];
  })[];
  attributeGroupsIsLoading: boolean;
  setShowVariantsModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <FormContainer>
      <div className="flex flex-row items-center justify-between">
        <FormHeading text="VARIANTS" />
        <button
          type="button"
          className="flex flex-row items-center rounded-full bg-green-500 px-3 py-1.5 text-[10px] tracking-widest text-white"
          onClick={() => setShowVariantsModal(true)}>
          <IoMdAdd size={14} />
          <span>
            {!attributeGroupsIsLoading && attributeGroupsData.length
              ? "EDIT"
              : "ADD"}
          </span>
        </button>
      </div>
      <div className="mx-auto my-2 rounded-lg border border-[#cbdcf3] bg-white ">
        <div className="brounded-t-lg grid grid-cols-3 bg-[#cbdcf3] p-2">
          <div>Group</div>
          <div className="col-span-2">Options</div>
        </div>
        {!attributeGroupsIsLoading ? (
          attributeGroupsData.length ? (
            attributeGroupsData.map((attributeGroup) => {
              return (
                <div
                  className="grid grid-cols-3 items-center  p-2 [&:not(:last-child)]:border-b"
                  key={attributeGroup.id}>
                  <div>{attributeGroup.name}</div>
                  <div className="col-span-2 flex gap-2 ">
                    {attributeGroup.attributes.length
                      ? attributeGroup.attributes.map((attribute) => {
                          return (
                            <div
                              key={attribute.id}
                              className="rounded-full  bg-blue-200 px-3 py-1 text-sm text-white  ">
                              {attribute.name}
                            </div>
                          );
                        })
                      : null}
                  </div>
                </div>
              );
            })
          ) : null
        ) : (
          <div>
            <Loader />
          </div>
        )}
      </div>
    </FormContainer>
  );
};
export {
  DetailsContainer,
  PriceContainer,
  CategoriesContainer,
  VariantsContainer,
};
