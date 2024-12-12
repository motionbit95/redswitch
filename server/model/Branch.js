const admin = require("firebase-admin");
const database = admin.database();
const branchesRef = database.ref("branches"); // 'branches' 경로 참조

class Branch {
  constructor(data) {
    this.id = data.id || null; // 데이터베이스에서 자동 생성됨
    this.branch_name = data.branch_name;
    this.branch_address = data.branch_address;
    this.branch_contact = data.branch_contact;
    this.branch_room_cnt = data.branch_room_cnt;
    this.updated_at = data.updated_at || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.install_flag = data.install_flag || 1; // 기본값
    this.branch_image = data.branch_image || null;
    this.install_image = data.install_image || null;
    this.contract_image = data.contract_image || null;
    this.branch_ceo_name = data.branch_ceo_name || null;
    this.branch_ceo_phone = data.branch_ceo_phone || null;
    this.branch_manager_name = data.branch_manager_name || null;
    this.branch_manager_phone = data.branch_manager_phone || null;
    this.branch_sido = data.branch_sido || null;
    this.branch_sigungu = data.branch_sigungu || null;
    this.branch_description = data.branch_description || null;
  }

  toJSON() {
    return {
      branch_name: this.branch_name,
      branch_address: this.branch_address,
      branch_contact: this.branch_contact,
      branch_room_cnt: this.branch_room_cnt,
      updated_at: this.updated_at,
      created_at: this.created_at,
      install_flag: this.install_flag,
      branch_image: this.branch_image,
      install_image: this.install_image,
      contract_image: this.contract_image,
      branch_ceo_name: this.branch_ceo_name,
      branch_ceo_phone: this.branch_ceo_phone,
      branch_manager_name: this.branch_manager_name,
      branch_manager_phone: this.branch_manager_phone,
      branch_sido: this.branch_sido,
      branch_sigungu: this.branch_sigungu,
    };
  }

  // Create a new branch
  async create() {
    try {
      const newBranchRef = await branchesRef.push(this.toJSON());
      this.id = newBranchRef.key;
      await newBranchRef.update({ id: this.id });
      return this;
    } catch (error) {
      console.error("Error creating branch:", error);
      throw new Error("Failed to create branch");
    }
  }

  // Get a branch by ID
  static async getById(id) {
    try {
      const snapshot = await branchesRef.child(id).once("value");
      if (!snapshot.exists()) {
        throw new Error("Branch not found");
      }
      return { id, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching branch:", error);
      throw new Error("Failed to fetch branch");
    }
  }

  // Get all branches
  static async getAll() {
    try {
      const snapshot = await branchesRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const branches = [];
      snapshot.forEach((child) => {
        branches.push({ id: child.key, ...child.val() });
      });
      return branches;
    } catch (error) {
      console.error("Error fetching branches:", error);
      throw new Error("Failed to fetch branches");
    }
  }

  // Update a branch by ID
  async update() {
    try {
      if (!this.id) {
        throw new Error("Branch ID is required for update");
      }

      // 현재 시간 갱신
      this.updated_at = new Date().toISOString();

      // 객체 데이터를 JSON으로 변환 및 undefined 필드 제거
      const updateData = Object.fromEntries(
        Object.entries(this.toJSON()).filter(
          ([_, value]) => value !== undefined
        )
      );

      if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields to update");
      }

      // 데이터베이스 업데이트
      await branchesRef.child(this.id).update(updateData);

      return this;
    } catch (error) {
      console.error("Error updating branch:", error);
      throw new Error("Failed to update branch");
    }
  }

  // Delete a branch by ID
  static async deleteById(id) {
    try {
      const snapshot = await branchesRef.child(id).once("value");
      if (!snapshot.exists()) {
        throw new Error("Branch not found");
      }
      await branchesRef.child(id).remove();
      return { message: "Branch deleted successfully" };
    } catch (error) {
      console.error("Error deleting branch:", error);
      throw new Error("Failed to delete branch");
    }
  }
}

module.exports = Branch;
