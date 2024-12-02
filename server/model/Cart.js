const admin = require("firebase-admin");
const database = admin.database();
const cartRef = database.ref("carts"); // 'branches' 경로 참조

class Cart {
  constructor(data) {
    this.pk = data.pk || null; // 기본 키
    this.token = data.token; // 주문자 토큰
    this.createdAt = data.created_at || new Date().toISOString(); // 생성 시간
    this.productPk = data.product_pk; // 상품 ID
    this.count = data.count || 1; // 구매 수량 (기본값 1)
    this.branchPk = data.branch_pk; // 지점 ID
    this.amount = data.amount; // 총 금액
    this.option = data.option || []; // 옵션 배열
  }

  toJSON() {
    return {
      pk: this.pk,
      token: this.token,
      created_at: this.createdAt,
      product_pk: this.productPk,
      count: this.count,
      branch_pk: this.branchPk,
      amount: this.amount,
      option: this.option,
    };
  }

  // Create a new cart item
  async create() {
    try {
      const newCartRef = await cartRef.push(this.toJSON()); // 데이터베이스에 저장
      this.pk = newCartRef.key; // 키 저장
      await newCartRef.update({ pk: this.pk }); // pk 업데이트
      return this;
    } catch (error) {
      console.error("Error creating cart:", error);
      throw new Error("Failed to create cart item");
    }
  }

  // Get a cart item by PK
  static async getByPk(pk) {
    try {
      const snapshot = await cartRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Cart item not found");
      }
      const cartData = snapshot.val();
      return new Cart(cartData); // Cart 인스턴스 생성
    } catch (error) {
      console.error("Error fetching cart item:", error);
      throw new Error("Failed to fetch cart item");
    }
  }

  // Get all cart items for a specific token
  static async getAllByToken(token) {
    try {
      const snapshot = await cartRef
        .orderByChild("token")
        .equalTo(token)
        .once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const cartItems = [];
      snapshot.forEach((child) => {
        cartItems.push({ pk: child.key, ...child.val() });
      });
      return cartItems;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      throw new Error("Failed to fetch cart items");
    }
  }

  // Update a cart item
  async update() {
    try {
      if (!this.pk) {
        throw new Error("Cart PK is required for update");
      }
      const cartData = this.toJSON(); // 데이터를 JSON으로 변환
      await cartRef.child(this.pk).update(cartData); // 데이터베이스 업데이트
      return this;
    } catch (error) {
      console.error("Error updating cart:", error);
      throw new Error("Failed to update cart item");
    }
  }

  // Delete a cart item by PK
  static async deleteByPk(pk) {
    try {
      const snapshot = await cartRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Cart item not found");
      }
      await cartRef.child(pk).remove(); // 데이터베이스에서 제거
      return { message: "Cart item deleted successfully" };
    } catch (error) {
      console.error("Error deleting cart:", error);
      throw new Error("Failed to delete cart item");
    }
  }
}

module.exports = Cart;
