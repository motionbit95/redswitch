const admin = require("firebase-admin");
const database = admin.database();
const orderAlarmRef = database.ref("order_alarm"); // 'order_alarm' 경로 참조

/**
 * OrderAlarm 클래스는 주문 알림 데이터를 다루는 역할을 합니다.
 */
class OrderAlarm {
  /**
   * 생성자: 알림 객체를 초기화합니다.
   * @param {Object} data - 알림 데이터
   */
  constructor(data) {
    this.id = data.id || null; // 알림 ID (Firebase에서 생성)
    this.alarm_type = data.alarm_type || "order"; // 알림 타입
    this.alarm_title = data.alarm_title; // 알림 제목
    this.alarm_content = data.alarm_content; // 알림 내용
    this.branch_pk = data.branch_pk; // 지점 PK
    this.order_pk = data.order_pk; // 주문 PK
    this.alarm_status = data.alarm_status || 0; // 알림 상태 (0: 미확인, 1: 확인)
    this.created_at = data.created_at || new Date().toISOString(); // 생성 시간
  }

  /**
   * 객체를 JSON 형태로 변환합니다.
   * @returns {Object} - 알림 데이터를 JSON으로 반환
   */
  toJSON() {
    return {
      id: this.id,
      alarm_type: this.alarm_type,
      alarm_title: this.alarm_title,
      alarm_content: this.alarm_content,
      branch_pk: this.branch_pk,
      order_pk: this.order_pk,
      alarm_status: this.alarm_status,
      created_at: this.created_at,
    };
  }

  /**
   * 새로운 알림을 생성합니다.
   * @returns {OrderAlarm} - 생성된 알림 객체
   */
  async create() {
    try {
      const newAlarmRef = await orderAlarmRef.push(this.toJSON());
      this.id = newAlarmRef.key; // Firebase에서 생성된 키 할당
      await newAlarmRef.update({ id: this.id }); // id 필드를 업데이트
      return this;
    } catch (error) {
      console.error("알림 생성 오류:", error);
      throw new Error("알림 생성 실패");
    }
  }

  /**
   * ID로 알림을 조회합니다.
   * @param {string} id - 알림 ID
   * @returns {Object} - 조회된 알림 데이터
   */
  static async getById(id) {
    try {
      const snapshot = await orderAlarmRef.child(id).once("value");
      if (!snapshot.exists()) {
        throw new Error("알림을 찾을 수 없습니다.");
      }
      return { id, ...snapshot.val() };
    } catch (error) {
      console.error("알림 조회 오류:", error);
      throw new Error("알림 조회 실패");
    }
  }

  /**
   * 모든 알림 데이터를 조회합니다.
   * @returns {Array} - 알림 데이터 배열
   */
  static async getAll() {
    try {
      const snapshot = await orderAlarmRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const alarms = [];
      snapshot.forEach((child) => {
        alarms.push({ id: child.key, ...child.val() });
      });
      return alarms.reverse();
    } catch (error) {
      console.error("알림 목록 조회 오류:", error);
      throw new Error("알림 목록 조회 실패");
    }
  }

  /**
   * 알림 데이터를 업데이트합니다.
   * @returns {OrderAlarm} - 업데이트된 알림 객체
   */
  async update() {
    try {
      if (!this.id) {
        throw new Error("알림 ID가 필요합니다.");
      }

      // 업데이트 데이터를 필터링하여 undefined 필드 제거
      const updateData = Object.fromEntries(
        Object.entries(this.toJSON()).filter(([, value]) => value !== undefined)
      );

      if (Object.keys(updateData).length === 0) {
        throw new Error("업데이트할 필드가 없습니다.");
      }

      await orderAlarmRef.child(this.id).update(updateData);
      return this;
    } catch (error) {
      console.error("알림 업데이트 오류:", error);
      throw new Error("알림 업데이트 실패");
    }
  }

  /**
   * ID로 알림 데이터를 삭제합니다.
   * @param {string} id - 알림 ID
   * @returns {Object} - 삭제 결과 메시지
   */
  static async deleteById(id) {
    try {
      const snapshot = await orderAlarmRef.child(id).once("value");
      if (!snapshot.exists()) {
        throw new Error("삭제할 알림을 찾을 수 없습니다.");
      }
      await orderAlarmRef.child(id).remove();
      return { message: "알림이 성공적으로 삭제되었습니다." };
    } catch (error) {
      console.error("알림 삭제 오류:", error);
      throw new Error("알림 삭제 실패");
    }
  }
}

module.exports = OrderAlarm;
