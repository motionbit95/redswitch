import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Empty,
  Image,
  Space,
  Tag,
  Divider,
  Row,
  Col,
  Button,
} from "antd";
import { useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [branch, setBranch] = useState({}); // 지점 데이터

  // 주문 목록 가져오기
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/orders`
      );
      const data = await response.json();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  // 재료 목록 가져오기
  useEffect(() => {
    const fetchMaterials = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/products/materials`
      );
      const data = await response.json();
      setMaterials(data);
    };

    const fetchBranch = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/branches`
      );
      const data = await response.json();
      setBranch(data);
    };

    fetchMaterials();
    fetchBranch();
  }, []);

  // 주문 세부 정보 가져오기
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || orders.length === 0) return;

      // 주문을 찾고 그 주문의 ID 가져오기
      const matchedOrder = orders.find((order) => order.order_code === orderId);
      console.log(matchedOrder);
      if (!matchedOrder) {
        setLoading(false); // 주문이 없으면 로딩 종료
        return;
      }

      // 주문 세부 정보 가져오기
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/orders/${matchedOrder.id}`
      );
      const data = await response.json();
      setOrderDetails(data); // 세부 정보 저장
      setLoading(false); // 로딩 종료
    };

    fetchOrderDetails();
  }, [orders, orderId]); // `orders`나 `orderId`가 변경될 때마다 실행

  // 로딩 중이면 로딩 화면을 표시
  if (loading) {
    return <div>Loading...</div>; // 로딩 페이지
  }

  const goHome = () => {
    window.location.href = `/spot/${orderDetails.branch_pk}`;
  };

  // 주문 세부 정보를 렌더링
  return (
    <div>
      {orderDetails ? (
        <div style={{ padding: "20px" }}>
          <Space>
            <h3>주문상세</h3>
          </Space>
          <div
            style={{
              opacity: "0.5",
              fontWeight: "bold",
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            {orderDetails && (
              <div>
                {new Date(orderDetails.created_at).toLocaleDateString()} 주문
              </div>
            )}
            <div>주문번호 : {orderDetails?.order_code}</div>
          </div>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card>
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: 16,
                  fontSize: "large",
                }}
              >
                {orderDetails.order_status === 0
                  ? "결제대기"
                  : orderDetails.order_status === 1
                  ? "결제완료"
                  : "주문취소"}
              </div>
              {orderDetails.select_products?.map((product, index) => (
                <Space>
                  <Image
                    src={product.product_image || ""}
                    alt={product.product_name}
                    width={60}
                    height={60}
                  />
                  <div key={index}>
                    <div>{product.product_name}</div>
                    {product.option?.map((option, index) => (
                      <div key={index}>
                        {option.optionName} : {option.optionValue}
                      </div>
                    ))}
                    <div style={{ opacity: "0.5", fontSize: "small" }}>
                      {parseInt(product.amount).toLocaleString("ko-KR")}원 |{" "}
                      {product.count}개
                    </div>
                  </div>
                </Space>
              ))}
            </Card>
            <Card style={{ fontSize: "large" }}>
              <div style={{ fontWeight: "bold" }}>
                <div>
                  {
                    branch.find((item) => item.id === orderDetails.branch_pk)
                      ?.branch_name
                  }
                </div>
              </div>
              <div style={{ opacity: "0.5", fontSize: "small" }}>
                {orderDetails.customer_address}
              </div>
              <div style={{ opacity: "0.5", fontSize: "medium" }}>
                {orderDetails.customer_phone}
              </div>
              <Divider />
              <div style={{ opacity: "0.5", fontSize: "small" }}>
                배송요청사항: {orderDetails.delivery_message}
              </div>
            </Card>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Button size="large" style={{ width: "100%" }} onClick={goHome}>
                  홈으로 돌아가기
                </Button>
              </Col>
              {/* <Col span={12}>
                <Button
                  size="large"
                  style={{ width: "100%" }}
                  onClick={cancelPayment}
                >
                  주문취소
                </Button>
              </Col> */}
            </Row>
          </Space>
        </div>
      ) : (
        <div>No order found</div> // 주문이 없을 경우 표시
      )}
    </div>
  );
};

export default OrderDetails;
