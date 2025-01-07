import React, { useEffect, useState } from "react";
import { Avatar, Button, List, message, Skeleton } from "antd";
import { AxiosGet } from "../../api";
import { InquiryDetailModal } from "../../pages/post/inquiry";

/**
 * 문의 리스트 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {Object} props.currentUser - 현재 로그인한 사용자 정보
 */
const InquiryList = ({ currentUser }) => {
  const [inquiries, setInquiries] = useState([]); // 문의 목록 상태
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); // 상세 모달 가시성 상태
  const [currentInquiry, setCurrentInquiry] = useState(null); // 현재 선택된 문의

  // API를 통해 문의 데이터를 가져옵니다.
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await AxiosGet("/posts/inquiries");
        setInquiries(res.data);
      } catch (err) {
        console.error("문의 데이터를 가져오는 중 오류 발생:", err);
      }
    };

    fetchInquiries();
  }, []);

  /**
   * 더보기 버튼 클릭 시 처리
   */
  const onLoadMore = () => {
    window.location.replace("/post/inquiry");
  };

  /**
   * 상세 모달 표시 함수
   * @param {Object} inquiry - 선택된 문의
   */
  const showDetailModal = (inquiry) => {
    const hasAccess =
      (inquiry.allowedUsers && inquiry.allowedUsers.includes(currentUser.id)) ||
      inquiry.author === currentUser.user_id;

    if (!hasAccess) {
      message.error("열람 권한이 없습니다.");
      return;
    }

    setCurrentInquiry(inquiry);
    setIsDetailModalVisible(true);
  };

  return (
    <>
      <List
        className="inquiry-list"
        itemLayout="horizontal"
        loadMore={
          inquiries.length > 0 && (
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
          )
        }
        dataSource={inquiries}
        renderItem={(item) => (
          <List.Item>
            <Skeleton title={false} loading={item.loading} active>
              <List.Item.Meta
                title={
                  <a
                    style={{ color: "black", fontWeight: "bold" }}
                    onClick={() => showDetailModal(item)}
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
