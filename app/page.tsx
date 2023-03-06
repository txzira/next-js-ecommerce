import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center relative py-16">
        <Image className={styles.logo} src="/images/insertimagehere.png" alt="Your logo here" width={180} height={37} priority />
      </div>
      <div className="grid grid-rows-1 grid-cols-2 justify-items-center gap-10 m-auto">
        <Link
          className="flex items-center justify-center text-xl w-32 h-16 rounded-[30px] bg-blue-900 text-white active:bg-black"
          href="/auth/login"
        >
          Log In
        </Link>

        <Link
          className="flex items-center justify-center text-xl w-32 h-16 rounded-[30px] bg-red-500 text-white active:bg-black"
          href="/auth/signup"
        >
          Signup
        </Link>
      </div>
    </div>
  );
}
