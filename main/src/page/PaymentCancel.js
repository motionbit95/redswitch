import { Button } from "antd";
import React, { useEffect, useState } from "react";

function PaymentCancel(props) {
  const [queryParams, setQueryParams] = useState({});

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
        parsedObject[key] = value.replaceAll("{", "").replaceAll("}", "");
      }
      console.log("==============================");
      console.log("결제 : ", parsedObject);
      setQueryParams(parsedObject);
    }
  }, []); // Run once when the component mounts

  return (
    <div
      style={{
        padding: 32,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 32, whiteSpace: "pre" }}>
        {queryParams?.resultCd === "0000"
          ? "주문이\n취소되었습니다."
          : queryParams?.resultMsg}
      </h1>
      <Button type="primary" size="large" onClick={goHome}>
        홈으로 이동
      </Button>
    </div>
  );
}

export default PaymentCancel;
