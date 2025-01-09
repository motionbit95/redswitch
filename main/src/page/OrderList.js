import { Card, Empty, Image, Space, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderList(props) {
  const [branchList, setBranchList] = useState(null);
  const [orderList, setOrderList] = useState(null);
  const [productList, setProductList] = useState(null);
  const [materialList, setMaterialList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductList = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/products`
      );
      const data = await response.json();
      setProductList(data);
    };

    const fetchMaterialList = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/products/materials`
      );
      const data = await response.json();
      setMaterialList(data);
    };

    const fetchBranchList = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/branches`
      );
      const data = await response.json();
      setBranchList(data);
    };

    const fetchOrderList = async () => {
      console.log(localStorage.getItem("token"));
      const response = await fetch(
        `${
          process.env.REACT_APP_SERVER_URL
        }/orders/token/${localStorage.getItem("token")}`
      );
      const data = await response.json();
      console.log(data.filter((item) => item.order_status > 0));
      setOrderList(data.filter((item) => item.order_status > 0)); // 결제대기는 제외
    };

    fetchOrderList();
    fetchBranchList();
    fetchMaterialList();
    fetchProductList();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        paddingBottom: "80px",
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {orderList && orderList.length > 0 ? (
          orderList.map((order) => (
            <Card
              key={order.id}
              onClick={() => navigate(`/payment/result`, { state: { order } })}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Tag>
                    {order.order_status === 0
                      ? "결제대기"
                      : order.order_status === 1
                      ? "결제완료"
                      : "주문취소"}
                  </Tag>
                  <div style={{ fontWeight: "bold" }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div>주문번호: {order.order_code}</div>
                {order.select_products &&
                  order.select_products.map((product) => (
                    <div
                      key={product.id}
                      style={{ display: "flex", gap: "20px" }}
                    >
                      <Image
                        src={
                          materialList?.find(
                            (material) => material.pk === product.material_id
                          ).product_image || "https://via.placeholder.com/120"
                        }
                        width={70}
                        height={70}
                      />

                      <div>
                        <div>상품: {product.product_name}</div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: "large",
                            }}
                          >
                            {parseInt(order.order_amount).toLocaleString()}
                          </div>
                          <div> | {product.count}개</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </Space>
            </Card>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <Empty />
          </div>
        )}
      </Space>
    </div>
  );
}

const Material = ({ pk, materialList }) => {
  useEffect(() => {
    let data = materialList.find((material) => material.pk === pk);
    console.log(data);
  }, []);

  return <></>;
};

export default OrderList;
