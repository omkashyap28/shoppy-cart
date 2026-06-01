import Link from "next/link"
import Image from "next/image"

export function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center gap-1 font-sans text-xl font-medium tracking-tighter">
        <Image
          src="/logo.png"
          alt=""
          className="size-6"
          height={24}
          width={24}
          fetchPriority="high"
          loading="eager"
        />
        Shoppy Cart
      </div>
    </Link>
  )
}
