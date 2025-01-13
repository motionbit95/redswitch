import React, { useEffect } from "react";
import { NotificationOutlined, CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Space,
  Badge,
  Popover,
  Typography,
  List,
  Tabs,
  Row,
  Col,
} from "antd";
import TabPane from "antd/es/tabs/TabPane";
import NoticeList from "../list/notice";

const NoticeDetail = (props) => {
  const { alarms, handleAlarmClick, openPopover, setOpenPopover } = props;
  const [badge_cnt, setBadgeCnt] = React.useState(0);
  useEffect(() => {
    if (openPopover) {
      alarms?.forEach((element) => {
        if (element.alarm_status === 0) {
          setBadgeCnt(badge_cnt + 1);
        }
      });
    }
  }, [openPopover]);
  return (
    <Space style={{ marginTop: "5px" }}>
      <Popover
        open={openPopover}
        overlayStyle={{ width: 400 }}
        placement="bottomRight"
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography.Text style={{ fontSize: "18px", fontWeight: "bold" }}>
              알림
            </Typography.Text>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setOpenPopover(false)}
            />
          </div>
        }
        content={
          <Tabs defaultActiveKey="1" centered>
            <TabPane tab="공지사항" key="1">
              <NoticeList />
            </TabPane>
            <TabPane tab="주문" key="2">
              <List
                dataSource={alarms.slice(0, 5)}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => handleAlarmClick(item)}
                    style={{
                      backgroundColor:
                        item.alarm_status === 0 ? "lightred" : "white",
                    }}
                  >
                    <Row
                      style={{
                        width: "100%",

                        justifyContent: "space-between",
                      }}
                      gutter={6}
                    >
                      <Col span={16}>
                        <div style={{ fontWeight: "bold" }}>
                          {item.alarm_title}
                        </div>
                        <div style={{ fontSize: "12px", opacity: "0.7" }}>
                          {item.alarm_content}
                        </div>
                      </Col>
                      <Col span={8} style={{ textAlign: "right" }}>
                        <Space>
                          <div style={{ opacity: "0.7" }}>
                            {new Date(item.created_at).toLocaleTimeString()}
                          </div>
                          {/* <Button
                                      style={{ border: "none" }}
                                      icon={<CloseOutlined />}
                                    /> */}
                        </Space>
                      </Col>
                    </Row>
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>
        }
        trigger="click"
      >
        <Badge
          count={badge_cnt}
          size="small"
          onClick={() => setOpenPopover(true)}
        >
          <NotificationOutlined
            style={{
              fontSize: "20px",
              color: "white",
              cursor: "pointer",
            }}
          />
        </Badge>
      </Popover>
    </Space>
  );
};

export default NoticeDetail;
