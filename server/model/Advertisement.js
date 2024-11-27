const admin = require("firebase-admin");
const db = admin.database();
const advertisementsRef = db.ref("advertisements");

class Advertisement {
  constructor(data) {
    this.pk = data.pk || null;
    this.banner_advertiser = data.banner_advertiser;
    this.banner_image = data.banner_image;
    this.banner_site = data.banner_site || null;
    this.banner_position = data.banner_position;
    this.manager_phone = data.manager_phone || null;
    this.manager_name = data.manager_name || null;
    this.brn = data.brn || null;
    this.business_file = data.business_file || null;
    this.amount = data.amount || null;
    this.active_datetime = data.active_datetime;
    this.expire_datetime = data.expire_datetime;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || null;
  }

  toJSON() {
    return {
      banner_advertiser: this.banner_advertiser,
      banner_image: this.banner_image,
      banner_site: this.banner_site,
      banner_position: this.banner_position,
      manager_phone: this.manager_phone,
      manager_name: this.manager_name,
      brn: this.brn,
      business_file: this.business_file,
      amount: this.amount,
      active_datetime: this.active_datetime,
      expire_datetime: this.expire_datetime,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Create a new advertisement
  async create() {
    try {
      const newAdRef = await advertisementsRef.push(this.toJSON());
      this.pk = newAdRef.key;
      await newAdRef.update({ pk: this.pk });
      return this;
    } catch (error) {
      console.error("Error creating advertisement:", error);
      throw new Error("Failed to create advertisement");
    }
  }

  // Get an advertisement by PK
  static async getByPK(pk) {
    try {
      const snapshot = await advertisementsRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Advertisement not found");
      }
      return { pk, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching advertisement:", error);
      throw new Error("Failed to fetch advertisement");
    }
  }

  // Get all advertisements
  static async getAll() {
    try {
      const snapshot = await advertisementsRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const ads = [];
      snapshot.forEach((child) => {
        ads.push({ pk: child.key, ...child.val() });
      });
      return ads;
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      throw new Error("Failed to fetch advertisements");
    }
  }

  // Update an advertisement by PK
  async update() {
    try {
      if (!this.pk) {
        throw new Error("Advertisement PK is required for update");
      }

      this.updated_at = new Date().toISOString();

      const updateData = Object.fromEntries(
        Object.entries(this.toJSON()).filter(
          ([_, value]) => value !== undefined
        )
      );

      if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields to update");
      }

      await advertisementsRef.child(this.pk).update(updateData);
      return this;
    } catch (error) {
      console.error("Error updating advertisement:", error);
      throw new Error("Failed to update advertisement");
    }
  }

  // Delete an advertisement by PK
  static async deleteByPK(pk) {
    try {
      const snapshot = await advertisementsRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Advertisement not found");
      }
      await advertisementsRef.child(pk).remove();
      return { message: "Advertisement deleted successfully" };
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      throw new Error("Failed to delete advertisement");
    }
  }
}

module.exports = Advertisement;
