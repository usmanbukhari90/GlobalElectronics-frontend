"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const list = images.length > 0 ? images : ["/images/placeholder.jpg"];

  function prev() {
    setIndex((i) => (i === 0 ? list.length - 1 : i - 1));
  }
  function next() {
    setIndex((i) => (i === list.length - 1 ? 0 : i + 1));
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
      <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * (100 / list.length)}%)`, width: `${list.length * 100}%` }}
        >
          {list.map((img, i) => (
            <div key={i} className="relative h-full shrink-0" style={{ width: `${100 / list.length}%` }}>
              <Image
                src={img}
                alt={name}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        {list.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy shadow-md transition-all duration-200 hover:bg-navy hover:text-white hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy shadow-md transition-all duration-200 hover:bg-navy hover:text-white hover:scale-110"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <button
          onClick={() => setFullscreen(true)}
          aria-label="View fullscreen"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy shadow-md transition-all duration-200 hover:bg-navy hover:text-white hover:scale-110"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {list.length > 1 && (
        <div className="mt-3 flex gap-2">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors duration-200 ${
                i === index ? "border-navy" : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image src={img} alt={`${name} thumbnail ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setFullscreen(false)}
        >
          <button
            onClick={() => setFullscreen(false)}
            aria-label="Close fullscreen"
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy shadow-md transition-all duration-200 hover:bg-navy hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative h-[85vh] w-full max-w-4xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${index * (100 / list.length)}%)`, width: `${list.length * 100}%` }}
            >
              {list.map((img, i) => (
                <div key={i} className="relative h-full shrink-0" style={{ width: `${100 / list.length}%` }}>
                  <Image src={img} alt={name} fill className="object-contain" sizes="100vw" />
                </div>
              ))}
            </div>

            {list.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy shadow-md transition-all duration-200 hover:bg-navy hover:text-white hover:scale-110"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy shadow-md transition-all duration-200 hover:bg-navy hover:text-white hover:scale-110"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}