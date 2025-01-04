import React, { useEffect, useState } from "react";
import { Button, Col, Form, Image, Input, Row, Space, theme } from "antd";
import { useLocation } from "react-router-dom";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { fixedBottomStyle } from "../styles";

//${process.env.REACT_APP_SERVER_URL}/payment/payCancel?tid=${order.tid}&ordNo=${order.ordNo}&canAmt=${order.goodsAmt}&ediDate=${order.ediDate}
const Payment = () => {
  const location = useLocation();
  const [form] = Form.useForm();

  const [viewProduct, setViewProduct] = useState(false); // 상품 상세보기 여부 플래그
  const [order, setOrder] = useState(location.state.order); // 주문 정보
  const [branchInfo, setBranchInfo] = useState(null); // 지점 정보

  useEffect(() => {
    window.scrollTo(0, 0);

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
      let products = [];
      if (order.products) {
        for (const item of order.products) {
          const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/products/${item.product_pk}`
          );
          const data = await response.json();

          console.log("주문상품 : ", item, data);
          if (response.status === 200) {
            products.push({
              ...item,
              ...data,
            });
          }
        }
      }

      // 상품 이름들을 goodsNm에 할당
      setOrder((prevOrder) => ({
        ...prevOrder,
        products: products,
      }));
    };

    fetchProducts();
    fetchBranchInfo();

    console.log("주문", order);
  }, []); // order.products 변경 시마다 실행되도록 의존성 배열 설정

  const callPayPopup = async (values) => {
    console.log("주문정보", order);
    console.log("입력정보", values);

    // 주문 데이터 생성
    const newOrder = {
      payment_pk: "", // 결제 전
      branch_pk: localStorage.getItem("branch"),
      order_code: order.ordNo, // 주문번호
      customer_id: localStorage.getItem("token"), // 유저 토큰
      customer_phone: values.customer_phone || "", // 유저 전화번호
      customer_address: values.room_number || "", // 주문 주소 및 호실
      select_products: order.products, // 상품 정보
      order_status: 0, // 결제 대기
      order_amount: order.amt, // 주문금액
      delivery_message: values.delivery_message || "", // 배송 메시지
      goods_name: order.products.map((item) => item.product_name).join(", "),
    };

    // 주문서를 저장합니다. - 임시 / 결제 완료 후 상태를 업데이트 합니다.
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    });
    const data = await response.json();
    if (response.status !== 201) {
      const error = new Error(data.message);
      error.response = data;
      throw error;
    }

    console.log(data);

    // 결제 페이지(홀빅) 호출
    const searchParams = new URLSearchParams([
      ["order_id", newOrder.order_code],
      ["amount", newOrder.order_amount],
      ["goodsNm", newOrder.goods_name],
    ]);
    window.location.replace(
      `${
        process.env.REACT_APP_SERVER_URL
      }/payments/callPopup?${searchParams.toString()}`
    );
  };

  return (
    <div>
      <div
        style={{
          backgroundColor: "#f1f1f1",
          // paddingBottom: "100px",
          overflow: "hidden",
        }}
      >
        <Row
          gutter={16}
          style={{ padding: 16, backgroundColor: "white", marginBottom: 8 }}
        >
          <Col span={24}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "large", fontWeight: "bold" }}>
                주문상품 총 {order.products.length}개
              </div>
              <Button
                type="link"
                style={{ color: "black" }}
                icon={viewProduct ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setViewProduct(!viewProduct)}
              />
            </div>
          </Col>
          {viewProduct && (
            <Row
              gutter={[16, 16]}
              style={{ padding: 16, backgroundColor: "white" }}
            >
              {order.products.map((item) => (
                <>
                  <Col span={6}>
                    <Image
                      src={
                        item.blurred_image ||
                        item.original_image ||
                        "https://via.placeholder.com/120"
                      }
                    />
                  </Col>
                  <Col span={18}>
                    <div>{item?.product_name}</div>
                    <Space>
                      <div style={{ fontWeight: "bold", fontSize: "medium" }}>
                        {item?.amount}원
                      </div>
                      <div style={{ opacity: 0.5 }}>{item?.count}개</div>
                    </Space>
                    {item?.option?.map((option) => (
                      <div style={{ opacity: 0.5 }}>
                        {option?.optionName} : {option?.optionPrice}원
                      </div>
                    ))}
                  </Col>
                </>
              ))}
            </Row>
          )}
        </Row>

        <Row
          gutter={16}
          style={{ padding: 16, backgroundColor: "white", marginBottom: 8 }}
        >
          <Col span={24}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: "large", fontWeight: "bold" }}>
                {branchInfo?.branch_name}
              </div>
              <div style={{ fontSize: "small", opacity: 0.5 }}>
                {branchInfo?.branch_address}
              </div>
            </div>
          </Col>
          <Col span={24}>
            <Form
              form={form}
              layout="vertical"
              style={{ width: "100%" }}
              // onFinish={callPayPopup}
            >
              <Form.Item
                label="호실"
                name="room_number"
                rules={[{ required: true, message: "호실을 입력해주세요." }]}
              >
                <Input placeholder="호실을 입력해주세요." />
              </Form.Item>
              <Form.Item label="배송 메세지" name="delivery_message">
                <Input placeholder="배송시 요청사항을 입력해주세요." />
              </Form.Item>
              <Form.Item label="연락처" name="customer_phone">
                <Input placeholder="연락처를 입력해주세요.(선택)" />
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <Row
          gutter={16}
          style={{ padding: 16, backgroundColor: "white", marginBottom: 8 }}
        >
          <Col span={24}>
            <div
              style={{
                fontSize: "large",
                fontWeight: "bold",
                marginBottom: 16,
              }}
            >
              결제수단
            </div>
          </Col>
          <Col span={24}>
            <Button type="primary" danger>
              카드
            </Button>
          </Col>
        </Row>

        <Row
          gutter={16}
          style={{ padding: 16, backgroundColor: "white", marginBottom: 8 }}
        >
          <Col span={24}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: "large",
                  fontWeight: "bold",
                  marginBottom: 16,
                }}
              >
                총 결제금액
              </div>
              <div
                style={{
                  fontSize: "large",
                  fontWeight: "bold",
                  marginBottom: 16,
                }}
              >
                {parseInt(order.amt).toLocaleString()}원
              </div>
            </div>
          </Col>
        </Row>
        <div
          style={{
            padding: 16,
            fontSize: "small",
            opacity: 0.5,
            minHeight: 100,
          }}
        >
          레드스위치는 통신판매중개자이며, 통신판매의 당사자가 아닙니다. 따라서
          레드스위치는 상품, 거래정보 및 거래에 대하여 책임을 지지않습니다.
          <br /> 위 내용을 확인하였으며 결제에 동의합니다.
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div style={fixedBottomStyle(theme)}>
        <Button
          size="large"
          type="primary"
          danger
          style={{ width: "100%" }}
          // htmlType="submit"
          onClick={() => callPayPopup(form.getFieldsValue())}
        >
          {parseInt(order.amt).toLocaleString()}원 결제하기
        </Button>
      </div>
    </div>
  );
};

export default Payment;
