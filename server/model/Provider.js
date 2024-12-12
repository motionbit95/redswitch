const admin = require("firebase-admin");
const database = admin.database();
const providersRef = database.ref("providers"); // 'providers' 경로 참조

class Provider {
  constructor(data) {
    this.id = data.id || null; // 데이터베이스에서 자동 생성됨
    this.provider_name = data.provider_name;
    this.provider_address = data.provider_address;
    this.provider_sido = data.provider_sido;
    this.provider_sigungu = data.provider_sigungu;
    this.provider_code = data.provider_code || "A01"; // 기본값
    this.provider_contact = data.provider_contact;
    this.provider_brn = data.provider_brn;
    this.bankbook_file = data.bankbook_file || null;
    this.bank_account_number = data.bank_account_number || null;
    this.business_file = data.business_file || null;
    this.provider_ceo_name = data.provider_ceo_name;
    this.provider_ceo_phone = data.provider_ceo_phone;
    this.provider_manager_name = data.provider_manager_name || null;
    this.provider_manager_phone = data.provider_manager_phone || null;
    this.provider_description = data.provider_description || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || null;
    this.payment_type = data.payment_type || null;
  }

  toJSON() {
    return {
      provider_name: this.provider_name,
      provider_address: this.provider_address,
      provider_sido: this.provider_sido,
      provider_sigungu: this.provider_sigungu,
      provider_code: this.provider_code,
      provider_contact: this.provider_contact,
      provider_brn: this.provider_brn,
      bankbook_file: this.bankbook_file,
      bank_account_number: this.bank_account_number,
      business_file: this.business_file,
      provider_ceo_name: this.provider_ceo_name,
      provider_ceo_phone: this.provider_ceo_phone,
      provider_manager_name: this.provider_manager_name,
      provider_manager_phone: this.provider_manager_phone,
      created_at: this.created_at,
      updated_at: this.updated_at,
      payment_type: this.payment_type,
    };
  }

  // Create a new provider
  async create() {
    try {
      const newProviderRef = await providersRef.push(this.toJSON());
      this.id = newProviderRef.key;
      await newProviderRef.update({ id: this.id });
      return this;
    } catch (error) {
      console.error("Error creating provider:", error);
      throw new Error("Failed to create provider");
    }
  }

  // Get a provider by ID
  static async getById(id) {
    try {
      const snapshot = await providersRef.child(id).once("value");
      if (!snapshot.exists()) {
        throw new Error("Provider not found");
      }
      return { id, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching provider:", error);
      throw new Error("Failed to fetch provider");
    }
  }

  // Get all providers
  static async getAll() {
    try {
      const snapshot = await providersRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const providers = [];
      snapshot.forEach((child) => {
        providers.push({ id: child.key, ...child.val() });
      });
      return providers;
    } catch (error) {
      console.error("Error fetching providers:", error);
      throw new Error("Failed to fetch providers");
    }
  }

  // Update a provider by ID
  async update() {
    try {
      if (!this.id) {
        throw new Error("Provider ID is required for update");
      }
      this.updated_at = new Date().toISOString();
      await providersRef.child(this.id).update(this.toJSON());
      return this;
    } catch (error) {
      console.error("Error updating provider:", error);
      throw new Error("Failed to update provider");
    }
  }

  // Delete a provider by ID
  static async deleteById(id) {
    try {
      const snapshot = await providersRef.child(id).once("value");
      if (!snapshot.exists()) {
        throw new Error("Provider not found");
      }
      await providersRef.child(id).remove();
      return { message: "Provider deleted successfully" };
    } catch (error) {
      console.error("Error deleting provider:", error);
      throw new Error("Failed to delete provider");
    }
  }
}

module.exports = Provider;
