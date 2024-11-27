import { Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function TestResult(props) {
  const { theme, setPage } = props;
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(result === null);
  const location = useLocation();
  const anwers = location.state.answers;

  useEffect(() => {
    console.log("answer!!!", anwers);
  }, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        background: theme === "dark" ? "#000" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
      }}
    >
      <Typography.Title level={2}>Result</Typography.Title>
    </div>
  );
}

export default TestResult;
