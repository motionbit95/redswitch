import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Spin, Empty } from "antd";
import CategoryFilter from "../component/CategoryFilter";
import ProductCard from "../component/ProductCard";

function ProductListPage(props) {
  const { theme, branch, isCertified } = props;
  const [selectedItemId, setSelectedItemId] = useState("01");
  const [branchProducts, setBranchProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHeader, setShowHeader] = useState(false);

  // 스크롤 이벤트 처리 (디바운싱 적용)
  const handleScroll = () => {
    const contentElement = document.getElementById("content");
    if (contentElement) {
      const contentPosition = contentElement.getBoundingClientRect().top;
      setShowHeader(contentPosition <= 0);
    }
  };

  useEffect(() => {
    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 상품 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      if (!branch?.id) return;

      setLoading(true);
      try {
        const productsResponse = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/products/search/${branch.id}`
        );
        const productsData = await productsResponse.json();

        // 각 상품의 material 데이터를 병렬로 요청
        const materialsData = await Promise.all(
          productsData.map((item) =>
            fetch(
              `${process.env.REACT_APP_SERVER_URL}/products/materials/${item.material_id}`
            ).then((res) => res.json())
          )
        );

        // 상품 데이터와 material 데이터를 병합
        const updatedProducts = productsData.map((product, index) => ({
          ...product,
          ...materialsData[index],
        }));

        setBranchProducts(updatedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [branch?.id]);

  // 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/products/categories`
        );
        const categoriesData = await categoriesResponse.json();
        const filteredCategories = categoriesData.filter((category) =>
          branchProducts.some(
            (product) =>
              product.product_category_code === category.product_category_code
          )
        );
        console.log(filteredCategories);
        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [branchProducts]);

  // 필터링된 상품 데이터 계산
  const filteredProducts =
    selectedItemId === "all"
      ? branchProducts
      : branchProducts.filter(
          (product) => product.product_category_code === selectedItemId
        );

  return (
    <div>
      {/* Display CategoryFilter above content when showHeader is false */}
      {!showHeader && (
        <div
          style={{
            padding: "20px 10px",
            backgroundColor: theme === "dark" ? "#2e2e2e" : "#fcfcfc",
          }}
        >
          <CategoryFilter
            theme={theme}
            categories={categories}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
          />
        </div>
      )}

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

          {/* Sticky Category Filter */}
          <CategoryFilter
            theme={theme}
            categories={categories}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
          />
        </div>
      )}

      <div id="content" style={{ padding: "0 10px" }}>
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
        ) : filteredProducts.length === 0 ? (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              height: "300px",
            }}
          >
            <Empty description="상품이 없습니다." />
          </div>
        ) : (
          <Row gutter={[16, 16]} justify="flex-start">
            {filteredProducts.map((product, index) => (
              <Col key={index} xs={12} sm={12} md={8} lg={6}>
                <ProductCard
                  product={product}
                  theme={theme}
                  isCertified={isCertified}
                  handleOpen={props.handleOpen}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;
