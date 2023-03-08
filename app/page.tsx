import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function Home() {
  console.log(authOptions);
  const session = await getServerSession(authOptions);
  console.log(session);
  // if (session) {
  //   redirect("/user/products");
  // } else {
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
// }
