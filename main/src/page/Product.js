import { Button, Descriptions, Divider, InputNumber, message } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import ButtonGroup from "antd/es/button/button-group";

function Product(props) {
  const { branch, theme } = props;
  const product_pk = window.location.pathname.split("/").pop();
  const [productData, setProductData] = useState(null); // 상품 데이터입니다.
  const [materialData, setMaterialData] = useState(null); // 물자 데이터입니다.
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    message.success(`장바구니에 ${quantity}개가 추가되었습니다.`);
  };

  const handleBuyNow = () => {
    message.success(`바로 구매: ${quantity}개`);
  };

  // 화면 크기에 따라 레이아웃을 가로정렬, 세로정렬로 변경
  const isLarge = useMediaQuery({ minWidth: 780 });

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/products/${product_pk}`
      );
      const data = await response.json();
      setProductData(data);

      const material = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/products/materials/${data.material_id}`
      );
      const materialData = await material.json();
      setMaterialData(materialData);
    };

    fetchProducts();
  }, [product_pk]);

  return (
    <div style={{ marginBottom: isLarge ? "0px" : "54px" }}>
      <div style={{ padding: "20px", margin: "0 auto" }}>
        {productData && (
          <div
            style={{
              display: "flex",
              flexDirection: isLarge ? "row" : "column", // 화면 크기에 따라 flexDirection 변경
              alignItems: "center",
              padding: "20px",
              border: "1px solid #f0f0f0",
              borderRadius: "10px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              flexWrap: "wrap", // 화면이 작을 때 wrap을 허용
            }}
          >
            {/* 상품 이미지 */}
            <div
              style={{
                width: isLarge ? "300px" : "100%", // 화면 크기에 따라 크기 조절
                height: isLarge ? "300px" : "auto", // 화면 크기에 따라 크기 조절
                aspectRatio: "1/1",
                maxWidth: "300px", // 이미지의 최대 크기를 설정하여 찌그러짐 방지
                backgroundImage: `url(${materialData?.original_image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "10px",
                marginBottom: isLarge ? "0" : "20px", // 세로정렬일 때만 간격 추가
              }}
            />

            <div style={{ flex: 1, marginLeft: isLarge ? "20px" : "0" }}>
              {/* 상품 상세 설명 */}
              <Descriptions
                title={productData.product_name}
                column={1}
                labelStyle={{
                  width: "40px", // 라벨 영역 너비를 설정
                  fontWeight: "bold", // 라벨 텍스트를 볼드 처리
                  textAlign: "left", // 라벨 텍스트 왼쪽 정렬
                }}
              >
                <Descriptions.Item label="가격">
                  {parseInt(productData.product_price).toLocaleString()}원
                </Descriptions.Item>

                {/* 상품 수량 */}
                <Descriptions.Item label="수량">
                  <InputNumber
                    size={isLarge ? "large" : "medium"}
                    value={quantity}
                    min={1}
                    onChange={setQuantity}
                    style={{
                      textAlign: "center",
                      fontSize: "18px",
                      borderRadius: "5px",
                      borderColor: "#ccc",
                    }}
                    addonBefore={
                      <Button
                        type="link"
                        icon={<MinusOutlined />}
                        onClick={handleDecrement}
                        style={{
                          color: "#ff4d4f",
                        }}
                      />
                    }
                    addonAfter={
                      <Button
                        type="link"
                        icon={<PlusOutlined />}
                        onClick={handleIncrement}
                        style={{
                          color: "#1da57a",
                        }}
                      />
                    }
                  />
                </Descriptions.Item>
              </Descriptions>

              <Divider style={{ display: isLarge ? "flex" : "none" }} />
              {/* 버튼들 */}
              <div
                style={{
                  display: isLarge ? "flex" : "none",
                  gap: "10px",
                  marginBottom: "20px",
                  flexWrap: isLarge ? "nowrap" : "wrap",
                }}
              >
                <Button
                  size="large"
                  onClick={handleAddToCart}
                  style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    borderColor: "#ccc",
                    color: "#333",
                    borderRadius: "5px",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  장바구니에 추가
                </Button>
                <Button
                  size="large"
                  danger
                  type="primary"
                  onClick={handleBuyNow}
                  style={{
                    width: "100%",
                    backgroundColor: "#ff4d4f",
                    borderColor: "#ff4d4f",
                    color: "#fff",
                    borderRadius: "5px",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
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

      <div
        style={{
          position: "fixed",
          bottom: "0",
          right: "0",
          left: "0",
          display: isLarge ? "none" : "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px 10px",
          backgroundColor: theme === "dark" ? "#1e1e1e" : "white",
          color: theme === "dark" ? "white" : "black",
          zIndex: 9999,
          boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
          gap: "10px",
        }}
      >
        <Button
          size="large"
          onClick={handleAddToCart}
          style={{
            width: "100%",
          }}
        >
          장바구니에 추가
        </Button>
        <Button
          size="large"
          type="primary"
          danger
          onClick={handleBuyNow}
          style={{
            width: "100%",
          }}
        >
          바로 구매하기
        </Button>
      </div>
    </div>
  );
}

export default Product;
