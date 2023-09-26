import Image from "next/image";
import Logo from "@/public/logo-white.svg";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full bg-zinc-800">
      <Image 
        src={Logo}
        alt="Loading..."
        width={100}
        height={100}
        className="animate-spin"
      />
    </div>
  );
}
