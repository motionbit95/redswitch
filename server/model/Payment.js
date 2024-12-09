const admin = require("firebase-admin");
const database = admin.database();
const paymentsRef = database.ref("payments"); // 'payments' 경로 참조

class Payment {
  constructor(data) {
    this.pk = data.pk || null;
    this.tid = data.tid || null;
    this.ediDate = data.ediDate || null;
    this.ordNo = data.ordNo || null;
    this.goodsAmt = data.goodsAmt || null;
    this.cancelYN = data.cancelYN || null;
    this.payMethod = data.payMethod || null;
    this.appNo = data.appNo || null;
  }

  toJSON() {
    return {
      pk: this.pk,
      tid: this.tid,
      ediDate: this.ediDate,
      ordNo: this.ordNo,
      goodsAmt: this.goodsAmt,
      cancelYN: this.cancelYN,
      payMethod: this.payMethod,
      appNo: this.appNo,
    };
  }

  // Create a new payment
  async create() {
    try {
      const newPaymentRef = await paymentsRef.push(this.toJSON());
      this.pk = newPaymentRef.key;
      await newPaymentRef.update({ pk: this.pk });
      return this;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw new Error("Failed to create payment");
    }
  }

  // Get a payment by ID
  static async getById(pk) {
    try {
      const snapshot = await paymentsRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Payment not found");
      }
      return { pk, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching payment:", error);
      throw new Error("Failed to fetch payment");
    }
  }

  // Get all payments
  static async getAll() {
    try {
      const snapshot = await paymentsRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const payments = [];
      snapshot.forEach((child) => {
        payments.push({ pk: child.key, ...child.val() });
      });
      return payments;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw new Error("Failed to fetch payments");
    }
  }

  // Update a payment by ID
  async update() {
    try {
      if (!this.pk) {
        throw new Error("Payment ID (pk) is required for update");
      }
      await paymentsRef.child(this.pk).update(this.toJSON());
      return this;
    } catch (error) {
      console.error("Error updating payment:", error);
      throw new Error("Failed to update payment");
    }
  }

  // Delete a payment by ID
  static async deleteById(pk) {
    try {
      const snapshot = await paymentsRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Payment not found");
      }
      await paymentsRef.child(pk).remove();
      return { message: "Payment deleted successfully" };
    } catch (error) {
      console.error("Error deleting payment:", error);
      throw new Error("Failed to delete payment");
    }
  }
}

module.exports = Payment;
