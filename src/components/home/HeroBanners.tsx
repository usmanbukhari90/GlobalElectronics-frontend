import Link from "next/link";
import Image from "next/image";
import { HeroBanner } from "@/types";

export default function HeroBanners({
  banners,
  fullWidth = false,
}: {
  banners: HeroBanner[];
  fullWidth?: boolean;
}) {
  const banner1 = banners.find((b) => b.slot === 1);
  const banner2 = banners.find((b) => b.slot === 2);

  return (
    <section className={`grid gap-4 md:grid-cols-2 h-full ${fullWidth ? "min-h-[420px] md:min-h-[480px]" : ""}`}>
      {banner1 && (
        <div className="relative overflow-hidden rounded-lg h-full min-h-[280px]">
          <Image
            src={banner1.imageUrl}
            alt={banner1.heading}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col justify-center p-8">
            <h2 className="text-4xl font-extrabold text-accent-yellow md:text-5xl">
              {banner1.heading}
            </h2>
            <Link
              href={banner1.linkHref}
              className="mt-6 inline-block w-fit rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-navy transition-all duration-200 hover:bg-navy hover:text-white"
            >
              {banner1.buttonText}
            </Link>
          </div>
        </div>
      )}

      {banner2 && (
        <div className="relative overflow-hidden rounded-lg bg-accent-teal h-full min-h-[280px]">
          <Image
            src={banner2.imageUrl}
            alt={banner2.heading}
            fill
            className="object-cover opacity-40"
          />
          <div className="relative z-10 flex h-full flex-col justify-center p-8">
            {banner2.subheading && (
              <p className="text-sm font-semibold tracking-widest text-white/80 uppercase">
                {banner2.subheading}
              </p>
            )}
            <h2 className="mt-2 text-3xl font-extrabold text-white md:text-4xl leading-tight">
              {banner2.heading}
            </h2>
            <Link
              href={banner2.linkHref}
              className="mt-6 inline-block w-fit rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-navy transition-all duration-200 hover:bg-navy hover:text-white"
            >
              {banner2.buttonText}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}