import React, { useState, useEffect } from "react";
import { Space, Typography, Image, Skeleton } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, ...props }) {
  const { theme } = props;
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // 0.5초 지연 후 로딩 상태 변경
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // 0.5초

    return () => clearTimeout(timeout); // 컴포넌트가 언마운트될 때 타이머 정리
  }, []);

  return (
    <div
      style={{
        border: "none", // border 제거
        backgroundColor: "transparent",
        boxShadow: "none", // 그림자 제거
        display: "flex",
        flexDirection: "column", // 이미지와 텍스트를 세로로 배치
        justifyContent: "flex-start", // 세로 정렬
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/product/${product.PK}`)}
    >
      {/* 이미지 */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1/1",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme === "dark" ? "#333" : "#f1f1f1",
        }}
      >
        {/* Skeleton loader is shown if the image is loading or an error has occurred */}
        {loading || imageError ? (
          <Skeleton.Image
            style={{
              width: "80%",
              height: "80%",
              backgroundColor: "transparent",
            }}
          />
        ) : null}

        {/* Actual image */}
        <Image
          src={product.original_image}
          alt={product.name}
          preview={false}
          style={{
            width: "100%",
            height: "100%",
            aspectRatio: "1/1",
            objectFit: "cover",
            display: loading || imageError ? "none" : "block", // Hide image until loaded
          }}
          onLoad={() => setLoading(false)} // Image loaded successfully
          onError={() => {
            setImageError(true);
            setLoading(false); // Error occurred, stop loading
          }}
        />

        {/* Error fallback if image fails to load */}
        {imageError && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#f5f5f5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#888" }}>이미지 없음</span>
          </div>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div style={{ padding: "10px" }}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {product.product_name}
        </Typography.Title>
        <Typography.Text strong style={{ fontSize: "16px" }}>
          {parseInt(product.product_price).toLocaleString("ko-KR")}원
        </Typography.Text>
        <br />
        <Space
          style={{
            display: product.remaining < 3 ? "flex" : "none",
          }}
        >
          <InboxOutlined style={{ color: "#ff7875" }} />
          <Typography.Text
            type="secondary"
            style={{
              fontSize: "14px",
              color: "#ff7875",
            }}
          >
            {product.remaining}개 남았어요
          </Typography.Text>
        </Space>
      </div>
    </div>
  );
}

export default ProductCard;
