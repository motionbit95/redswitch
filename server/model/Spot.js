const admin = require("firebase-admin");
const db = admin.database();
const spotsRef = db.ref("spots");

class Spot {
  constructor(data) {
    this.id = data.id || null;
    this.spot_name = data.spot_name || null;
    this.spot_logo = data.spot_logo || null;
    this.spot_image = data.spot_image || null;
    this.install_flag = data.install_flag || 0; // Default to 0 (not installed)
    this.branch_adress = data.branch_adress || null;
  }

  toJSON() {
    return {
      id: this.id,
      spot_name: this.spot_name,
      spot_logo: this.spot_logo,
      spot_image: this.spot_image,
      install_flag: this.install_flag,
      branch_adress: this.branch_adress,
    };
  }

  // Create a new spot
  async create() {
    try {
      const newSpotRef = await spotsRef.push(this.toJSON());
      this.id = newSpotRef.key;
      await newSpotRef.update({ id: this.id });
      return this;
    } catch (error) {
      console.error("Error creating spot:", error);
      throw new Error("Failed to create spot");
    }
  }

  // Get a spot by ID
  static async getByID(id) {
    try {
      const snapshot = await spotsRef.child(id).once("value");
      if (!snapshot.exists()) {
        throw new Error("Spot not found");
      }
      return { id, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching spot:", error);
      throw new Error("Failed to fetch spot");
    }
  }

  // Get all spots
  static async getAll() {
    try {
      const snapshot = await spotsRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const spots = [];
      snapshot.forEach((child) => {
        spots.push({ id: child.key, ...child.val() });
      });
      return spots;
    } catch (error) {
      console.error("Error fetching spots:", error);
      throw new Error("Failed to fetch spots");
    }
  }

  // Update a spot by ID
  async update() {
    try {
      if (!this.id) {
        throw new Error("Spot ID is required for update");
      }

      const updateData = Object.fromEntries(
        Object.entries(this.toJSON()).filter(
          ([_, value]) => value !== undefined
        )
      );

      if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields to update");
      }

      await spotsRef.child(this.id).update(updateData);
      return this;
    } catch (error) {
      console.error("Error updating spot:", error);
      throw new Error("Failed to update spot");
    }
  }

  // Delete a spot by ID
  static async deleteByID(id) {
    try {
      const snapshot = await spotsRef.child(id).once("value");
      if (!snapshot.exists()) {
        throw new Error("Spot not found");
      }
      await spotsRef.child(id).remove();
      return { message: "Spot deleted successfully" };
    } catch (error) {
      console.error("Error deleting spot:", error);
      throw new Error("Failed to delete spot");
    }
  }
}

module.exports = Spot;
