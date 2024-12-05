import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Descriptions,
  Divider,
  InputNumber,
  message,
  Radio,
  Typography,
} from "antd";
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
  const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 옵션 저장
  const [showOptions, setShowOptions] = useState(false);
  const isLarge = useMediaQuery({ minWidth: 780 });

  const handleDecrement = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrement = () => setQuantity(quantity + 1);

  const handleOptionChange = (checkedValues) => {
    setSelectedOptions(
      checkedValues.map((id) =>
        productData.options.find((option) => option.id === id)
      )
    );
  };

  const handleAddToCart = async () => {
    if (productData?.options?.length && !showOptions) {
      // 옵션 선택이 필요한 경우 옵션 UI 표시
      setShowOptions(true);
      return;
    }

    // 옵션 선택 완료 후 장바구니에 추가
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
            amount: parseInt(productData.product_price),
            option: selectedOptions,
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

  const handleBuyNow = () => {
    if (productData?.options?.length && !selectedOptions) {
      message.error("옵션을 선택해주세요.");
      setShowOptions(true);
      return;
    }

    message.success(`바로 구매: ${quantity}개`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/products/${product_pk}`
        );
        const product = await productResponse.json();
        setProductData(product);

        console.log(product);

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

      {/* 하단 고정 버튼 및 옵션 선택 */}
      <div style={fixedBottomStyle(theme)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
          }}
        >
          {showOptions && productData?.options?.length > 0 && (
            <div
              style={{
                marginBottom: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography.Text
                style={{
                  fontWeight: "bold",
                  fontSize: "large",
                  marginBottom: "10px",
                }}
              >
                옵션 선택
              </Typography.Text>
              <Checkbox.Group
                style={{ width: "100%" }}
                onChange={handleOptionChange}
              >
                {productData.options.map((option) => (
                  <Checkbox key={option.id} value={option.id}>
                    {option.optionName} (+
                    {parseInt(option.optionPrice).toLocaleString()}원)
                  </Checkbox>
                ))}
              </Checkbox.Group>
              <Divider />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography.Text
                  style={{
                    fontWeight: "bold",
                    fontSize: "large",
                    marginBottom: "10px",
                  }}
                >
                  예상 결제금액
                </Typography.Text>
                <Typography.Text
                  style={{
                    fontWeight: "bold",
                    fontSize: "large",
                    marginBottom: "10px",
                  }}
                >
                  {(
                    parseInt(quantity) * parseInt(productData.product_price) +
                    selectedOptions.reduce(
                      (total, option) => total + option.optionPrice,
                      0
                    )
                  ).toLocaleString()}
                  원
                </Typography.Text>
              </div>
            </div>
          )}

          {/* 버튼 그룹 */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              width: "100%",
            }}
          >
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
      </div>
    </div>
  );
}

export default Product;
