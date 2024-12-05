import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Col, Input, Row, Space } from "antd";
import { useLocation } from "react-router-dom";

const random = (length = 8) => {
  return Math.random().toString(16).substr(2, length);
};

//${process.env.REACT_APP_SERVER_URL}/payment/payCancel?tid=${order.tid}&ordNo=${order.ordNo}&canAmt=${order.goodsAmt}&ediDate=${order.ediDate}
const Payment = () => {
  const location = useLocation();
  const [queryParams, setQueryParams] = useState({});
  const [amount, setAmount] = useState(0);
  const [order, setOrder] = useState({
    tid: "",
    ordNo: "",
    amt: "",
    ediDate: "",
    goodsNm: "", // 상품 이름을 저장할 필드
    ...location.state.order,
  });

  const [branchInfo, setBranchInfo] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    console.log(order);

    // 지점 정보 가져오기
    const fetchBranchInfo = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/branches/${localStorage.getItem(
          "branch"
        )}`
      );
      const data = await response.json();
      console.log(data);
      if (response.status !== 200) {
        const error = new Error(data.message);
        error.response = data;
        setBranchInfo(null);
      } else {
        setBranchInfo(data);
      }
    };

    // 상품 정보 가져오기
    const fetchProducts = async () => {
      let productNames = [];
      if (order.products) {
        for (const item of order.products) {
          const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/products/${item.product_pk}`
          );
          const data = await response.json();
          console.log(data);

          if (response.status === 200) {
            productNames.push(data.product_name);
          }
        }
      }

      // 상품 이름들을 goodsNm에 할당
      setOrder((prevOrder) => ({
        ...prevOrder,
        goodsNm: productNames.join(" / "), // 상품 이름들을 콤마로 구분하여 문자열로 저장
      }));
    };

    fetchProducts();
    fetchBranchInfo();

    console.log("주문", order);
  }, [order.products]); // order.products 변경 시마다 실행되도록 의존성 배열 설정

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

      console.log(parsedObject);
      setQueryParams(parsedObject);
    }
  }, []); // Run once when the component mounts

  const callPayPopup = async () => {
    // PAYMENT DATA를 저장합니다.
    const order_id = random();
    const searchParams = new URLSearchParams([
      ["order_id", order_id],
      ["amount", amount],
    ]);
    window.location.replace(
      `${process.env.REACT_APP_SERVER_URL}/payments?${searchParams.toString()}`
    );
  };

  const cancelPayment = async () => {
    window.location.replace(
      `${process.env.REACT_APP_SERVER_URL}/payments/payCancel?tid=${order.tid}&ordNo=${order.ordNo}&canAmt=${order.amt}&ediDate=${order.ediDate}`
    );
  };

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: "large", fontWeight: "bold" }}>
              {branchInfo?.branch_name}
            </div>
            <div style={{ fontSize: "small", opacity: 0.5 }}>
              {branchInfo?.branch_address}
            </div>
          </div>

          <Space direction="vertical" style={{ width: "100%" }}>
            <Input placeholder="호실을 입력해주세요." />

            <Input
              placeholder="금액을 입력하세요."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button onClick={callPayPopup}>결제 테스트하기</Button>
            {queryParams && (
              <pre>
                <code>{JSON.stringify(queryParams, null, 2)}</code>
              </pre>
            )}
          </Space>
        </Col>
        {/* <Col span={12}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input
              placeholder="TID(tid)를 입력하세요."
              value={order.tid}
              onChange={(e) => setOrder({ ...order, tid: e.target.value })}
            />
            <Input
              placeholder="주문번호(ordNo)를 입력하세요."
              value={order.ordNo}
              onChange={(e) => setOrder({ ...order, ordNo: e.target.value })}
            />
            <Input
              placeholder="결제 금액(amt)을 입력하세요."
              value={order.amt}
              onChange={(e) => setOrder({ ...order, amt: e.target.value })}
            />
            <Input
              placeholder="결제 일시(ediDate)를 입력하세요."
              value={order.ediDate}
              onChange={(e) => setOrder({ ...order, ediDate: e.target.value })}
            />
            <Button onClick={cancelPayment}>결제취소</Button>
          </Space>
        </Col> */}
      </Row>
    </div>
  );
};

export default Payment;
