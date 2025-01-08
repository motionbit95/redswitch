import { Button, Card, Col, Divider, Image, message, Row, Space } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Footer } from "../component/Footer";
import { CopyOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentResult(props) {
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState({}); // 결제 데이터
  const [order, setOrder] = useState({}); // 주문 데이터
  const [branch, setBranch] = useState({}); // 지점 데이터
  const location = useLocation();
  const [orderStatus, setOrderStatus] = useState(0);

  useEffect(() => {
    if (window.location.search) {
      const queryString = window.location.search;

      const urlParams = new URLSearchParams(queryString.split("?")[1]); // Get parameters after '?'
      const dataParam = urlParams.get("data"); // Get 'data' parameter

      // Step 1: Decode the URL-encoded string
      const decodedData = decodeURIComponent(dataParam);

      // Step 2: The decoded data is a query string, so we need to parse it
      const params = new URLSearchParams(decodedData);

      // Step 3: Convert it to an object
      const parsedObject = {};
      for (const [key, value] of params.entries()) {
        parsedObject[key] = value;
      }
      console.log("==============================");
      console.log("결제 : ", parsedObject);
      setQueryParams(parsedObject);

      // order 정보도 가지고 옵니다.
      axios
        .get(
          `${process.env.REACT_APP_SERVER_URL}/orders/code/${parsedObject.ordNo}`
        )
        .then((res) => {
          console.log("주문 : ", res.data);
          setOrder(res.data);

          // 장바구니에서 해당 상품을 제거합니다.
          for (const item of res.data.select_products) {
            console.log(item.cart_pk);
            axios
              .delete(
                `${process.env.REACT_APP_SERVER_URL}/carts/${item.cart_pk}`
              )
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          }

          axios
            .get(
              `${process.env.REACT_APP_SERVER_URL}/branches/${res.data?.branch_pk}`
            )
            .then((res) => {
              console.log("지점 :", res.data);
              setBranch(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []); // Run once when the component mounts

  useEffect(() => {
    if (location.state) {
      console.log(location.state.order);
      setOrder(location.state.order);

      axios
        .get(
          `${process.env.REACT_APP_SERVER_URL}/branches/${location.state.order?.branch_pk}`
        )
        .then((res) => {
          console.log("지점 :", res.data);
          setBranch(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      // order
      axios
        .get(
          `${process.env.REACT_APP_SERVER_URL}/payments/ordNo/${location.state.order?.order_code}`
        )
        .then((res) => {
          setQueryParams({ ...res.data[0], amt: res.data[0].goodsAmt });
          console.log(res.data);
          setOrderStatus(res.data.length);
        })
        .catch((err) => {
          // 결제 데이터가 없음
          setQueryParams(null);
          console.log(err);
        });
    }
  }, []);

  // 메인으로 이동
  const goHome = () => {
    window.location.href = `/spot/${localStorage.getItem("branch")}`;
  };

  // 주문번호 저장
  const copyToClipboard = () => {
    navigator.clipboard.writeText(queryParams?.ordNo);
    message.success("주문번호가 클립보드에 복사되었습니다.");
  };

  // 주문 취소
  const cancelPayment = async () => {
    if (!queryParams) {
      message.error("취소할 결제 데이터가 없습니다.");
      return;
    }

    console.log(queryParams);
    if (orderStatus < 2) {
      window.location.replace(
        `${process.env.REACT_APP_SERVER_URL}/payments/payCancel?tid=${queryParams?.tid}&ordNo=${queryParams?.ordNo}&canAmt=${queryParams?.amt}&ediDate=${queryParams?.ediDate}`
      );
    } else if (orderStatus === 2) {
      message.error("이미 취소된 주문입니다.");
    } else {
      message.error("취소 불가 주문입니다.");
    }
  };

  return (
    <div>
      <div style={{ padding: "20px" }}>
        {window.location.search && (
          <h1 style={{ textAlign: "center", marginBottom: 32 }}>
            주문이
            <br />
            완료되었습니다.
          </h1>
        )}
        <Space>
          {!queryParams && (
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
          )}
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
          {order && (
            <div>{new Date(order.created_at).toLocaleDateString()} 주문</div>
          )}
          <div>주문번호 : {order?.order_code}</div>
        </div>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {queryParams && ( // 결제 정보가 있을 때만
            <Card title="결제정보" style={{ fontSize: "medium" }}>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                {queryParams && <div>상품가격</div>}
                <div>
                  {parseInt(queryParams?.amt).toLocaleString("ko-KR")}원
                </div>
              </div>
              <Divider />
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                {queryParams && (
                  <div>
                    {queryParams?.fnNm} /{" "}
                    {parseInt(queryParams?.quota) > 0
                      ? parseInt(queryParams?.quota) + "개월"
                      : "일시불"}
                  </div>
                )}
                <div>
                  {parseInt(queryParams?.amt).toLocaleString("ko-KR")}원
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  fontWeight: "bold",
                }}
              >
                {queryParams && <div>총 결제금액</div>}
                <div>
                  {parseInt(queryParams?.amt).toLocaleString("ko-KR")}원
                </div>
              </div>
            </Card>
          )}
          <Card style={{ fontSize: "large" }}>
            <div style={{ fontWeight: "bold" }}>
              <div>{branch.branch_name}</div>
            </div>
            <div style={{ opacity: "0.5", fontSize: "small" }}>
              {order.customer_address}호실
            </div>
            <div style={{ opacity: "0.5", fontSize: "medium" }}>
              {order.customer_phone}
            </div>
            <Divider />
            <div style={{ opacity: "0.5", fontSize: "small" }}>
              배송요청사항: {order.delivery_message}
            </div>
          </Card>
          <Card>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: 16,
                fontSize: "large",
              }}
            >
              {order.order_status === 0
                ? "결제대기"
                : order.order_status === 1
                ? "결제완료"
                : "주문취소"}
            </div>
            {order.select_products?.map((product, index) => (
              <Space>
                <Image
                  src={product.blind_image || "https://via.placeholder.com/120"}
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
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Button size="large" style={{ width: "100%" }} onClick={goHome}>
                홈으로 돌아가기
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type="primary"
                danger
                icon={<CopyOutlined />}
                size="large"
                style={{ width: "100%" }}
                onClick={copyToClipboard}
              >
                주문번호 복사
              </Button>
            </Col>
            <Col span={12}>
              <Button
                size="large"
                style={{ width: "100%" }}
                onClick={cancelPayment}
              >
                주문취소
              </Button>
            </Col>
          </Row>
          <div style={{ opacity: "0.5", fontSize: "small" }}>
            * 주문 승인 이후 주문을 취소할 수 없습니다.
          </div>
        </Space>
      </div>
      <Footer theme={"light"} />
    </div>
  );
}

export default PaymentResult;
