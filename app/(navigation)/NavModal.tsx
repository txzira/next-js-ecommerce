import React, { useEffect, useState } from "react";
import NavLink from "./NavLink";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";

const NavModal = ({
  children,
  setShow,
}: {
  children: React.ReactNode;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: session, status } = useSession();

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
        }  flex h-full w-1/3 flex-col  bg-black  shadow-[4px_-4px_4px_0_rgb(0,0,0,0.10)] transition-all  duration-300 md:h-auto `}
        onClick={(e) => e.stopPropagation()}>
        <ul className="flex h-full flex-col  bg-black text-sm font-semibold text-white md:text-lg ">
          <li>
            <ul>
              <li>
                <NavLink href="/products">Products</NavLink>
              </li>
              {children}
            </ul>
          </li>
          <li className="my-3">
            <div className="w-full border border-white" />
          </li>
          <li>
            <Link
              href="https://www.instagram.com/pseudocorp/"
              className="flex h-14 flex-row items-center gap-2 px-2">
              <FaInstagram size={20} />
              <span>PseudoCorp</span>
            </Link>
          </li>
          {status === "unauthenticated" ? (
            <li>
              <NavLink href="/auth/login">Login</NavLink>
            </li>
          ) : (
            <li>
              <NavLink href="/account">Account</NavLink>
              <button
                className="flex h-full items-center px-2 hover:bg-white hover:text-black md:px-4"
                onClick={() => signOut()}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavModal;
