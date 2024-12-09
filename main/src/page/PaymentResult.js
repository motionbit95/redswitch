import { Button, Card, Col, Divider, Image, message, Row, Space } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Footer } from "../component/Footer";
import { CopyOutlined } from "@ant-design/icons";

function PaymentResult(props) {
  const [queryParams, setQueryParams] = useState({});
  const [order, setOrder] = useState({});
  const [branch, setBranch] = useState({});

  const goHome = () => {
    window.location.href = `/spot/${localStorage.getItem("branch")}`;
  };

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(queryParams.ordNo);
    message.success("주문번호가 클립보드에 복사되었습니다.");
  };

  const cancelPayment = async () => {
    console.log(queryParams);
    if (order.order_status < 1) {
      window.location.replace(
        `${process.env.REACT_APP_SERVER_URL}/payments/payCancel?tid=${queryParams.tid}&ordNo=${queryParams.ordNo}&canAmt=${queryParams.amt}&ediDate=${queryParams.ediDate}`
      );
    } else {
      message.error("이미 승인된 주문입니다.");
    }
  };

  return (
    <div>
      <div style={{ padding: "20px" }}>
        {queryParams && (
          <h1 style={{ textAlign: "center", marginBottom: 32 }}>
            주문이
            <br />
            완료되었습니다.
          </h1>
        )}
        <h3>주문상세</h3>
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
          {queryParams && (
            <div>
              {queryParams.appDtm?.substring(0, 4)}.
              {queryParams.appDtm?.substring(4, 6)}.
              {queryParams.appDtm?.substring(6, 8)} 주문
            </div>
          )}
          <div>주문번호 : {queryParams.ordNo}</div>
        </div>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
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
              <div>{parseInt(queryParams.amt).toLocaleString("ko-KR")}원</div>
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
                  {queryParams.fnNm} /{" "}
                  {parseInt(queryParams.quota) > 0
                    ? parseInt(queryParams.quota) + "개월"
                    : "일시불"}
                </div>
              )}
              <div>{parseInt(queryParams.amt).toLocaleString("ko-KR")}원</div>
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
              <div>{parseInt(queryParams.amt).toLocaleString("ko-KR")}원</div>
            </div>
          </Card>
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
              {order.order_status === 0 ? "결제대기" : "결제완료"}
            </div>
            {order.select_products?.map((product, index) => (
              <Space>
                <Image
                  src={
                    product.blurred_image || "https://via.placeholder.com/120"
                  }
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
