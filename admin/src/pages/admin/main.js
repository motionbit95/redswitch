import { Button, Calendar, Card, Col, List, Row, Space } from "antd";
import React from "react";
import RCalendar from "../../components/calendar";
import NoticeList from "../../components/list/notice";
import FranchiseList from "../../components/list/franchise";
import SalesList from "../../components/list/sales";
import InquiryList from "../../components/list/inquiry";

const Main = () => {
  const [dateRange, setDateRange] = React.useState(null);
  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <SalesList dateRange={dateRange} />
          </Col>
          <Col span={24}>
            {/* <Card title="공지사항">
              <NoticeList />
            </Card> */}
          </Col>
          <Col span={24}>
            <Card title="게시판">
              <InquiryList />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="가맹점신청">
              <FranchiseList />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={12}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <RCalendar setDateRange={setDateRange} />
          </Col>
          {/* <Col span={12}>
            <Card title="메뉴얼">
              <List></List>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="영상바로가기">
              <List></List>
            </Card>
          </Col> */}
        </Row>
      </Col>
      <Col span={12}>
        <Card title="메뉴얼">
          <List></List>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="영상바로가기">
          <List></List>
        </Card>
      </Col>
    </Row>
  );
};

export default Main;
