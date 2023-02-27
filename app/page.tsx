import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <Image className={styles.logo} src="/images/insertimagehere.png" alt="Your logo here" width={180} height={37} priority />
      </div>
      <div className="grid grid-rows-1 grid-cols-2">
        <Link className="w-20 h-10 bg-blue-900 text-white" href="/auth/signup">
          Signup
        </Link>

        <Link className="bg-red-500" href="/auth/login">
          Log In
        </Link>
      </div>
    </main>
  );
}
