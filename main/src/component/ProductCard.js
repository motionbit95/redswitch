import React, { useState, useEffect, useCallback } from "react";
import { Space, Typography, Image, Skeleton, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { productCardStyles } from "../styles"; // Import the styles

const ProductCard = React.memo(({ product, theme, isCertified }) => {
  const [imageState, setImageState] = useState({ loading: true, error: false });
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setImageState((prevState) => ({ ...prevState, loading: false }));
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageState((prevState) => ({ ...prevState, loading: false }));
  }, []);

  const handleImageError = useCallback(() => {
    setImageState({ loading: false, error: true });
  }, []);

  const handleCardClick = useCallback(() => {
    if (isCertified) {
      navigate(`/product/${product.PK}`);
    } else {
      message.warning("성인인증을 진행해주세요!");
    }
  }, [navigate, isCertified, product.PK]);

  const productImage = isCertified
    ? product.original_image
    : product.blurred_image
    ? product.blurred_image
    : product.original_image;

  return (
    <div style={productCardStyles.cardContainer} onClick={handleCardClick}>
      {/* Image */}
      <div style={productCardStyles.imageContainer}>
        {imageState.loading || imageState.error ? (
          <Skeleton.Image style={productCardStyles.skeletonImage} />
        ) : null}

        <Image
          src={productImage || "https://via.placeholder.com/150"}
          alt={product.name}
          preview={false}
          style={{
            ...productCardStyles.image,
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />

        {imageState.error && (
          <div style={productCardStyles.imageErrorContainer}>
            <span style={productCardStyles.imageErrorText}>이미지 없음</span>
          </div>
        )}
      </div>

      {/* Text Section */}
      <div style={productCardStyles.textSection}>
        <Typography.Title level={5} style={productCardStyles.productName}>
          {product.product_name}
        </Typography.Title>
        <Typography.Text strong style={productCardStyles.productPrice}>
          {parseInt(product.product_price).toLocaleString("ko-KR")}원
        </Typography.Text>
        <br />
        <Space style={{ display: product.remaining < 3 ? "flex" : "none" }}>
          <InboxOutlined style={productCardStyles.inboxIcon} />
          <Typography.Text style={productCardStyles.remainingText}>
            {product.remaining}개 남았어요
          </Typography.Text>
        </Space>
      </div>
    </div>
  );
});

export default ProductCard;
