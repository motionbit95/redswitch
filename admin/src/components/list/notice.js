import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Skeleton } from "antd";
import { AxiosGet } from "../../api";
import { NoticeDetailModal } from "../../pages/post/post";
import { useNavigate } from "react-router-dom";
const count = 5;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

// 현재 로그인 사용자 (더미 데이터)
const currentUser = {
  id: "-OCRwtnmaTllsx2c3OWM", // -OCRwmUYTeUtxH-auNvx
  user_id: "krystal", // redswitch
  user_name: "박수정",
  permission: "2", // 1
};

const NoticeList = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentNotice, setCurrentNotice] = useState(null);

  useEffect(() => {
    AxiosGet("/posts")
      .then((res) => {
        console.log(res.data);
        setNotices(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onLoadMore = () => {
    navigate("/post/notification");
  };
  const loadMore =
    notices.length > 5 ? (
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
        dataSource={notices}
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
                      setCurrentNotice(item);
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
      <NoticeDetailModal
        isDetailModalVisible={isDetailModalVisible}
        setIsDetailModalVisible={setIsDetailModalVisible}
        currentNotice={currentNotice}
        setCurrentNotice={setCurrentNotice}
        setNotices={setNotices}
        currentUser={currentUser}
        notices={notices}
      />
    </>
  );
};
export default NoticeList;
