import React from "react";
import { Typography } from "antd";
import { footerStyles } from "../styles";

const { Text, Title } = Typography;

export const Footer = React.memo(({ theme }) => {
  return (
    <div
      style={{
        ...footerStyles.container(theme),
      }}
    >
      <Title level={4}>레드스위치</Title>
      <Text style={footerStyles.text}>대표자명 : 이한샘</Text>
      <Text style={footerStyles.text}>사업자등록번호 : 208-16-70116</Text>
      <Text style={footerStyles.text}>
        주소 : 서울특별시 강남구 역삼로 114, 8층 82호(역삼동, 현죽빌딩)
      </Text>
      <Text style={footerStyles.text}>
        통신판매신고번호 : 2024-서울강남-1234
      </Text>
      <Text style={footerStyles.text}>전화번호 : 010-8859-7942</Text>
      <Text style={footerStyles.text}>이메일 : redswitch@gmail.com</Text>
    </div>
  );
});
