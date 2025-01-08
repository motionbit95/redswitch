import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  ReadOutlined,
  DollarOutlined,
  InboxOutlined,
  TruckOutlined,
  ShopOutlined,
  TeamOutlined,
  SolutionOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const menu_items = [
  {
    key: "/dashboard",
    icon: React.createElement(HomeOutlined),
    label: <Link to="/dashboard">홈</Link>,
  },
  {
    key: "sales",
    icon: React.createElement(DollarOutlined),
    label: "매출관리",
    children: [
      {
        key: "/sales/sales",
        label: <Link to="/sales/sales">기간별 조회</Link>,
      },
      {
        key: "/sales/branch",
        label: <Link to="/sales/branch">지점별 조회</Link>,
      },
    ],
  },
  {
    key: "/order",
    icon: React.createElement(TruckOutlined),
    label: <Link to="/order">주문관리</Link>,
  },
  {
    key: "product",
    icon: React.createElement(InboxOutlined),
    label: "상품관리",
    children: [
      {
        key: "/product/material",
        label: <Link to="/product/material">물자등록</Link>,
      },
      {
        key: "/product/product",
        label: <Link to="/product/product">판매상품관리</Link>,
      },
      {
        key: "/product/inventory",
        label: <Link to="/product/inventory">재고관리</Link>,
      },
      {
        key: "/product/purchase_order",
        label: <Link to="/product/purchase_order">발주관리</Link>,
      },
    ],
  },
  {
    key: "post",
    icon: React.createElement(ReadOutlined),
    label: "게시판",
    children: [
      {
        key: "/post/notification",
        label: <Link to="/post/notification">공지사항</Link>,
      },
      {
        key: "/post/inquiry",
        label: <Link to="/post/inquiry">게시판</Link>,
      },
    ],
  },
];

export default menu_items;
