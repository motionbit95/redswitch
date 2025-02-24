const admin = require("firebase-admin");
const database = admin.database();
const ordersRef = database.ref("orders");

class Orders {
  constructor(data) {
    this.id = data.id || null; // 주문 ID
    this.payment_pk = data.payment_pk; // 결제 PK
    this.branch_pk = data.branch_pk; // 지점 PK
    this.order_code = data.order_code; // 주문 코드
    this.customer_id = data.customer_id; // 고객 ID
    this.customer_phone = data.customer_phone; // 고객 전화번호
    this.customer_address = data.customer_address; // 고객 주소
    this.select_products = data.select_products || []; // 선택된 상품들
    this.order_status = data.order_status; // 주문 상태
    this.created_at = data.created_at || new Date().toISOString(); // 생성 시간
    this.updated_at = data.updated_at || null; // 수정 시간
    this.order_amount = data.order_amount; // 주문 금액
    this.goods_name = data.goods_name; // 상품명
    this.delivery_message = data.delivery_message || null; // 배송 메시지
    this.checked = data.checked || 0;
  }

  // JSON으로 변환
  toJSON() {
    return {
      id: this.id,
      payment_pk: this.payment_pk,
      branch_pk: this.branch_pk,
      order_code: this.order_code,
      customer_id: this.customer_id,
      customer_phone: this.customer_phone,
      customer_address: this.customer_address,
      select_products: this.select_products,
      order_status: this.order_status,
      created_at: this.created_at,
      updated_at: this.updated_at,
      order_amount: this.order_amount,
      goods_name: this.goods_name,
      delivery_message: this.delivery_message,
      checked: this.checked,
    };
  }

  // 주문 생성
  async create() {
    try {
      const newOrderRef = ordersRef.push(); // 새 노드 생성
      this.id = newOrderRef.key; // 고유 ID 할당
      await newOrderRef.set(this.toJSON()); // 데이터 저장
      return this;
    } catch (error) {
      console.error("주문 생성 오류:", error);
      throw new Error("주문 생성 실패");
    }
  }

  // ID로 주문 조회
  static async getById(id) {
    try {
      const snapshot = await ordersRef.child(id).once("value"); // ID로 데이터 가져오기
      if (!snapshot.exists()) {
        throw new Error("해당 ID의 주문을 찾을 수 없음");
      }
      return { id: snapshot.key, ...snapshot.val() }; // 주문 데이터 반환
    } catch (error) {
      console.error("주문 조회 오류:", error);
      throw new Error("주문 조회 실패");
    }
  }

  // 모든 주문 조회
  static async getAll() {
    try {
      const snapshot = await ordersRef.once("value"); // 전체 데이터 가져오기
      if (!snapshot.exists()) {
        return [];
      }
      const orders = [];
      snapshot.forEach((child) => {
        orders.push({ id: child.key, ...child.val() }); // 모든 주문 추가
      });
      return orders.reverse();
    } catch (error) {
      console.error("주문 목록 조회 오류:", error);
      throw new Error("주문 목록 조회 실패");
    }
  }

  // 주문 업데이트
  async update() {
    try {
      if (!this.id) {
        throw new Error("주문 ID가 필요합니다.");
      }
      this.updatedAt = new Date().toISOString(); // 수정 시간 업데이트
      await ordersRef.child(this.id).update(this.toJSON()); // 데이터베이스 업데이트
      console.log("주문 업데이트 성공 : ", this);
      return this;
    } catch (error) {
      console.error("주문 업데이트 오류:", error);
      throw new Error("주문 업데이트 실패");
    }
  }

  // 주문 삭제
  static async deleteById(id) {
    try {
      const snapshot = await ordersRef.child(id).once("value"); // 데이터 존재 확인
      if (!snapshot.exists()) {
        throw new Error("삭제할 주문을 찾을 수 없음");
      }
      await ordersRef.child(id).remove(); // 데이터 삭제
      return { message: "주문이 성공적으로 삭제되었습니다." };
    } catch (error) {
      console.error("주문 삭제 오류:", error);
      throw new Error("주문 삭제 실패");
    }
  }

  // 특정 order_code로 주문 조회
  static async getByOrderCode(orderCode) {
    try {
      const snapshot = await ordersRef
        .orderByChild("order_code")
        .equalTo(orderCode)
        .once("value");
      if (!snapshot.exists()) {
        return null; // 데이터가 없으면 null 반환
      }

      // 첫 번째 일치 항목 반환
      const [key, value] = Object.entries(snapshot.val())[0];
      return { id: key, ...value };
    } catch (error) {
      console.error("order_code로 주문 조회 오류:", error);
      throw new Error("주문 조회에 실패했습니다.");
    }
  }

  static async findOrderByCustomerId(customerId) {
    if (!customerId) {
      throw new Error("customerId는 필수입니다.");
    }

    try {
      const snapshot = await ordersRef.once("value"); // Firebase에서 전체 주문 데이터 가져오기
      const ordersList = [];

      snapshot.forEach((childSnapshot) => {
        ordersList.push(
          new Orders({ id: childSnapshot.key, ...childSnapshot.val() })
        );
      });

      return ordersList
        .filter((order) => order.customer_id === customerId)
        .reverse();
    } catch (error) {
      console.error("주문 조회 오류:", error);
      throw new Error("주문 조회 실패");
    }
  }
}

module.exports = Orders;
