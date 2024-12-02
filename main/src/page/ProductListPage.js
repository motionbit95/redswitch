import React, { useEffect, useState } from "react";
import { Row, Col, Typography } from "antd";
import CategoryFilter from "../component/CategoryFilter";
import ProductCard from "../component/ProductCard";

function ProductListPage(props) {
  const { theme, branch } = props;
  const [selectedItemId, setSelectedItemId] = useState("01"); // 선택된 카테고리

  const [branchProducts, setBranchProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    console.log("branchProducts:", branchProducts);
  }, [branchProducts]);

  let filteredProducts = branchProducts.filter((product) => {
    return product.product_category_code === selectedItemId;
  });

  const [showHeader, setShowHeader] = useState(false);

  // 스크롤 이벤트 처리
  const handleScroll = () => {
    const contentElement = document.getElementById("content");
    if (contentElement) {
      const contentPosition = contentElement.getBoundingClientRect().top;
      if (contentPosition <= 0) {
        // content 요소가 화면 상단에 도달했을 때
        setShowHeader(true); // 헤더 보이게
      } else {
        setShowHeader(false); // 헤더 숨기기
      }
    }
  };

  // 컴포넌트 마운트 시 스크롤 이벤트 리스너 추가
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/products/search/${branch.id}`
      );
      const productsData = await products.json();

      let newList = [];

      productsData.map(async (item) => {
        let material = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/products/materials/${item.material_id}`
        );

        let materialData = await material.json();

        newList.push({ ...item, ...materialData });

        setBranchProducts(newList);
      });
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      const categories = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/products/categories`
      );
      const categoriesData = await categories.json();
      setCategories(categoriesData);
    };
    fetchCategory();
  }, []);

  return (
    <div>
      {showHeader && (
        <div
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1000,
            backgroundColor: theme === "dark" ? "#2e2e2e" : "#fcfcfc",
            // boxShadow:
            //   theme === "dark"
            //     ? "0 4px 6px rgba(255, 255, 255, 0.1)"
            //     : "0 4px 6px rgba(0, 0, 0, 0.1)",
            // transition: "box-shadow 0.3s ease",
          }}
        >
          {/* 헤더 */}
          <Typography.Title
            level={3}
            style={{
              margin: 0,
              lineHeight: "20px",
              padding: "20px",
            }}
          >
            {branch?.branch_name}
          </Typography.Title>

          {/* 필터 */}
          <CategoryFilter
            theme={theme}
            categories={categories}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
          />
        </div>
      )}
      <div id={"content"} style={{ padding: "0 10px" }}>
        <CategoryFilter
          theme={theme}
          categories={categories}
          selectedItemId={selectedItemId}
          setSelectedItemId={setSelectedItemId}
        />
        {/* 상품 리스트 */}
        <Row gutter={[16, 16]} justify="flex-start">
          {filteredProducts.map((product, index) => (
            <Col key={index} xs={12} sm={12} md={8} lg={6}>
              {/* 2열로 설정 */}
              <ProductCard product={product} theme={theme} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default ProductListPage;
