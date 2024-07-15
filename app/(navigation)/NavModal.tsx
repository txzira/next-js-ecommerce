import React, { useEffect, useState } from "react";
import NavLink from "./NavLink";

const NavModal = ({
  children,
  setShow,
}: {
  children: React.ReactNode;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const onClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setShow(false);
    }, 300);
  };
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div
      className="group fixed left-0 right-0 top-0 z-50 flex h-full w-full overflow-y-scroll bg-black bg-opacity-50 md:inset-0 md:h-full "
      onClick={() => onClose()}>
      <div
        className={`relative ${
          isOpen ? "left-0" : "-left-full"
        }  flex h-full w-1/3 flex-col bg-black  shadow-[4px_-4px_4px_0_rgb(0,0,0,0.10)] transition-all  duration-300 md:h-auto `}
        onClick={(e) => e.stopPropagation()}>
        <ul className="flex h-max flex-col  bg-black text-sm font-semibold text-white md:text-lg ">
          <li>
            <NavLink href="/products">Products</NavLink>
          </li>
          {children}
          <div className="w-full border border-white" />
        </ul>
      </div>
    </div>
  );
};

export default NavModal;
