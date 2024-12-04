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
  Checkbox,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { cartStyles } from "../styles"; // Import the styles

const { Text } = Typography;

const Cart = ({ token }) => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCart = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/carts/token/${token}`
        );
        const data = await response.json();

        console.log(data);

        if (response.status === 200) {
          const cartData = await Promise.all(
            data.map(async (item) => {
              const productData = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/products/${item.product_pk}`
              );
              const product = await productData.json();
              return { ...item, ...product };
            })
          );

          setCartData(cartData);
          setSelectedItems(cartData.map((item) => item.pk));
          setSelectAll(true);
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
      setSelectedItems(cartData.map((item) => item.pk));
    } else {
      setSelectedItems([]);
    }
  }, [selectAll, cartData]);

  const handleDelete = (pk) => {
    setCartData(cartData.filter((item) => item.pk !== pk));
    setSelectedItems(selectedItems.filter((item) => item !== pk));

    fetch(`${process.env.REACT_APP_SERVER_URL}/carts/${pk}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  };

  const handleQuantityChange = async (value, pk) => {
    if (!value) return;
    setCartData((prevCartData) =>
      prevCartData.map((item) =>
        item.pk === pk ? { ...item, count: value } : item
      )
    );

    await fetch(`${process.env.REACT_APP_SERVER_URL}/carts/${pk}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ count: value }),
    });
  };

  const handleCheckboxChange = (e, pk) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, pk]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== pk));
    }
  };

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
    <div style={cartStyles.container}>
      <div style={cartStyles.cartContainer}>
        <Row gutter={[16, 16]}>
          {cartData.map((item) => (
            <Col span={24} key={item.pk}>
              <Card style={cartStyles.card}>
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(item.pk)}
                  style={cartStyles.deleteButton}
                />
                <Checkbox
                  onChange={(e) => handleCheckboxChange(e, item.pk)}
                  checked={selectedItems.includes(item.pk)}
                  style={cartStyles.checkbox}
                >
                  <Text>{item.product_name}</Text>
                </Checkbox>
                <div style={cartStyles.cardContent}>
                  <Image
                    preview={false}
                    alt={item.product_name}
                    src={
                      item.blurred_image || "https://via.placeholder.com/120"
                    }
                    style={cartStyles.image}
                  />
                  <div style={cartStyles.productInfo}>
                    <Space
                      direction="vertical"
                      size={8}
                      style={cartStyles.productSpace}
                    >
                      <Space>
                        <Text>수량:</Text>
                        <InputNumber
                          min={1}
                          value={item.count}
                          onChange={(value) =>
                            handleQuantityChange(value, item.pk)
                          }
                          style={cartStyles.inputNumber}
                        />
                      </Space>
                      <Text strong style={cartStyles.productPrice}>
                        {(
                          (item.amount +
                            (item.option
                              ? item.option.reduce(
                                  (total, option) => total + option.optionPrice,
                                  0
                                )
                              : 0)) *
                          item.count
                        ).toLocaleString()}{" "}
                        원
                      </Text>
                    </Space>
                  </div>
                </div>
                {item.option && item.option.length > 0 && (
                  <div style={{ opacity: 0.5, marginTop: "10px" }}>
                    옵션 :{" "}
                    {item.option.map((option, index) => (
                      <span key={index}>
                        {option.optionName}
                        {`(+${option.optionPrice}원)`}
                        {index !== item.option.length - 1 && " / "}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
        <div style={cartStyles.totalAmountContainer}>
          <Text strong style={cartStyles.totalAmount}>
            전체 금액 : {totalAmount.toLocaleString()} 원
          </Text>
        </div>
      </div>

      <div style={cartStyles.relatedProducts}>
        <Text style={cartStyles.relatedProductsText}>연관상품</Text>
      </div>

      <div style={cartStyles.footer}>
        <div style={cartStyles.footerContent}>
          <Checkbox
            checked={selectAll}
            onChange={() => setSelectAll(!selectAll)}
            style={cartStyles.selectAllCheckbox}
          >
            전체 선택
          </Checkbox>
          <div style={cartStyles.totalAmountContainer}>
            <Text strong style={cartStyles.totalAmount}>
              {totalAmount.toLocaleString()} 원
            </Text>
          </div>
        </div>

        <Button size="large" type="primary" danger style={cartStyles.buyButton}>
          총 {selectedItems.length}개 상품 구매하기
        </Button>
      </div>
    </div>
  );
};

export default Cart;
