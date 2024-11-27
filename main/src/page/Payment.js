import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Col, Input, Row, Space } from "antd";

const random = (length = 8) => {
  return Math.random().toString(16).substr(2, length);
};
//${process.env.REACT_APP_SERVER_URL}/payment/payCancel?tid=${order.tid}&ordNo=${order.ordNo}&canAmt=${order.goodsAmt}&ediDate=${order.ediDate}
const PaymentTest = () => {
  const [queryParams, setQueryParams] = useState({});
  const [amount, setAmount] = useState(0);
  const [order, setOrder] = useState({
    tid: "",
    ordNo: "",
    amt: "",
    ediDate: "",
  });

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
        <Col span={12}>
          <Space direction="vertical" style={{ width: "100%" }}>
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
        <Col span={12}>
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
        </Col>
      </Row>
    </div>
  );
};

export default PaymentTest;
