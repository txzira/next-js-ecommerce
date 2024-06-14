import { Attribute, AttributeGroup, AttributeImage } from "@prisma/client";
import { FormContainer, FormInput, FormTitle } from "app/(components)/Form";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";
import { FaEllipsisH, FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import useSWR, { KeyedMutator } from "swr";
import React from "react";
import { ModalRightSide } from "app/(components)/Modals";
import Image from "next/image";

type TAttributeGroupObj = {
  id: number;
  attributeGroup: {
    id: number;
    name: string;
  };
  attributes: Map<
    number,
    {
      id: number;
      option: string;
      images: AttributeImage[];
    }
  >;
};
type TAttributeGroupsMap = Map<number, TAttributeGroupObj>;

type TAttributesMap = Map<
  number,
  {
    attributeGroupId: number;
    attributes: number[];
  }
>;
export type TImageToSend = {
  attributeId: number;
  imagePath: any;
  imageName: string;
};

const VariantsModal = ({
  setShowVariantsModal,
}: {
  setShowVariantsModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { id } = useParams();

  const {
    data: attributeGroupsData,
    error: attributeGroupsError,
    isLoading: attributeGroupsIsLoading,
    mutate: attributeGroupsMutate,
  } = useSWR<
    (AttributeGroup & {
      attributes: (Attribute & {
        images: AttributeImage[];
      })[];
    })[]
  >(`/admin/products/api/get-attribute-groups/${id}`, (url) =>
    fetch(url).then((res) => res.json())
  );

  const [attributeGroupDetails, setAttributeGroupDetails] =
    useState<TAttributeGroupObj>(null);
  const [attributeGroupsMap, setAttributeGroupsMap] =
    useState<TAttributeGroupsMap>(new Map());

  const [attributeGroupIndex, setAttributeGroupIndex] = useState(0);

  const [attributesToDelete, setAttributesToDelete] = useState<
    Map<
      number,
      {
        attributeGroupId: number;
        attributes: number[];
      }
    >
  >(new Map());

  useEffect(() => {
    if (!attributeGroupsIsLoading && attributeGroupsData.length) {
      const map: TAttributeGroupsMap = new Map();
      setAttributeGroupIndex(
        attributeGroupsData[attributeGroupsData.length - 1].id
      );
      attributeGroupsData.map((attributeGroup, groupIndex) => {
        map.set(groupIndex, {
          id: attributeGroup.id,
          attributeGroup: { id: attributeGroup.id, name: attributeGroup.name },
          attributes: new Map(
            attributeGroup.attributes.map((attribute, attributeIndex) => [
              attributeIndex,
              {
                id: attribute.id,
                option: attribute.option,
                images: attribute.images,
              },
            ])
          ),
        });
      });
      setAttributeGroupsMap(map);
    } else {
      setAttributeGroupsMap(
        new Map([
          [
            0,
            {
              id: null,
              attributeGroup: { id: null, name: "" },
              attributes: new Map<
                number,
                { id: number; option: string; images: AttributeImage[] }
              >(),
            },
          ],
        ])
      );
      setAttributeGroupIndex(1);
    }
  }, [attributeGroupsIsLoading, attributeGroupsData]);

  console.log(attributeGroupsMap);

  return (
    <ModalRightSide onClick={() => setShowVariantsModal(false)}>
      {attributeGroupDetails ? (
        <AttributeAdvancedDetails
          attributeGroupDetails={attributeGroupDetails}
          setAttributeGroupDetails={setAttributeGroupDetails}
          attributeGroupsMutate={attributeGroupsMutate}
        />
      ) : null}

      <FormTitle className="flex flex-row items-center gap-3">
        <button onClick={() => setShowVariantsModal(false)}>
          <AiOutlineClose size={30} />
        </button>
        <span>Edit Variants</span>
      </FormTitle>

      <div className="mb-3 flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">Group</h2>
        <button
          type="button"
          className="flex flex-row items-center rounded-full bg-green-500 px-3 py-1.5 text-[10px] tracking-widest text-white"
          onClick={() => addAttributeGroupRow()}
        >
          <IoMdAdd size={14} />
          <span>ADD</span>
        </button>
      </div>

      <div className="mx-auto mb-5 rounded-lg border border-[#cbdcf3] bg-white">
        <div className="grid grid-cols-4 rounded-t-md bg-blue-100 px-2">
          <div className="">Name</div>
          <div className="col-span-2">Options</div>
          <div className="mx-auto">Actions</div>
        </div>

        {Array.from(attributeGroupsMap.keys()).map((id) => {
          console.log(attributeGroupsMap.get(id));
          return (
            <AttributeGroupRow
              key={id}
              attributeGroupsMap={attributeGroupsMap}
              setAttributeGroupsMap={setAttributeGroupsMap}
              attributesToDelete={attributesToDelete}
              setAttributesToDelete={setAttributesToDelete}
              setAttributeGroupDetails={setAttributeGroupDetails}
              id={id}
            />
          );
        })}
      </div>
      <div className=" absolute bottom-0 right-0 w-full px-2">
        <div className="flex flex-row justify-end gap-3">
          <button
            className="rounded-md px-3 py-2 font-semibold"
            onClick={() => setShowVariantsModal(false)}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-green-600 px-3 py-2 font-semibold text-white"
            onClick={saveAndGenerateVariants}
          >
            Save and Generate Variants
          </button>
          <button
            className="rounded-md bg-green-600 px-3 py-2 font-semibold text-white"
            onClick={saveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </ModalRightSide>
  );

  function addAttributeGroupRow() {
    setAttributeGroupsMap(
      new Map(
        attributeGroupsMap.set(attributeGroupIndex, {
          id: null,
          attributeGroup: { id: null, name: "" },
          attributes: new Map<
            number,
            { id: number; option: string; images: AttributeImage[] }
          >(),
        })
      )
    );
    setAttributeGroupIndex(attributeGroupIndex + 1);
  }

  async function saveChanges(event) {
    event.preventDefault();
    toast.loading("Loading...");
    const attributeGroups = Array.from(
      attributeGroupsMap,
      ([key, groupValue]) => ({
        productId: Number(id),
        attributeGroup: groupValue.attributeGroup,
        attributes: Array.from(
          groupValue.attributes,
          ([key, attributeValue]) => attributeValue
        ),
      })
    );
    console.log(attributeGroups);
    const response = await fetch("/admin/products/api/upsert-attribute-group", {
      method: "POST",
      body: JSON.stringify({
        attributeGroups,
        attributesToDelete: Array.from(
          attributesToDelete,
          ([key, value]) => value
        ),
      }),
    });
    setAttributesToDelete(new Map());

    const message = await response.json();
    toast.dismiss();

    response.status === 200 ? toast.success(message) : toast.error(message);
  }

  async function saveAndGenerateVariants(event) {
    event.preventDefault();
    toast.loading("Loading...");
    await fetch("/admin/products/api/generate-product-variants", {
      method: "POST",
      body: JSON.stringify({
        id,
      }),
    });
    toast.dismiss();
  }
};

const AttributeGroupRow = ({
  attributeGroupsMap,
  setAttributeGroupsMap,
  attributesToDelete,
  setAttributesToDelete,
  setAttributeGroupDetails,
  id,
}: {
  attributeGroupsMap: TAttributeGroupsMap;
  setAttributeGroupsMap: React.Dispatch<
    React.SetStateAction<TAttributeGroupsMap>
  >;
  attributesToDelete: TAttributesMap;
  setAttributesToDelete: React.Dispatch<React.SetStateAction<TAttributesMap>>;
  setAttributeGroupDetails: React.Dispatch<
    React.SetStateAction<TAttributeGroupObj>
  >;
  id: number;
}) => {
  const [attribute, setAttribute] = useState("");
  const [showAttributeMenu, setShowAttributeMenu] = useState(false);

  return (
    <div className="grid grid-cols-4 items-center p-2 [&:not(:last-child)]:border-b ">
      <div>
        <input
          className="mr-1 w-full"
          type="text"
          placeholder="Name"
          value={attributeGroupsMap.get(id).attributeGroup.name}
          onChange={(event) =>
            setAttributeGroupsMap(
              new Map(
                attributeGroupsMap.set(id, {
                  id: attributeGroupsMap.get(id).id,
                  attributeGroup: {
                    id: attributeGroupsMap.get(id).attributeGroup.id,
                    name: event.target.value,
                  },
                  attributes: attributeGroupsMap.get(id).attributes,
                })
              )
            )
          }
        />
      </div>
      <div className="col-span-2">
        <ul className="flex flex-row flex-wrap">
          {Array.from(attributeGroupsMap.get(id).attributes.keys()).map(
            (key) => {
              return (
                <li
                  className="flex w-max flex-row items-center rounded-lg border"
                  key={key}
                >
                  <span>
                    {attributeGroupsMap.get(id).attributes.get(key).option}
                  </span>
                  <button onClick={() => deleteAttribute(key)}>
                    <AiFillCloseCircle />
                  </button>
                </li>
              );
            }
          )}
        </ul>
        <input
          className="w-full"
          type="text"
          placeholder="Options (example: Red, Green, Blue, etc.)"
          value={attribute}
          onChange={(event) => setAttribute(event.target.value)}
          onKeyDown={pressedEnter}
          onBlur={addAttribute}
        />
      </div>
      <div className="relative mx-auto">
        <button
          className="rounded-md p-1 focus:border-2 focus:border-black "
          onClick={() => setShowAttributeMenu(!showAttributeMenu)}
        >
          <FaEllipsisH />
        </button>
        {showAttributeMenu ? (
          <ActionsMenu
            show={showAttributeMenu}
            setShow={setShowAttributeMenu}
            onClickOutside={() => {
              setShowAttributeMenu(false);
            }}
            rowsAttributeGroupDetails={attributeGroupsMap.get(id)}
            setAttributeGroupDetails={setAttributeGroupDetails}
          />
        ) : null}
      </div>
    </div>
  );

  function addAttribute() {
    if (attribute !== "" || !(attribute.trim().length === 0)) {
      const attributes = attributeGroupsMap.get(id).attributes;
      let attributeIndex = attributes.size;
      while (attributes.has(attributeIndex)) {
        attributeIndex++;
      }
      attributes.set(attributeIndex, {
        id: null,
        option: attribute,
        images: [],
      });
      setAttributeGroupsMap(
        new Map(
          attributeGroupsMap.set(id, {
            id: attributeGroupsMap.get(id).id,
            attributeGroup: attributeGroupsMap.get(id).attributeGroup,
            attributes,
          })
        )
      );
      setAttribute("");
    }
  }

  function deleteAttribute(key) {
    let attributes;
    const attribute = attributeGroupsMap.get(id).attributes.get(key);

    attributes = attributesToDelete.has(attributeGroupsMap.get(id).id)
      ? [
          ...attributesToDelete.get(attributeGroupsMap.get(id).id).attributes,
          attribute.id,
        ]
      : [attribute.id];

    console.log(attribute);
    setAttributesToDelete(
      new Map(
        attributesToDelete.set(attributeGroupsMap.get(id).id, {
          attributeGroupId: attributeGroupsMap.get(id).id,
          attributes,
        })
      )
    );
    if (attributeGroupsMap.get(id).attributes.delete(key))
      setAttributeGroupsMap(new Map(attributeGroupsMap));
  }

  function pressedEnter(event) {
    if (event.key === "Enter") {
      addAttribute();
    }
  }
};

const ActionsMenu = ({
  onClickOutside,
  rowsAttributeGroupDetails,
  setAttributeGroupDetails,
  show,
  setShow,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  if (!show) return null;

  return (
    <ul
      className="absolute right-0 z-50 rounded-lg border bg-white shadow-lg"
      ref={ref}
    >
      <li className="border-b p-2">
        <button
          onClick={() => {
            setAttributeGroupDetails(rowsAttributeGroupDetails);
            setShow(false);
          }}
        >
          Advanced
        </button>
      </li>
      <li className="p-2">
        <button>Delete</button>
      </li>
    </ul>
  );
};

const AttributeAdvancedDetails = ({
  attributeGroupDetails,
  setAttributeGroupDetails,
  attributeGroupsMutate,
}: {
  attributeGroupDetails: TAttributeGroupObj;
  setAttributeGroupDetails: React.Dispatch<
    React.SetStateAction<TAttributeGroupObj>
  >;
  attributeGroupsMutate: KeyedMutator<
    (AttributeGroup & {
      attributes: (Attribute & {
        images: AttributeImage[];
      })[];
    })[]
  >;
}) => {
  const [attributes, setAttributes] = useState<
    [
      number,
      {
        id: number;
        option: string;
        images: AttributeImage[];
        updated: boolean;
      }
    ][]
  >(JSON.parse(JSON.stringify(Array.from(attributeGroupDetails.attributes))));

  const [imagesToAddToDb, setImagesToAddToDb] = useState(
    new Map<number, TImageToSend[]>()
  );
  const [imagesToDeleteFromDb, setImagesToDeleteFromDb] = useState(
    new Map<number, AttributeImage[]>()
  );

  function handleInput(event, index) {
    event.preventDefault();
    attributes[index][1].option = event.target.value;
    attributes[index][1].updated = true;
    setAttributes([...attributes]);
  }
  async function saveChanges(event) {
    event.preventDefault();
    toast.loading("Loading...");
    const request = await fetch(
      "/admin/products/api/edit-attribute-groups-adv",
      {
        method: "POST",
        body: JSON.stringify({
          attributes: Array.from(attributes),
          imagesToAddToDb: Array.from(imagesToAddToDb),
          imagesToDeleteFromDb: Array.from(imagesToDeleteFromDb),
        }),
      }
    );
    toast.dismiss();
    if (request.status === 200) {
      imagesToAddToDb.clear();
      imagesToDeleteFromDb.clear();
      setImagesToAddToDb(imagesToAddToDb);
      setImagesToDeleteFromDb(imagesToDeleteFromDb);
      attributeGroupsMutate();
    }
  }
  console.log(imagesToAddToDb);
  return (
    <ModalRightSide onClick={() => setAttributeGroupDetails(null)}>
      <form className="flex h-full flex-col">
        <h1>Variant Group: {attributeGroupDetails.attributeGroup.name}</h1>
        <div className="h-full overflow-y-scroll">
          {attributes.map((attribute, index) => {
            return (
              <FormContainer key={attribute[1].id * (index + 1)}>
                <FormInput
                  id={(attribute[1].id * (index + 1)).toString()}
                  text="option"
                  value={attribute[1].option}
                  onChange={(event) => handleInput(event, index)}
                />
                <ImagesContainer
                  attributeId={attribute[1].id}
                  dbImages={attribute[1].images}
                  imagesToAddToDb={imagesToAddToDb}
                  setImagesToAddToDb={setImagesToAddToDb}
                  imagesToDeleteFromDb={imagesToDeleteFromDb}
                  setImagesToDeleteFromDb={setImagesToDeleteFromDb}
                />
              </FormContainer>
            );
          })}
        </div>
        <div className="h-min w-full border-t bg-white px-2 ">
          <div className="flex h-min flex-row justify-end gap-3">
            <button
              className="rounded-md px-3 py-2 font-semibold"
              onClick={() => setAttributeGroupDetails(null)}
            >
              Cancel
            </button>

            <button
              className="rounded-md bg-green-600 px-3 py-2 font-semibold text-white"
              onClick={saveChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </ModalRightSide>
  );
};

const ImagesContainer = ({
  attributeId,
  dbImages,
  imagesToAddToDb,
  setImagesToAddToDb,
  imagesToDeleteFromDb,
  setImagesToDeleteFromDb,
}: {
  attributeId: number;
  dbImages: AttributeImage[];
  imagesToAddToDb: Map<number, TImageToSend[]>;
  setImagesToAddToDb: React.Dispatch<
    React.SetStateAction<Map<number, TImageToSend[]>>
  >;
  imagesToDeleteFromDb: Map<number, AttributeImage[]>;
  setImagesToDeleteFromDb: React.Dispatch<
    React.SetStateAction<Map<number, AttributeImage[]>>
  >;
}) => {
  const [imagesInDb, setImagesInDb] = useState<AttributeImage[]>(
    JSON.parse(JSON.stringify(dbImages))
  );
  const [imagesToDelete, setImagesToDelete] = useState<AttributeImage[]>([]);

  function handleAddImages(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    console.log(attributeId);
    const files = event.target.files;
    const tempImagesToAddArr: TImageToSend[] = [];
    Array.from(files).map((file, i) => {
      setFileToBase(file, tempImagesToAddArr);
    });
    function setFileToBase(file, imageArr: TImageToSend[]) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (event) => {
        imageArr.push({
          attributeId: attributeId,
          imageName: file.name,
          imagePath: event.target.result,
        });
        imagesToAddToDb.set(attributeId, imageArr);
        setImagesToAddToDb(new Map(imagesToAddToDb));
      };
    }
  }

  function handleDeleteFromDb(event, index) {
    event.preventDefault();
    const image = imagesInDb.splice(index, 1)[0];
    imagesToDelete.push(image);
    imagesToDeleteFromDb.set(image.attributeId, imagesToDelete);
    setImagesToDeleteFromDb(new Map(imagesToDeleteFromDb));
    setImagesToDelete([...imagesToDelete]);
    setImagesInDb([...imagesInDb]);
  }

  function removeFromAddImages(event, index) {
    event.preventDefault();
    imagesToAddToDb.get(attributeId).splice(index, 1);
    setImagesToAddToDb(new Map(imagesToAddToDb));
  }

  return (
    <div className="flex w-full flex-col  justify-center rounded-md border p-2 last:mb-6">
      <pre>{attributeId}</pre>
      <div className="flex flex-row">
        {imagesInDb.length
          ? imagesInDb.map((image, index) => {
              return (
                <div key={image.id} className="relative rounded-md border p-2 ">
                  <div className="md:peer  mx-auto h-[100px] w-[100px] md:h-[200px] md:w-[200px]">
                    <Image src={image.url} alt="image" fill={true} />
                  </div>
                  <button
                    type="button"
                    className=" absolute right-0 top-0 pr-2 pt-2 md:invisible md:hover:visible md:peer-hover:visible"
                    onClick={(event) => handleDeleteFromDb(event, index)}
                  >
                    <FaTrash color="white" />
                  </button>
                </div>
              );
            })
          : null}
        {imagesToAddToDb.has(attributeId) &&
        imagesToAddToDb.get(attributeId).length
          ? imagesToAddToDb.get(attributeId).map((image, index) => {
              return (
                <div
                  key={image.imageName}
                  className="relative rounded-md border p-2"
                >
                  <div className="md:peer  mx-auto h-[100px] w-[100px] md:h-[200px] md:w-[200px]">
                    <Image
                      id={
                        image.attributeId
                          ? image.attributeId.toString()
                          : index.toString()
                      }
                      src={image.imagePath}
                      fill={true}
                      alt="attribute image"
                    />
                  </div>
                  <button
                    type="button"
                    className=" absolute right-0 top-0 pr-2 pt-2 md:invisible md:hover:visible md:peer-hover:visible"
                    onClick={(event) => removeFromAddImages(event, index)}
                  >
                    <FaTrash color="white" />
                  </button>
                </div>
              );
            })
          : null}
      </div>
      <div className="mx-auto my-3 ">
        <input
          id={`add-images-button-${attributeId}`}
          type="file"
          multiple={true}
          hidden
          onChange={(event) => handleAddImages(event)}
        />
        <label
          htmlFor={`add-images-button-${attributeId}`}
          className="cursor-pointer rounded-md bg-green-500 p-2"
        >
          Upload Images
        </label>
      </div>
    </div>
  );
};
export { VariantsModal };
