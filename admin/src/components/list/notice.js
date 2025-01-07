import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Skeleton } from "antd";
import { AxiosGet } from "../../api";
import { NoticeDetailModal } from "../../pages/post/post";
import useCurrentUser from "../../hook/useCurrentUser";

const count = 5;

const NoticeList = () => {
  const [notices, setNotices] = useState([]); // 현재 표시된 알림 목록
  const [allNotices, setAllNotices] = useState([]); // 전체 알림 목록
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentNotice, setCurrentNotice] = useState(null);
  const { currentUser } = useCurrentUser();

  // 알림 데이터 로딩
  useEffect(() => {
    AxiosGet("/posts")
      .then((res) => {
        setAllNotices(res.data); // 전체 알림 데이터를 저장
        setNotices(res.data.slice(0, count)); // 처음 5개만 표시
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 더보기 버튼 클릭 시
  const onLoadMore = () => {
    const nextNotices = allNotices.slice(
      notices.length,
      notices.length + count
    );
    setNotices((prevNotices) => [...prevNotices, ...nextNotices]); // 추가 항목을 리스트에 추가
  };

  // 더보기 버튼 표시
  const loadMore =
    notices.length < allNotices.length ? (
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
              <List.Item.Meta
                title={
                  <a
                    style={{ color: "black", fontWeight: "bold" }}
                    onClick={() => {
                      setCurrentNotice(item);
                      setIsDetailModalVisible(true);
                    }}
                  >
                    {item.title}
                  </a>
                }
                description={item.createdAt.split("T")[0]}
              />
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
