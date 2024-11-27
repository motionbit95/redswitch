import { Col, Row, Space, Typography } from "antd";

const { Text, Title } = Typography;

export const Footer = ({ theme }) => {
  return (
    <div
      style={{
        position: "relative",
        bottom: 0,
        left: 0,

        display: "flex",
        flexDirection: "column",
        padding: "20px",
        backgroundColor: theme === "dark" ? "#1e1e1e" : "#d9d9d9",
        color: theme === "dark" ? "white" : "black",
      }}
    >
      <Title level={4}>레드스위치</Title>
      <Text style={{ fontSize: "small" }}>대표자명 : 이한샘</Text>
      <Text style={{ fontSize: "small" }}>사업자등록번호 : 208-16-70116</Text>
      <Text style={{ fontSize: "small" }}>
        주소 : 서울특별시 강남구 역삼로 114, 8층 82호(역삼동, 현죽빌딩)
      </Text>
      <Text style={{ fontSize: "small" }}>
        통신판매신고번호 : 2024-서울강남-1234
      </Text>
      <Text style={{ fontSize: "small" }}>전화번호 : 010-8859-7942</Text>
      <Text style={{ fontSize: "small" }}>이메일 : redswitch@gmail.com</Text>
    </div>
  );
};
