import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative h-[420px] w-full overflow-hidden sm:h-[480px] md:h-[500px] lg:h-[560px]">
      {/* Background Image */}
      <img
        src="/images/hero.jpg"
        alt="Modern furniture living room"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="max-w-xl text-white">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] sm:mb-4 sm:text-sm">
              Thiết kế hiện đại
            </p>

            <h1 className="text-3xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              Sản phẩm mới
              <br />
              thiết kế hiện đại.
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 sm:mt-6 sm:text-lg">
              Khám phá những món đồ nội thất vượt thời gian được thiết kế để
              mang lại sự thoải mái, đơn giản và cá tính cho ngôi nhà của bạn.
            </p>

            <button
              type="button"
              className="mt-6 bg-white px-7 py-3.5 text-sm font-medium text-black transition-all duration-300 hover:bg-black hover:text-white hover:cursor-pointer sm:mt-8"
              onClick={() => navigate("/products")}
            >
              Sản phẩm mới
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
