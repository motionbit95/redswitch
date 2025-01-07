import React from "react";
import { Modal, Button, Popconfirm } from "antd";
import OrderDetail from "./orderModal";
import { AxiosPut } from "../../api";

const AlarmModal = ({ selectedAlarm, isVisible, onClose }) => {
  const handleUpdateAlarmStatus = async (status) => {
    try {
      await AxiosPut(`/alarms/${selectedAlarm.id}`, { alarm_status: status });
      console.log("Alarm status updated");
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("Error updating alarm status:", error);
    }
  };

  return (
    <Modal
      centered
      title={selectedAlarm?.alarm_title}
      visible={isVisible}
      onCancel={onClose}
      footer={
        <>
          <Popconfirm
            title="주문을 취소하시겠습니까?"
            onConfirm={() => handleUpdateAlarmStatus(1)}
          >
            <Button>주문 취소</Button>
          </Popconfirm>
          <Button type="primary" onClick={() => handleUpdateAlarmStatus(1)}>
            주문 확인
          </Button>
        </>
      }
      width={600}
      closable={false}
    >
      <OrderDetail selectedAlarm={selectedAlarm} />
    </Modal>
  );
};

export default AlarmModal;
