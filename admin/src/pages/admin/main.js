import { Button, Calendar, Space } from "antd";
import React from "react";

const Main = () => {
  const onSelect = (date) => {
    console.log("Selected date:", date.format("YYYY-MM-DD"));
  };

  const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };
  return (
    <div style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
      <Space
        direction="vertical"
        size={"large"}
        style={{
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            width: 300,
            border: "1px solid #d9d9d9",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <Calendar
            fullscreen={false}
            onSelect={onSelect}
            onPanelChange={onPanelChange}
          />
        </div>
        <Button>메뉴얼</Button>
      </Space>
    </div>
  );
};

export default Main;
