import Link from "next/link";
import Image from "next/image";

export default function HeroBanners({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <section className={`grid gap-4 md:grid-cols-2 h-full ${fullWidth ? "min-h-[420px] md:min-h-[480px]" : ""}`}>
      <div className="relative overflow-hidden rounded-lg h-full min-h-[280px]">
      <Image
          src="/images/laptop-sale.jpg"
          alt="Laptop Sale"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col justify-center p-8">
          <h2 className="text-4xl font-extrabold text-accent-yellow md:text-5xl">
            Upto 55% Off
          </h2>
          <Link
            href="/shop?category=tv-av"
            className="mt-6 inline-block w-fit rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-navy transition-all duration-200 hover:bg-navy hover:text-white"
          >
            Shop Now
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-accent-teal h-full min-h-[280px]">
      <Image
          src="/images/mobile-sale.jpg"
          alt="Mobile Sale"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 flex h-full flex-col justify-center p-8">
          <p className="text-sm font-semibold tracking-widest text-white/80 uppercase">
            Super Sale
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-white md:text-4xl leading-tight">
            Top Notch
            <br />
            Save Up To 85%
          </h2>
          <Link
            href="/shop?category=laptop"
            className="mt-6 inline-block w-fit rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-navy transition-all duration-200 hover:bg-navy hover:text-white"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
