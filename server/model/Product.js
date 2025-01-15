// 상품 카테고리, 물자, 상품, 재고를 관리합니다.

const admin = require("firebase-admin");
const database = admin.database();
const categoriesRef = database.ref("categories"); // 'categories' 경로 참조
const materialsRef = database.ref("materials"); // 'materials' 경로 참조
const productsRef = database.ref("products"); // 'products' 경로 참조
const orderingHistoryRef = database.ref("ordering_history"); // 'ordering_history' 경로 참조
const orderingProductRef = database.ref("ordering_product"); // 'ordering_product' 경로 참조
const inventoryRef = database.ref("inventory"); // 'inventory' 경로 참조

async function generateUniqueIndex(ref) {
  const snapshot = await ref.orderByKey().limitToLast(1).once("value");
  const lastItem = snapshot.val();
  console.log("lastItem: ", lastItem);

  let newIndex = "00001"; // 기본값
  if (lastItem) {
    const lastKey = Object.keys(lastItem)[0]; // 마지막 키 가져오기
    console.log("lastKey:", lastKey);
    const lastIndex = parseInt(lastKey, 10); // 숫자로 변환

    if (!isNaN(lastIndex)) {
      // 키가 숫자라면 인덱스 생성
      newIndex = (lastIndex + 1).toString().padStart(5, "0");
    } else {
      console.warn("Invalid key format:", lastKey);
    }
  } else {
    console.log("No existing data found. Using default index.");
  }

  return newIndex;
}

class Category {
  constructor(data) {
    this.pk = data.pk || null; // 데이터베이스에서 자동 생성됨
    this.product_category = data.product_category;
    this.product_category_code = data.product_category_code;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || null;
  }

  toJSON() {
    return {
      product_category: this.product_category,
      product_category_code: this.product_category_code,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Create a new category
  async create() {
    try {
      const newCategoryRef = await categoriesRef.push(this.toJSON());
      this.pk = newCategoryRef.key;
      await newCategoryRef.update({ pk: this.pk });
      return this;
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error("Failed to create category");
    }
  }

  // Get a category by PK
  static async getByPk(pk) {
    try {
      const snapshot = await categoriesRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Category not found");
      }
      return { pk, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching category:", error);
      throw new Error("Failed to fetch category");
    }
  }

  // Get all categories
  static async getAll() {
    try {
      const snapshot = await categoriesRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const categories = [];
      snapshot.forEach((child) => {
        categories.push({ pk: child.key, ...child.val() });
      });
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  }

  // Update a category by PK
  async update() {
    try {
      if (!this.pk) {
        throw new Error("Category PK is required for update");
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
      await categoriesRef.child(this.pk).update(updateData);

      return this;
    } catch (error) {
      console.error("Error updating category:", error);
      throw new Error("Failed to update category");
    }
  }

  // Delete a category by PK
  static async deleteByPk(pk) {
    try {
      const snapshot = await categoriesRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Category not found");
      }
      await categoriesRef.child(pk).remove();
      return { message: "Category deleted successfully" };
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error("Failed to delete category");
    }
  }
}

// 물자
class Material {
  constructor(data) {
    this.pk = data.pk || null; // Firebase에서 자동 생성됨
    this.product_code = data.product_code || "A01010001"; // 기본 상품 코드
    this.product_name = data.product_name;
    this.product_price = data.product_price;
    this.provider_name = data.provider_name;
    this.product_image = data.product_image || null;
    this.blind_image = data.blind_image || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || null;
    this.provider_code = data.provider_code;
    this.product_category_code = data.product_category_code;
    this.provider_id = data.provider_id;
    this.product_detail_image = data.product_detail_image || null;
  }

  toJSON() {
    return {
      product_code: this.product_code,
      product_name: this.product_name,
      product_price: this.product_price,
      provider_name: this.provider_name,
      product_image: this.product_image,
      blind_image: this.blind_image,
      created_at: this.created_at,
      updated_at: this.updated_at,
      provider_code: this.provider_code,
      product_category_code: this.product_category_code,
      provider_id: this.provider_id,
      product_detail_image: this.product_detail_image || null,
    };
  }

  // main class의 create 메서드
  async create() {
    try {
      // 고유 인덱스 생성
      const newIndex = await generateUniqueIndex(materialsRef);

      console.log("생성된 상품 인덱스:", newIndex);

      // product_code 생성
      this.product_code = `${this.provider_code}${this.product_category_code}${newIndex}`;

      console.log("생성된 상품 코드:", this.product_code);

      // 새로운 데이터 저장
      await materialsRef.child(newIndex).set(this.toJSON());
      this.pk = newIndex;

      return this;
    } catch (error) {
      console.error("Error creating material:", error);
      throw new Error("Failed to create material");
    }
  }

  // Get a material by PK
  static async getByPk(pk) {
    try {
      const snapshot = await materialsRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Material not found");
      }
      return { pk, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching material:", error);
      throw new Error("Failed to fetch material");
    }
  }

  // Get all materials
  static async getAll() {
    try {
      const snapshot = await materialsRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const materials = [];
      snapshot.forEach((child) => {
        const material = child.val();
        materials.push({ pk: child.key, ...material });
      });
      return materials;
    } catch (error) {
      console.error("Error fetching materials:", error);
      throw new Error("Failed to fetch materials");
    }
  }

  // Search materials by provider_id
  static async search(provider_id) {
    console.log("provider_id: ", provider_id);
    try {
      const snapshot = await materialsRef
        .orderByChild("created_at")
        .once("value");
      if (!snapshot.exists()) {
        return [];
      }

      const materials = [];
      snapshot.forEach((child) => {
        const material = child.val();
        if (material.provider_id === provider_id) {
          materials.push({ pk: child.key, ...material });
        }
      });

      console.log("materials: ", materials);
      return materials.reverse(); // 역순으로 내보냄 (최신이 제일 위)
    } catch (error) {
      console.error("Error fetching materials:", error);
      throw new Error("Failed to fetch materials");
    }
  }

  // Update a material by PK
  async update() {
    try {
      if (!this.pk) {
        throw new Error("Material PK is required for update");
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

      console.log("updateData: ", this.pk, updateData);

      // 데이터베이스 업데이트
      await materialsRef.child(this.pk).update(updateData);

      return this;
    } catch (error) {
      console.error("Error updating material:", error);
      throw new Error("Failed to update material");
    }
  }

  // Delete a material by PK
  static async deleteByPk(pk) {
    console.log("pk: ", pk);
    try {
      const snapshot = await materialsRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Material not found");
      }
      await materialsRef.child(pk).remove();
      return { message: "Material deleted successfully" };
    } catch (error) {
      console.error("Error deleting material:", error);
      throw new Error("Failed to delete material");
    }
  }
}

class Product {
  constructor(data) {
    this.PK = data.PK || null; // 데이터베이스에서 자동 생성됨
    this.material_id = data.material_id || null;
    this.product_code = data.product_code;
    this.branch_id = data.branch_id;
    this.product_name = data.product_name;
    this.product_price = data.product_price || 0;
    this.product_detail_image = data.product_detail_image; // 상품 상세
    this.blind_image = data.blind_image || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || null;
    this.related_products = data.related_products || [];
    this.additional_fee = data.additional_fee || 0;
    this.options = data.options || [];
    this.product_image = data.product_image || null;
    this.product_category_code = data.product_category_code;
    this.provider_id = data.provider_id || null;
    this.provider_name = data.provider_name || null;
  }

  toJSON() {
    return {
      material_id: this.material_id,
      product_code: this.product_code,
      branch_id: this.branch_id,
      product_name: this.product_name,
      product_price: this.product_price,
      product_detail_image: this.product_detail_image,
      blind_image: this.blind_image,
      created_at: this.created_at,
      updated_at: this.updated_at,
      related_products: this.related_products,
      additional_fee: this.additional_fee,
      options: this.options,
      product_image: this.product_image,
      product_category_code: this.product_category_code,
      provider_id: this.provider_id,
      provider_name: this.provider_name,
    };
  }

  // Create a new product
  async create() {
    console.log("this.toJSON(): ", this.toJSON());
    try {
      const newProductRef = await productsRef.push(this.toJSON());
      this.PK = newProductRef.key;
      await newProductRef.update({ PK: this.PK });
      return this;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error("Failed to create product");
    }
  }

  // Get a product by PK
  static async getByPK(PK) {
    try {
      const snapshot = await productsRef.child(PK).once("value");
      if (!snapshot.exists()) {
        throw new Error("Product not found");
      }
      return { PK, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching product:", error);
      throw new Error("Failed to fetch product");
    }
  }

  // Get all products
  static async getAll() {
    try {
      const snapshot = await productsRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const products = [];
      snapshot.forEach((child) => {
        products.push({ PK: child.key, ...child.val() });
      });
      return products.reverse();
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  }

  // Update a product by PK
  async update() {
    try {
      if (!this.PK) {
        throw new Error("Product PK is required for update");
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

      await productsRef.child(this.PK).update(updateData);
      return this;
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Failed to update product");
    }
  }

  // Delete a product by PK
  static async deleteByPK(PK) {
    try {
      const snapshot = await productsRef.child(PK).once("value");
      if (!snapshot.exists()) {
        throw new Error("Product not found");
      }
      await productsRef.child(PK).remove();
      return { message: "Product deleted successfully" };
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product");
    }
  }

  // search products by branch_id
  static async searchByBranchId(branch_id) {
    try {
      const snapshot = await productsRef
        .orderByChild("branch_id")
        .equalTo(branch_id)
        .once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const products = [];
      snapshot.forEach((child) => {
        products.push({ PK: child.key, ...child.val() });
      });
      return products;
    } catch (error) {
      console.error("Error searching products by branch_id:", error);
      throw new Error("Failed to search products by branch_id");
    }
  }
}

class OrderingHistory {
  constructor(data) {
    this.pk = data.pk || null; // Primary Key
    this.branch_id = data.branch_id;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || null;
    this.arrive = data.arrive || 0;
    this.receving_date = data.receving_date || null;
  }

  toJSON() {
    return {
      branch_id: this.branch_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
      arrive: this.arrive,
      receving_date: this.receving_date,
    };
  }

  // Create a new ordering history entry
  async create() {
    try {
      const newRef = await orderingHistoryRef.push(this.toJSON());
      this.pk = newRef.key;
      await newRef.update({ pk: this.pk });
      return this;
    } catch (error) {
      console.error("Error creating ordering history:", error);
      throw new Error("Failed to create ordering history");
    }
  }

  // Get an ordering history by PK
  static async getByPK(pk) {
    try {
      const snapshot = await orderingHistoryRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Ordering history not found");
      }
      return { pk, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching ordering history:", error);
      throw new Error("Failed to fetch ordering history");
    }
  }

  // Get all ordering history entries
  static async getAll() {
    try {
      const snapshot = await orderingHistoryRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const histories = [];
      snapshot.forEach((childSnapshot) => {
        histories.push({ pk: childSnapshot.key, ...childSnapshot.val() });
      });
      return histories.reverse();
    } catch (error) {
      console.error("Error fetching ordering histories:", error);
      throw new Error("Failed to fetch ordering histories");
    }
  }

  // Update an ordering history entry
  async update() {
    try {
      if (!this.pk) {
        throw new Error("PK is required for update");
      }
      if (this.arrive === 3) {
        this.receving_date = new Date().toISOString();
      }
      this.updated_at = new Date().toISOString();
      const updatedData = Object.fromEntries(
        Object.entries(this.toJSON()).filter(
          ([_, value]) => value !== undefined
        )
      );

      console.log(updatedData);
      await orderingHistoryRef.child(this.pk).update(updatedData);
      return this;
    } catch (error) {
      console.error("Error updating ordering history:", error);
      throw new Error("Failed to update ordering history");
    }
  }

  // Delete an ordering history entry by PK
  static async deleteByPK(pk) {
    try {
      const snapshot = await orderingHistoryRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Ordering history not found");
      }
      await orderingHistoryRef.child(pk).remove();
      return { message: "Ordering history deleted successfully" };
    } catch (error) {
      console.error("Error deleting ordering history:", error);
      throw new Error("Failed to delete ordering history");
    }
  }
}

class OrderingProduct {
  constructor(data) {
    this.pk = data.pk || null; // 데이터베이스에서 자동 생성됨
    this.history_pk = data.history_pk;
    this.ordered_cnt = data.ordered_cnt;
    this.material_pk = data.material_pk;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || null;
  }

  toJSON() {
    return {
      pk: this.pk,
      history_pk: this.history_pk,
      ordered_cnt: this.ordered_cnt,
      material_pk: this.material_pk,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Create a new ordering product
  async create() {
    try {
      const newRef = await orderingProductRef.push(this.toJSON());
      this.pk = newRef.key;
      await newRef.update({ pk: this.pk });
      return this;
    } catch (error) {
      console.error("Error creating ordering product:", error);
      throw new Error("Failed to create ordering product");
    }
  }

  // Get an ordering product by PK
  static async getByPK(pk) {
    try {
      const snapshot = await orderingProductRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Ordering product not found");
      }
      return { pk, ...snapshot.val() };
    } catch (error) {
      console.error("Error fetching ordering product:", error);
      throw new Error("Failed to fetch ordering product");
    }
  }

  // Get all ordering products
  static async getAll() {
    try {
      const snapshot = await orderingProductRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const products = [];
      snapshot.forEach((child) => {
        products.push({ pk: child.key, ...child.val() });
      });
      return products;
    } catch (error) {
      console.error("Error fetching ordering products:", error);
      throw new Error("Failed to fetch ordering products");
    }
  }

  static async getByHistoryPK(history_pk) {
    try {
      if (!history_pk) {
        throw new Error("history_pk is required");
      }

      const snapshot = await orderingProductRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }

      const filteredHistories = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        console.log(data);
        if (data.history_pk === history_pk) {
          filteredHistories.push({ pk: childSnapshot.key, ...data });
        }
      });

      return filteredHistories.reverse(); // 최근 순으로 정렬
    } catch (error) {
      console.error(
        `Error fetching histories for history_pk (${history_pk}):`,
        error
      );
      throw new Error("Failed to fetch histories by history_pk");
    }
  }

  // Update an ordering product by PK
  async update() {
    try {
      if (!this.pk) {
        throw new Error("Ordering product PK is required for update");
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

      await orderingProductRef.child(this.pk).update(updateData);
      return this;
    } catch (error) {
      console.error("Error updating ordering product:", error);
      throw new Error("Failed to update ordering product");
    }
  }

  // Delete an ordering product by PK
  static async deleteByPK(pk) {
    try {
      const snapshot = await orderingProductRef.child(pk).once("value");
      if (!snapshot.exists()) {
        throw new Error("Ordering product not found");
      }
      await orderingProductRef.child(pk).remove();
      return { message: "Ordering product deleted successfully" };
    } catch (error) {
      console.error("Error deleting ordering product:", error);
      throw new Error("Failed to delete ordering product");
    }
  }
}

class Inventory {
  constructor(data) {
    this.pk = data.pk || null; // 데이터베이스에서 자동 생성
    this.inventory_cnt = data.inventory_cnt || null;
    this.inventory_min_cnt = data.inventory_min_cnt || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || null;
    this.product_pk = data.product_pk;
    this.product_code = data.product_code || "A01010001";
    this.branch_id = data.branch_id;
    this.provider_id = data.provider_id || null;
    this.managed = data.isManaged || false;
  }

  toJSON() {
    return {
      inventory_cnt: this.inventory_cnt,
      inventory_min_cnt: this.inventory_min_cnt,
      created_at: this.created_at,
      updated_at: this.updated_at,
      product_pk: this.product_pk,
      product_code: this.product_code,
      branch_id: this.branch_id,
      provider_id: this.provider_id,
      managed: this.managed,
    };
  }

  // Create a new inventory
  async create() {
    try {
      const newRef = await inventoryRef.push(this.toJSON());
      this.pk = newRef.key;
      await newRef.update({ pk: this.pk });
      return this;
    } catch (error) {
      console.error("Inventory 생성 오류:", error);
      throw new Error("Inventory 생성 실패");
    }
  }

  // Get inventory by PK
  static async getByPK(pk) {
    try {
      const snapshot = await inventoryRef.child(pk).once("value");
      if (!snapshot.exists()) throw new Error("Inventory를 찾을 수 없습니다.");
      return { pk, ...snapshot.val() };
    } catch (error) {
      console.error("Inventory 조회 오류:", error);
      throw new Error("Inventory 조회 실패");
    }
  }

  // Get all inventories
  static async getAll() {
    try {
      const snapshot = await inventoryRef.once("value");
      if (!snapshot.exists()) return [];
      const inventories = [];
      snapshot.forEach((child) => {
        inventories.push({ pk: child.key, ...child.val() });
      });
      return inventories;
    } catch (error) {
      console.error("모든 Inventory 조회 오류:", error);
      throw new Error("모든 Inventory 조회 실패");
    }
  }

  // Update inventory by PK
  async update() {
    try {
      if (!this.pk) throw new Error("Inventory PK가 필요합니다.");
      this.updated_at = new Date().toISOString();
      const updateData = Object.fromEntries(
        Object.entries(this.toJSON()).filter(
          ([_, value]) => value !== undefined
        )
      );
      await inventoryRef.child(this.pk).update(updateData);
      return this;
    } catch (error) {
      console.error("Inventory 업데이트 오류:", error);
      throw new Error("Inventory 업데이트 실패");
    }
  }

  // Delete inventory by PK
  static async deleteByPK(pk) {
    try {
      const snapshot = await inventoryRef.child(pk).once("value");
      if (!snapshot.exists()) throw new Error("Inventory를 찾을 수 없습니다.");
      await inventoryRef.child(pk).remove();
      return { message: "Inventory 삭제 성공" };
    } catch (error) {
      console.error("Inventory 삭제 오류:", error);
      throw new Error("Inventory 삭제 실패");
    }
  }
}

module.exports = {
  Category,
  Material,
  Product,
  OrderingHistory,
  OrderingProduct,
  Inventory,
};
