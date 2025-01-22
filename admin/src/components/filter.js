import { Button, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { AxiosGet } from "../api";

const { Option } = Select;
const { SearchOutlined } = require("@ant-design/icons");

function Filter(props) {
  const { onChange, value, onSearch } = props;
  const [optionList, setOptionList] = useState({
    product: [],
    branch: [],
    provider: [],
    material: [],
    category: [],
    company: [],
  });
  const [secondSelectValue, setSecondSelectValue] = useState(null); // Second select value state

  // 데이터 로드 훅 생성
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, branches, providers, materials, category] =
          await Promise.all([
            AxiosGet("/products"),
            AxiosGet("/branches"),
            AxiosGet("/providers"),
            AxiosGet("/products/materials"),
            AxiosGet("/products/categories"),
          ]);

        const companies = [];
        const companySet = new Set(); // Set to track unique company names

        branches.data.forEach((branch) => {
          const companyName = branch.company_name;
          if (companyName && !companySet.has(companyName)) {
            companies.push({ company_name: companyName }); // Add to companies if not already added
            companySet.add(companyName); // Add the company_name to Set to track uniqueness
          }
        });

        console.log(companies); // Now companies will have only unique company names in the object format

        setOptionList({
          product: products.data,
          branch: branches.data,
          provider: providers.data,
          material: materials.data,
          category: category.data,
          company: branches.data,
        });
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  const getOptionList = (key) => {
    const list = optionList[key] || [];
    const uniqueLabels = new Set(); // Set to track unique labels
    const result = []; // Array to hold the final unique options

    list.forEach((item) => {
      let label = "";
      let value = "";

      // Handle cases based on the key value
      if (key === "branch") {
        if (item.branch_name) {
          label = item.branch_name;
          value = item.id;
        }
      } else if (key === "company") {
        if (item.company_name) {
          label = item.company_name;
          value = item.company_name;
        }
      } else if (key === "product") {
        if (item.name) {
          label = item.name;
          value = item.name;
        } else if (item.product_code) {
          label = item.product_code;
          value = item.PK;
        }
      } else if (key === "provider") {
        if (item.provider_name) {
          label = item.provider_name;
          value = item.provider_name; // id에서 name으로 변경 - sjpark
        }
      } else if (key === "category") {
        if (item.product_category) {
          label = item.product_category;
          value = item.product_category_code;
        }
      } else if (key === "material") {
        if (item.product_code) {
          label = item.product_code;
          value = item.product_code;
        }
      }

      // Only add the item if the label is unique
      if (label && !uniqueLabels.has(label)) {
        uniqueLabels.add(label); // Add label to Set to track uniqueness
        result.push({ label, value }); // Add to result array
      }
    });

    return result;
  };

  // Handle change in second Select
  const handleSecondSelectChange = (value) => {
    setSecondSelectValue(value);
  };

  return (
    <div>
      <Space>
        {/* First Select */}
        <Select
          style={{ width: 150 }}
          defaultValue=""
          popupMatchSelectWidth={false}
          onChange={(e) => {
            onChange(e);
            setSecondSelectValue(null);
          }}
          value={value}
        >
          <Option value="">전체</Option>
          <Option value="provider">거래처별</Option>
          <Option value="branch">지점별</Option>
          <Option value="company">지사별</Option>
          <Option value="category">카테고리별</Option>
          <Option value="material">상품코드별</Option>
        </Select>

        {/* Second Select based on first Select's value */}
        {value && (
          <Select
            style={{ width: 150 }}
            onChange={handleSecondSelectChange}
            value={secondSelectValue}
            placeholder="선택해주세요"
            showSearch // This enables search functionality
            filterOption={
              (input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase()) // Search by option label
            }
          >
            {getOptionList(value).map((option, index) => (
              <Select.Option key={index} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        )}
        <Button
          type="primary"
          onClick={() => onSearch(value, secondSelectValue)}
          icon={<SearchOutlined />}
        />
      </Space>
    </div>
  );
}

export default Filter;
