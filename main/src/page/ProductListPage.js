import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Tabs,
  Input,
  Space,
  Typography,
  Tag,
  Image,
  Skeleton,
} from "antd";
import { InboxOutlined, SearchOutlined } from "@ant-design/icons";
import CategoryFilter from "../component/CategoryFilter";

const { Search } = Input;
const { TabPane } = Tabs;

function ProductListPage(props) {
  const { theme, branch } = props;
  const [selectedItemId, setSelectedItemId] = useState("01"); // 선택된 카테고리
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [branchProducts, setBranchProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    console.log("branchProducts:", branchProducts);
  }, [branchProducts]);

  // 이미지 로딩 완료 후 처리
  const handleImageLoad = () => {
    console.log("Image loaded");
    setLoading(false);
  };

  // 이미지 로딩 실패 시 대체 이미지 처리
  const handleImageError = () => {
    setImageError(true); // 이미지를 찾을 수 없을 때
    setLoading(false); // 로딩 상태 종료
  };

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
          {filteredProducts.map((product) => (
            <Col key={product.id} xs={12} sm={12} md={8} lg={6}>
              {/* 2열로 설정 */}
              <div
                style={{
                  border: "none", // border 제거
                  backgroundColor: "transparent",
                  boxShadow: "none", // 그림자 제거
                  display: "flex",
                  flexDirection: "column", // 이미지와 텍스트를 세로로 배치
                  justifyContent: "flex-start", // 세로 정렬
                  overflow: "hidden",
                  // marginBottom: "20px",
                }}
              >
                {/* 이미지 */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: theme === "dark" ? "#333" : "#f1f1f1",
                  }}
                >
                  {loading || imageError ? (
                    <Skeleton.Image
                      style={{
                        width: "80%",
                        height: "80%",
                        backgroundColor: "transparent",
                      }}
                    />
                  ) : null}
                  <Image
                    src={product.original_image}
                    alt={product.name}
                    preview={false}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: loading || imageError ? "none" : "block", // 스켈레톤과 중복 표시 방지
                    }}
                    onLoad={() => setLoading(false)} // 로딩 완료 시
                    onError={() => {
                      setImageError(true);
                      setLoading(false); // 에러 시 로딩 종료
                    }}
                  />
                  {imageError && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#f5f5f5",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#888" }}>이미지 없음</span>
                    </div>
                  )}
                </div>
                {/* 텍스트 영역 */}
                <div style={{ padding: "10px" }}>
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    {product.product_name}
                  </Typography.Title>
                  <Typography.Text strong style={{ fontSize: "16px" }}>
                    {parseInt(product.product_price).toLocaleString("ko-KR")}원
                  </Typography.Text>
                  <br />
                  <Space
                    style={{
                      display: product.remaining < 3 ? "flex" : "none",
                    }}
                  >
                    <InboxOutlined style={{ color: "#ff7875" }} />
                    <Typography.Text
                      type="secondary"
                      style={{
                        fontSize: "14px",
                        color: "#ff7875",
                      }}
                    >
                      {product.remaining}개 남았어요
                    </Typography.Text>
                  </Space>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default ProductListPage;
