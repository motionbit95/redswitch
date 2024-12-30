import { Button, Calendar, Card, Col, List, Row, Space } from "antd";
import React from "react";
import RCalendar from "../../components/calendar";
import NoticeList from "../../components/list/notice";

const Main = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="월누적매출"></Card>
          </Col>
          <Col span={12}>
            <Card title="전일매출"></Card>
          </Col>
          <Col span={24}>
            <Card title="공지사항">
              <NoticeList />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="게시판">
              <List></List>
            </Card>
          </Col>
          <Col span={24}>
            <Card title="가맹점신청">
              <List></List>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={12}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <RCalendar />
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
      </Col>
    </Row>
  );
};

export default Main;
