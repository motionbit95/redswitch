import { Button, Space } from "antd";

// 카테고리 필터 UI
const CategoryFilter = ({
  theme,
  categories,
  selectedItemId,
  setSelectedItemId,
}) => {
  const handleCategoryClick = (code) => {
    setSelectedItemId(code);

    // 선택된 버튼으로 스크롤
    document.getElementById(`category-${code}`)?.scrollIntoView({
      behavior: "smooth",
      inline: "center", // 가운데 정렬
    });
  };

  return (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        whiteSpace: "nowrap",
        padding: "20px 0",
        background: theme === "dark" ? "#2e2e2e" : "#fcfcfc",
        scrollbarWidth: "none", // 스크롤 숨기기 (Firefox)
        msOverflowStyle: "none", // 스크롤 숨기기 (IE/Edge)
      }}
    >
      <style>
        {`
            /* Chrome, Safari 숨기기 */
            div::-webkit-scrollbar {
              display: none;
            }
          `}
      </style>
      {categories.map(({ product_category, product_category_code }, index) => (
        <Button
          key={index}
          id={`category-${product_category_code}`}
          danger={selectedItemId === product_category_code}
          type={
            selectedItemId === product_category_code ? "primary" : "default"
          } // 선택된 카테고리 강조
          onClick={() => handleCategoryClick(product_category_code)}
          style={{
            margin: "0 5px", // 버튼 간격
            flexShrink: 0, // 줄어들지 않도록 고정
          }}
        >
          {product_category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
