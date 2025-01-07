import { Checkbox, Radio, Select, Space } from "antd";
import React from "react";

function Filter(props) {
  const { onChange, value } = props;
  return (
    <div>
      <Space>
        <Select
          allowClear
          style={{ width: "100%" }}
          placeholder="선택"
          popupMatchSelectWidth={false}
          onChange={onChange}
          value={value}
        >
          <Select.Option value="all">전체</Select.Option>
          <Select.Option value="provider">거래처별</Select.Option>
          <Select.Option value="branch">지점별</Select.Option>
        </Select>
      </Space>
    </div>
  );
}

export default Filter;
