import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="hero-section">
      {/* Background Image */}
      <img
        src="/images/hero.jpg"
        alt="Modern furniture living room"
        className="hero-bg"
      />

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content">
        <div className="hero-container">
          <div className="hero-text">
            <p className="hero-eyebrow">Thiết kế hiện đại</p>

            <h1 className="hero-title">
              Sản phẩm mới
              <br />
              thiết kế hiện đại.
            </h1>

            <p className="hero-description">
              Khám phá những món đồ nội thất vượt thời gian được thiết kế để
              mang lại sự thoải mái, đơn giản và cá tính cho ngôi nhà của bạn.
            </p>

            <button type="button" className="hero-button" onClick={() => navigate("/products")}>
              Sản phẩm mới
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
