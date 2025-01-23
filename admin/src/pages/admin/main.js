import { Card, Col, List, Row } from "antd";
import React, { useEffect, useState } from "react";
import RCalendar from "../../components/calendar";
import FranchiseList from "../../components/list/franchise";
import SalesList from "../../components/list/sales";
import InquiryList from "../../components/list/inquiry";
import useSelectedBranch from "../../hook/useSelectedBranch";

/**
 * Main 대시보드 컴포넌트
 * @param {Object} props
 * @param {Object} props.currentUser 현재 로그인된 사용자 정보
 * @returns React Component
 */
const Main = ({ currentUser }) => {
  const [dateRange, setDateRange] = useState(null); // 선택된 날짜 범위 상태
  const { selectedBranch, setSelectedBranch } = useSelectedBranch();

  return (
    <Row gutter={[16, 16]}>
      {/* 좌측 컬럼 */}
      <Col span={12}>
        <Row gutter={[16, 16]}>
          {/* 매출 리스트 */}
          <Col span={24}>
            <SalesList dateRange={dateRange} selectedBranch={selectedBranch} />
          </Col>

          {/* 게시판 */}
          <Col span={24}>
            <Card title="게시판">
              <InquiryList
                selectedBranch={selectedBranch}
                currentUser={currentUser}
              />
            </Card>
          </Col>

          {/* 가맹점 신청 */}
          {(currentUser.permission === "1" ||
            currentUser.permission === "2") && (
            <Col span={24}>
              <Card title="가맹점 신청">
                <FranchiseList />
              </Card>
            </Col>
          )}
        </Row>
      </Col>

      {/* 우측 컬럼 */}
      <Col span={12}>
        <Row gutter={[16, 16]}>
          {/* 캘린더 */}
          <Col span={24}>
            <RCalendar currentUser={currentUser} setDateRange={setDateRange} />
          </Col>
        </Row>
      </Col>

      {/* 하단 메뉴얼 및 영상 바로가기 */}
      <Col span={12}>
        <Card title="메뉴얼">
          <List />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="영상 바로가기">
          <List />
        </Card>
      </Col>
    </Row>
  );
};

export default Main;
