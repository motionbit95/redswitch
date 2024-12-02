import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Spin } from "antd";
import CategoryFilter from "../component/CategoryFilter";
import ProductCard from "../component/ProductCard";

function ProductListPage(props) {
  const { theme, branch } = props;
  const [selectedItemId, setSelectedItemId] = useState("01");
  const [branchProducts, setBranchProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHeader, setShowHeader] = useState(false);

  // 스크롤 이벤트 처리
  const handleScroll = () => {
    const contentElement = document.getElementById("content");
    if (contentElement) {
      const contentPosition = contentElement.getBoundingClientRect().top;
      if (contentPosition <= 0) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 상품 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const productsResponse = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/products/search/${branch.id}`
        );
        const productsData = await productsResponse.json();

        // 각 상품의 material 데이터를 병렬로 요청
        const materialRequests = productsData.map((item) =>
          fetch(
            `${process.env.REACT_APP_SERVER_URL}/products/materials/${item.material_id}`
          ).then((res) => res.json())
        );

        const materialsData = await Promise.all(materialRequests);

        // 상품 데이터와 material 데이터를 병합
        const newList = productsData.map((product, index) => ({
          ...product,
          ...materialsData[index],
        }));

        setBranchProducts(newList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (branch?.id) {
      fetchProducts();
    }
  }, [branch.id]);

  // 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoriesResponse = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/products/categories`
        );
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, []);

  // 필터링된 상품 데이터 계산
  const filteredProducts =
    selectedItemId === "all"
      ? branchProducts // 전체 카테고리 선택 시 모든 상품을 표시
      : branchProducts.filter(
          (product) => product.product_category_code === selectedItemId
        );

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
          }}
        >
          <Typography.Title
            level={3}
            style={{ margin: 0, lineHeight: "20px", padding: "20px" }}
          >
            {branch?.branch_name}
          </Typography.Title>
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

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]} justify="flex-start">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <Col key={index} xs={12} sm={12} md={8} lg={6}>
                  <ProductCard product={product} theme={theme} />
                </Col>
              ))
            ) : (
              <div style={{ width: "100%", textAlign: "center" }}>
                <Typography.Text>상품이 없습니다.</Typography.Text>
              </div>
            )}
          </Row>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;
