const admin = require("firebase-admin");
const database = admin.database();
const cartRef = database.ref("carts");

const areObjectsEqual = (obj1, obj2) => {
  // obj1 또는 obj2가 배열이고, 빈 배열이라면 true 반환
  if (
    (Array.isArray(obj1) && obj1.length === 0 && obj2 === undefined) ||
    (Array.isArray(obj2) && obj2.length === 0 && obj1 === undefined)
  ) {
    return true;
  }

  // 기본적인 객체 비교: JSON.stringify로 변환하여 비교
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

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

  // Get a cart item by its primary key (pk)
  static async getByPk(pk) {
    try {
      const snapshot = await cartRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Cart item not found");
      }
      return { pk: snapshot.key, ...snapshot.val() }; // Return the cart item data
    } catch (error) {
      console.error("Error fetching cart item:", error);
      throw new Error("Failed to fetch cart item");
    }
  }
  // Create or Update a cart item
  static async createOrUpdate(cartData) {
    try {
      // 이미 장바구니에 해당 상품이 있는지 확인
      const existingCartItems = await Cart.getAllByToken(cartData.token);
      const existingItem = existingCartItems.find(
        (item) =>
          item.product_pk === cartData.product_pk &&
          areObjectsEqual(item.option, cartData.option)
      );

      existingCartItems.find((item) =>
        areObjectsEqual(item.option, cartData.option)
      );

      if (existingItem) {
        // 해당 상품이 이미 장바구니에 있으면 수량만 업데이트
        existingItem.count += cartData.count; // 기존 수량에 새로운 수량을 더함

        // 업데이트된 장바구니 항목을 저장
        const updatedCart = new Cart(existingItem);
        await updatedCart.update(); // update 메서드 호출
        return updatedCart;
      } else {
        // 장바구니에 해당 상품이 없으면 새 항목 생성
        console.log("cartData", cartData);
        const newCartItem = new Cart(cartData);
        return await newCartItem.create();
      }
    } catch (error) {
      console.error("Error creating or updating cart item:", error);
      throw new Error("Failed to create or update cart item");
    }
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

  // Update a cart item
  async update() {
    try {
      if (!this.pk) {
        throw new Error("Cart PK is required for update");
      }
      const cartData = this.toJSON(); // Convert data to JSON
      await cartRef.child(this.pk).update(cartData); // Update the database with the new cart data
      return this;
    } catch (error) {
      console.error("Error updating cart:", error);
      throw new Error("Failed to update cart item");
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
