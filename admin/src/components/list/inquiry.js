import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Skeleton } from "antd";
import { AxiosGet } from "../../api";
import { InquiryDetailModal } from "../../pages/post/inquiry";
const count = 5;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

// 현재 로그인 사용자 (더미 데이터)
const currentUser = {
  id: "-OCRwtnmaTllsx2c3OWM", // -OCRwmUYTeUtxH-auNvx
  user_id: "krystal", // redswitch
  user_name: "박수정",
  permission: "2", // 1
};

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState(null);

  useEffect(() => {
    AxiosGet("/posts/inquiries")
      .then((res) => {
        console.log(res.data);
        setInquiries(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onLoadMore = () => {
    window.location.replace("/post/inquiry");
  };
  const loadMore =
    inquiries.length > 0 ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>더보기</Button>
      </div>
    ) : null;
  return (
    <>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={inquiries}
        renderItem={(item) => (
          <List.Item>
            <Skeleton title={false} loading={item.loading} active>
              <List.Item style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <a
                    style={{ color: "black", fontWeight: "bold" }}
                    onClick={() => {
                      setCurrentInquiry(item);
                      setIsDetailModalVisible(true);
                    }}
                  >
                    {item.title}
                  </a>

                  <div style={{ color: "gray" }}>
                    {item.createdAt.split("T")[0]}
                  </div>
                </div>
              </List.Item>
            </Skeleton>
          </List.Item>
        )}
      />
      <InquiryDetailModal
        isDetailModalVisible={isDetailModalVisible}
        setIsDetailModalVisible={setIsDetailModalVisible}
        currentInquiry={currentInquiry}
        setCurrentInquiry={setCurrentInquiry}
        setNotices={setInquiries}
        currentUser={currentUser}
        notices={inquiries}
      />
    </>
  );
};
export default InquiryList;
