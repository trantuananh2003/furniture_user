import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "~/assets/hero.jpg";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative h-[500px] w-full overflow-hidden">
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
        <div className="mx-auto w-full max-w-7xl px-8">
          <div className="max-w-xl text-white">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em]">
              Thiết kế hiện đại
            </p>

            <h1 className="text-5xl font-semibold leading-tight md:text-6xl">
              Sản phẩm mới
              <br />
              thiết kế hiện đại.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/85">
              Khám phá những món đồ nội thất vượt thời gian được thiết kế để
              mang lại sự thoải mái, đơn giản và cá tính cho ngôi nhà của bạn.
            </p>

            <button
              type="button"
              className="mt-8 bg-white px-7 py-3.5 text-sm font-medium
                         text-black transition-all duration-300
                         hover:bg-black hover:text-white hover:cursor-pointer"
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
