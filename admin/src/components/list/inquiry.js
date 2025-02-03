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
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [filteredInquiries, setFilteredInquiries] = useState([]); // 계정권한 및 지점에 대해 필터된 게시판 목록

  // API를 통해 문의 데이터를 가져옵니다.
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await AxiosGet("/posts/inquiries");
        setInquiries(res.data.slice(0, 5)); // 처음 5개만 가져옴
      } catch (err) {
        console.error("문의 데이터를 가져오는 중 오류 발생:", err);
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };
    fetchInquiries();
  }, []);

  useEffect(() => {
    if (inquiries.length > 0 && currentUser) {
      const filtered = inquiries.filter((inquiry) => {
        // 계정 권한 "1"인 경우 전체 목록을 불러옴
        if (currentUser?.permission === "1") {
          return true;
        }

        // 작성자 필터링: author와 현재 사용자 이름이 같은 경우
        const isAuthorMatch = inquiry?.author === currentUser?.user_id;

        // 지점 필터링: branch_id가 존재하면 현재 사용자의 branch_id와 같아야 함
        const isBranchMatch =
          !inquiry?.branch_id || inquiry?.branch_id === currentUser?.branch_id;

        // 조건에 따라 필터링
        return isAuthorMatch || isBranchMatch;
      });

      setFilteredInquiries(filtered);
      console.log("filteredInquiries", filteredInquiries);
    }
  }, [inquiries, currentUser]); // inquiries와 currentUser가 변경될 때 필터링 실행

  /**
   * 더보기 버튼 클릭 시 처리
   */
  const onLoadMore = () => {
    // 페이지네이션 로직을 사용해서 데이터를 추가로 불러올 수 있음
    // 예: AxiosGet(`/posts/inquiries?page=2`)와 같은 방식
    window.location.replace("/post/inquiry");
  };

  /**
   * 상세 모달 표시 함수
   * @param {Object} inquiry - 선택된 문의
   */
  const showDetailModal = (inquiry) => {
    if (!currentUser) {
      message.error("로그인된 사용자만 열람할 수 있습니다.");
      return;
    }

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
        loading={loading} // 로딩 상태를 전체에 적용
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
        dataSource={filteredInquiries}
        renderItem={(item) => (
          <List.Item>
            <Skeleton title={false} loading={loading} active>
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
        setInquiries={setInquiries} // 업데이트 방식 수정
        currentUser={currentUser}
        inquiries={inquiries} // 'notices' -> 'inquiries'
      />
    </>
  );
};

export default InquiryList;
