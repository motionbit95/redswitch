import React, { useEffect } from "react";

function OrderList(props) {
  useEffect(() => {
    console.log(localStorage.getItem("token"));
  }, []);
  return <div>주문내역입니다.</div>;
}

export default OrderList;
