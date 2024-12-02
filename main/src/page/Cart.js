import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  Image,
  InputNumber,
  Divider,
  Checkbox,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Cart = ({ token }) => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 아이템 목록
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 상태

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCart = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/carts/token/${token}`
        );
        const data = await response.json();

        if (response.status === 200) {
          const cartData = await Promise.all(
            data.map(async (item) => {
              const productData = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/products/${item.product_pk}`
              );
              const product = await productData.json();

              console.log(product);

              return {
                ...item,
                ...product,
              };
            })
          );

          console.log(cartData);

          setCartData(cartData);
          setSelectedItems(cartData.map((item) => item.pk)); // 전체선택 시 모든 아이템을 선택
          setSelectAll(true); // 전체 선택 상태를 true로 설정
        } else {
          throw new Error(
            data.message || "카트 데이터를 가져오는 중 오류가 발생했습니다."
          );
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  useEffect(() => {
    if (selectAll) {
      setSelectedItems(cartData.map((item) => item.pk)); // 전체 선택 시 모든 아이템 선택
    } else {
      setSelectedItems([]); // 전체 선택 해제 시 모든 아이템 해제
    }
  }, [selectAll, cartData]);

  const handleDelete = (pk) => {
    setCartData(cartData.filter((item) => item.pk !== pk));
    setSelectedItems(selectedItems.filter((item) => item !== pk)); // 삭제된 아이템이 선택되어 있으면 선택 해제

    // 서버에 데이터 삭제
    fetch(`${process.env.REACT_APP_SERVER_URL}/carts/${pk}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  const handleQuantityChange = async (value, pk) => {
    if (!value) return;
    setCartData((prevCartData) =>
      prevCartData.map((item) =>
        item.pk === pk ? { ...item, count: value } : item
      )
    );

    console.log(value, pk);

    // 서버에 데이터 저장
    let response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/carts/${pk}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count: value }),
      }
    );

    console.log(response);
  };

  const handleCheckboxChange = (e, pk) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, pk]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== pk));
    }
  };

  // 총 금액 계산 (선택된 항목만)
  const totalAmount = cartData.reduce((total, item) => {
    if (selectedItems.includes(item.pk)) {
      return total + item.amount * item.count;
    }
    return total;
  }, 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "#f1f1f1",
        gap: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ backgroundColor: "white", padding: "20px" }}>
        <div>
          <Row gutter={[16, 16]}>
            {cartData.map((item) => (
              <Col span={24} key={item.pk}>
                <Card
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    borderRadius: "8px",
                    position: "relative",
                    // boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* 삭제 버튼 */}
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(item.pk)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      zIndex: 10,
                    }}
                  />

                  {/* 체크박스 */}
                  <Checkbox
                    onChange={(e) => handleCheckboxChange(e, item.pk)}
                    checked={selectedItems.includes(item.pk)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px", // 왼쪽 상단 고정
                      fontSize: "16px",
                    }}
                  >
                    {/* 상품 이름 */}
                    <Text>{item.product_name}</Text>
                  </Checkbox>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      marginTop: "20px", // 여백 조정
                    }}
                  >
                    {/* 이미지 */}
                    <Image
                      preview={false}
                      alt={item.product_name}
                      src={
                        item.blurred_image || "https://via.placeholder.com/120"
                      }
                      style={{
                        width: "100px", // 이미지 크기 조정
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginRight: "16px",
                      }}
                    />

                    {/* 상품 정보 */}
                    <div style={{ flex: 1 }}>
                      <Space
                        direction="vertical"
                        size={8}
                        style={{ width: "100%" }}
                      >
                        <Text
                          strong
                          style={{
                            fontSize: "16px",
                            color: "#ff4d4f", // 가격 강조 색상
                          }}
                        >
                          {(item.amount * item.count).toLocaleString()} 원
                        </Text>

                        <Space>
                          <Text>수량:</Text>
                          <InputNumber
                            min={1}
                            value={item.count}
                            onChange={(value) =>
                              handleQuantityChange(value, item.pk)
                            }
                            style={{
                              width: "80px",
                              borderRadius: "4px",
                              fontSize: "16px",
                            }}
                          />
                        </Space>
                      </Space>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* 선택된 상품들의 전체 금액 */}
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <Text strong style={{ fontSize: "16px" }}>
              전체 금액 : {totalAmount.toLocaleString()} 원
            </Text>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "white", padding: "20px" }}>
        <Text style={{ fontSize: "16px", fontWeight: "bold" }}>연관상품</Text>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "0",
          right: "0",
          left: "0",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          zIndex: 9999,
          boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          {/* 전체 선택 체크박스 */}
          <Checkbox
            checked={selectAll}
            onChange={() => setSelectAll(!selectAll)}
            style={{
              fontSize: "16px",
            }}
          >
            전체 선택
          </Checkbox>
          {/* 선택된 상품들의 전체 금액 */}
          <div style={{ textAlign: "right" }}>
            <Text strong style={{ fontSize: "16px" }}>
              {totalAmount.toLocaleString()} 원
            </Text>
          </div>
        </div>

        <Button
          size="large"
          type="primary"
          danger
          //   onClick={handleBuyNow}
          style={{
            width: "100%",
          }}
        >
          총 {selectedItems.length}개 상품 구매하기
        </Button>
      </div>
    </div>
  );
};

export default Cart;
