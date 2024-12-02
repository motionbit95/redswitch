import React, { useEffect, useState } from "react";
import { Button, Descriptions, Divider, InputNumber, message } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import {
  containerStyle,
  cardStyle,
  imageStyle,
  descriptionStyle,
  buttonGroupStyle,
  addToCartButtonStyle,
  buyButtonStyle,
  fixedBottomStyle,
} from "../styles";

function Product({ branch, theme }) {
  const product_pk = window.location.pathname.split("/").pop();
  const [productData, setProductData] = useState(null);
  const [materialData, setMaterialData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const isLarge = useMediaQuery({ minWidth: 780 });

  const handleDecrement = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrement = () => setQuantity(quantity + 1);

  const handleAddToCart = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/carts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            product_pk,
            count: quantity,
            branch_pk: branch,
            amount: quantity * parseInt(productData.product_price),
          }),
        }
      );

      const data = await response.json();
      if (response.status === 201) {
        message.success("장바구니에 상품을 담았습니다.");
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error("장바구니 추가 오류", error);
      message.error("장바구니에 상품을 추가하는데 실패했습니다.");
    }
  };

  const handleBuyNow = () => message.success(`바로 구매: ${quantity}개`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/products/${product_pk}`
        );
        const product = await productResponse.json();
        setProductData(product);

        const materialResponse = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/products/materials/${product.material_id}`
        );
        const material = await materialResponse.json();
        setMaterialData(material);
      } catch (error) {
        console.error("상품 데이터 불러오기 실패", error);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [product_pk]);

  return (
    <div style={containerStyle(isLarge)}>
      <div style={{ padding: "20px", margin: "0 auto" }}>
        {productData && (
          <div style={cardStyle(isLarge)}>
            <div style={imageStyle(isLarge, materialData)} />
            <div style={descriptionStyle}>
              <Descriptions
                title={productData.product_name}
                column={1}
                labelStyle={{ fontWeight: "bold", textAlign: "left" }}
              >
                <Descriptions.Item label="가격">
                  {parseInt(productData.product_price).toLocaleString()}원
                </Descriptions.Item>
                <Descriptions.Item label="수량">
                  <InputNumber
                    value={quantity}
                    min={1}
                    onChange={setQuantity}
                    addonBefore={
                      <Button
                        type="link"
                        icon={<MinusOutlined />}
                        onClick={handleDecrement}
                        style={{ color: "#ff4d4f" }}
                      />
                    }
                    addonAfter={
                      <Button
                        type="link"
                        icon={<PlusOutlined />}
                        onClick={handleIncrement}
                        style={{ color: "#1da57a" }}
                      />
                    }
                  />
                </Descriptions.Item>
              </Descriptions>
              <Divider style={{ display: isLarge ? "flex" : "none" }} />
              <div style={buttonGroupStyle(isLarge)}>
                <Button
                  size="large"
                  onClick={handleAddToCart}
                  style={addToCartButtonStyle}
                >
                  장바구니에 추가
                </Button>
                <Button
                  size="large"
                  type="primary"
                  danger
                  onClick={handleBuyNow}
                  style={buyButtonStyle}
                >
                  바로 구매하기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 상품 상세 정보 */}
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
          dangerouslySetInnerHTML={{ __html: productData?.product_detail }}
        ></div>
      </div>

      <style jsx>{`
        div img {
          max-width: 100%;
          height: auto;
          display: block;
        }
      `}</style>

      <div style={fixedBottomStyle(theme)}>
        <Button
          size="large"
          onClick={handleAddToCart}
          style={{ width: "100%" }}
        >
          장바구니에 추가
        </Button>
        <Button
          size="large"
          type="primary"
          danger
          onClick={handleBuyNow}
          style={{ width: "100%" }}
        >
          바로 구매하기
        </Button>
      </div>
    </div>
  );
}

export default Product;
