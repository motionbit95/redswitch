import React, { useCallback } from "react";
import { Button } from "antd";
import { categoryFilterStyles } from "../styles"; // Import styles

// 카테고리 필터 UI
const CategoryFilter = React.memo(
  ({ theme, categories, selectedItemId, setSelectedItemId }) => {
    // 카테고리 클릭 처리 함수
    const handleCategoryClick = useCallback(
      (code) => {
        setSelectedItemId(code);

        // 선택된 버튼으로 스크롤
        document.getElementById(`category-${code}`)?.scrollIntoView({
          behavior: "smooth",
          inline: "center", // 가운데 정렬
        });
      },
      [setSelectedItemId]
    );

    // Get the dynamic styles based on the theme
    const containerStyle = categoryFilterStyles(theme);

    return (
      <div style={containerStyle}>
        <style>
          {`
          /* Chrome, Safari 숨기기 */
          div::-webkit-scrollbar {
            display: none;
          }
        `}
        </style>

        {/* 전체 카테고리 버튼 */}
        <Button
          id="category-all"
          danger={selectedItemId === "all"}
          type={selectedItemId === "all" ? "primary" : "default"} // 선택된 카테고리 강조
          onClick={() => handleCategoryClick("all")}
        >
          전체 카테고리
        </Button>

        {/* 각 카테고리 버튼 */}
        {categories.map(
          ({ product_category, product_category_code }, index) => (
            <Button
              key={index}
              id={`category-${product_category_code}`}
              danger={selectedItemId === product_category_code}
              type={
                selectedItemId === product_category_code ? "primary" : "default"
              } // 선택된 카테고리 강조
              onClick={() => handleCategoryClick(product_category_code)}
            >
              {product_category}
            </Button>
          )
        )}
      </div>
    );
  }
);

export default CategoryFilter;
