import React, { useEffect, useState } from "react";
import { Space, Image } from "antd";

import { AxiosGet } from "../../api";
import { Descriptions } from "antd/lib";

const OrderDetail = ({ selectedAlarm }) => {
  const [order, setOrder] = useState();
  const [branch, setBranch] = useState();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await AxiosGet("/orders/" + selectedAlarm.order_pk);
        const order = response.data;
        console.log(order);
        setOrder(order);

        let res = await AxiosGet("/branches/" + order.branch_pk);
        const branch = res.data;
        setBranch(branch);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrder();
  }, []);

  return (
    <Descriptions title={""} bordered column={2}>
      <Descriptions.Item span={2} label="주문내용">
        {selectedAlarm?.alarm_content}
      </Descriptions.Item>
      <Descriptions.Item label="주문지점">
        {branch?.branch_name}
      </Descriptions.Item>
      <Descriptions.Item span={2} label="주문번호">
        {order?.order_code}
      </Descriptions.Item>
      <Descriptions.Item label="주문일시">
        {order?.created_at ? new Date(order?.created_at).toLocaleString() : ""}
      </Descriptions.Item>
      <Descriptions.Item label="주문금액">
        {order?.order_amount.toLocaleString()}원
      </Descriptions.Item>
      {/* <Descriptions.Item span={2} label="주문상태">
        <Tag>
          {order?.order_status === 0
            ? "결제대기"
            : order?.order_status === 1
            ? "결제완료"
            : "주문취소"}
        </Tag>
      </Descriptions.Item> */}
      <Descriptions.Item span={2} label="주문상세">
        {order?.select_products?.map((product, index) => (
          <Space>
            <Image
              src={product.blind_image || "https://via.placeholder.com/120"}
              alt={product.product_name}
              width={60}
              height={60}
            />
            <div key={index}>
              <div>{product.product_name}</div>
              {product.option?.map((option, index) => (
                <div key={index}>
                  {option.optionName} : {option.optionValue}
                </div>
              ))}
              <div style={{ opacity: "0.5", fontSize: "small" }}>
                {parseInt(product.amount).toLocaleString("ko-KR")}원 |{" "}
                {product.count}개
              </div>
            </div>
          </Space>
        ))}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default OrderDetail;
