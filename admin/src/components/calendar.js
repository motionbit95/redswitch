import { Calendar, ConfigProvider, Space, Typography } from "antd";
import React from "react";
import locale from "antd/lib/locale/ko_KR"; // 우린 한국인이니까 ko_KR를 불러옵시다
// The default locale is en-US, if you want to use other locale, just set locale in entry file globally.
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

const getListData = (value) => {
  let listData;
  return listData || [];
};

const getMonthData = (value) => {};

const RCalendar = () => {
  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? <div></div> : null;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <div flex={1}>
        <Space direction="vertical">
          {listData.map((item, index) => (
            <Space key={index}>
              <Typography.Text>
                {parseInt(item.content).toLocaleString()}
              </Typography.Text>
            </Space>
          ))}
        </Space>
      </div>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return (
    <ConfigProvider locale={locale}>
      <Calendar cellRender={cellRender} />
    </ConfigProvider>
  );
};

export default RCalendar;
