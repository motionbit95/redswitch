const admin = require("firebase-admin");
const database = admin.database();
const postsRef = database.ref("posts"); // 'posts' 경로 참조
const franchisesRef = database.ref("franchises"); // 'franchises' 경로 참조
const inquiryRef = database.ref("inquiries"); // 'inquiries' 경로 참조
const calendarRef = database.ref("calendars"); // 'calendars' 경로 참조

class Post {
  constructor(data) {
    this.id = data.id || null; // 데이터베이스에서 자동 생성됨
    this.title = data.title;
    this.content = data.content;
    this.author = data.author;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.allowedUsers = data.allowedUsers || [];
    this.groups = data.groups || [];
    this.sticky = data.sticky || false;
    this.comments = data.comments || [];
  }

  toJSON() {
    return {
      title: this.title,
      content: this.content,
      author: this.author,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      comments: this.comments,
      allowedUsers: this.allowedUsers,
      groups: this.groups,
      sticky: this.sticky,
      id: this.id,
    };
  }

  // Create a new post
  async create() {
    try {
      const newPostRef = await postsRef.push(this.toJSON());
      this.id = newPostRef.key;
      await newPostRef.update({ id: this.id });
      return this;
    } catch (error) {
      console.error("Error creating post:", error);
      throw new Error("Failed to create post");
    }
  }

  // Get a post by ID, and return an instance of Post
  static async getById(id) {
    try {
      const snapshot = await postsRef.child(id).once("value");
      if (!snapshot.exists()) {
        throw new Error("Post not found");
      }
      const postData = snapshot.val();
      const post = new Post(postData); // Post의 인스턴스로 변환
      post.id = id; // id 필드 추가
      return post;
    } catch (error) {
      console.error("Error fetching post:", error);
      throw new Error("Failed to fetch post");
    }
  }

  // Get all posts
  static async getAll() {
    try {
      const snapshot = await postsRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const posts = [];
      snapshot.forEach((child) => {
        posts.push({ id: child.key, ...child.val() });
      });
      return posts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw new Error("Failed to fetch posts");
    }
  }

  // Update post
  async update() {
    try {
      if (!this.id) {
        throw new Error("Post ID is required for update");
      }
      this.updatedAt = new Date().toISOString(); // 최신 업데이트 시간

      const postData = this.toJSON(); // 객체 데이터를 JSON으로 변환
      await postsRef.child(this.id).update(postData); // 데이터베이스 업데이트
      return this;
    } catch (error) {
      console.error("Error updating post:", error);
      throw new Error("Failed to update post");
    }
  }

  // Delete a post by ID
  static async deleteById(id) {
    try {
      const snapshot = await postsRef.child(id).once("value");
      if (!snapshot.exists()) {
        throw new Error("Post not found");
      }
      await postsRef.child(id).remove();
      return { message: "Post deleted successfully" };
    } catch (error) {
      console.error("Error deleting post:", error);
      throw new Error("Failed to delete post");
    }
  }

  // 댓글 추가
  addComment(comment) {
    // comments가 배열이 아니면 빈 배열로 초기화
    if (!Array.isArray(this.comments)) {
      this.comments = [];
    }
    this.comments.push(comment); // 이제 안전하게 push 사용 가능
  }

  // 댓글 삭제
  deleteComment(commentId) {
    if (this.comments && this.comments.length > 0) {
      this.comments = this.comments.filter(
        (comment) => comment.id !== commentId
      );
    }
  }

  // 댓글 업데이트
  updateComment(commentId, newContent) {
    const comment = this.comments.find((c) => c.id === commentId);
    if (comment) {
      comment.content = newContent;
    }
  }
}

class Inquiry {
  constructor(data) {
    this.id = data.id || null; // 데이터베이스에서 자동 생성됨
    this.title = data.title;
    this.content = data.content;
    this.author = data.author;
    this.branch_id = data.branch_id || null;
    this.allowedUsers = data.allowedUsers || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.sticky = data.sticky || false;
    this.comments = data.comments || [];
  }

  toJSON() {
    return {
      title: this.title,
      content: this.content,
      author: this.author,
      branch_id: this.branch_id,
      allowedUsers: this.allowedUsers,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      comments: this.comments,
      sticky: this.sticky,
      id: this.id,
    };
  }

  // Create a new inquiry
  async create() {
    try {
      const newInquiryRef = await inquiryRef.push(this.toJSON());
      this.id = newInquiryRef.key;
      await newInquiryRef.update({ id: this.id });
      return this;
    } catch (error) {
      console.error("Error creating inquiry:", error);
      throw new Error("Failed to create inquiry");
    }
  }

  // Get a post by ID, and return an instance of Inquiry
  static async getById(id) {
    try {
      const snapshot = await inquiryRef.child(id).once("value");
      if (!snapshot.exists()) {
        throw new Error("Post not found");
      }
      const inquiryData = snapshot.val();
      const inquiry = new Inquiry(inquiryData); // Inquiry의 인스턴스로 변환
      inquiry.id = id; // id 필드 추가
      return inquiry;
    } catch (error) {
      console.error("Error fetching inquiry:", error);
      throw new Error("Failed to fetch inquiry");
    }
  }

  // Get all inquiries
  static async getAll() {
    try {
      const snapshot = await inquiryRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const inquiries = [];
      snapshot.forEach((child) => {
        inquiries.push({ id: child.key, ...child.val() });
      });
      return inquiries;
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      throw new Error("Failed to fetch inquiries");
    }
  }

  // Update inquiries
  async update() {
    try {
      if (!this.id) {
        throw new Error("Post ID is required for update");
      }
      this.updatedAt = new Date().toISOString(); // 최신 업데이트 시간

      const inquiryData = this.toJSON(); // 객체 데이터를 JSON으로 변환
      await inquiryRef.child(this.id).update(inquiryData); // 데이터베이스 업데이트
      return this;
    } catch (error) {
      console.error("Error updating inquiry:", error);
      throw new Error("Failed to update inquiry");
    }
  }

  // Delete a post by ID
  static async deleteById(id) {
    try {
      const snapshot = await inquiryRef.child(id).once("value");
      if (!snapshot.exists()) {
        throw new Error("Post not found");
      }
      await inquiryRef.child(id).remove();
      return { message: "Post deleted successfully" };
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      throw new Error("Failed to delete inquiry");
    }
  }

  // 댓글 추가
  addComment(comment) {
    // comments가 배열이 아니면 빈 배열로 초기화
    if (!Array.isArray(this.comments)) {
      this.comments = [];
    }
    this.comments.push(comment); // 이제 안전하게 push 사용 가능
  }

  // 댓글 삭제
  deleteComment(commentId) {
    if (this.comments && this.comments.length > 0) {
      this.comments = this.comments.filter(
        (comment) => comment.id !== commentId
      );
    }
  }

  // 댓글 업데이트
  updateComment(commentId, newContent) {
    const comment = this.comments.find((c) => c.id === commentId);
    if (comment) {
      comment.content = newContent;
    }
  }
}

class Franchise {
  constructor(data) {
    this.id = data.id || null;
    this.franchise_name = data.franchise_name; // 거래처명
    this.franchise_room_cnt = data.franchise_room_cnt; // 객실수
    this.franchise_address = data.franchise_address; // 거래처 주소
    this.franchise_manager = data.franchise_manager; // 담당자
    this.franchise_manager_phone = data.franchise_manager_phone; // 전화번호
    this.franchise_manager_email = data.franchise_manager_email; // 이메일
    this.flag = data.flag || "0"; // 상태: 상담요청, 상담완료, 계약완료, 설치완료
    this.sales_manager = data.sales_manager || null; // 영업담당자
    this.memo = data.memo || null; // 비고
    this.created_at = data.created_at || new Date().toISOString(); // 생성일
    this.updated_at = data.updated_at || null; // 수정일
  }

  // Convert to plain object before passing to the database
  toJSON() {
    return {
      id: this.id,
      franchise_name: this.franchise_name,
      franchise_room_cnt: this.franchise_room_cnt,
      franchise_address: this.franchise_address,
      franchise_manager: this.franchise_manager,
      franchise_manager_phone: this.franchise_manager_phone,
      franchise_manager_email: this.franchise_manager_email,
      flag: this.flag,
      sales_manager: this.sales_manager,
      memo: this.memo,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Create a new franchise in Firebase Realtime Database
  async create() {
    try {
      // Push the new franchise data to the 'franchises' collection
      const newFranchiseRef = await franchisesRef.push(this.toJSON());

      // Set the generated ID as the franchise ID
      this.id = newFranchiseRef.key;

      // Update the franchise in the database with the generated ID
      await newFranchiseRef.update({ id: this.id });

      return this; // Return the updated franchise instance
    } catch (error) {
      console.error("Error creating franchise:", error);
      throw new Error("Failed to create franchise");
    }
  }

  // Update the franchise data in Firebase
  async update(updatedFields) {
    try {
      if (!this.id) throw new Error("Franchise ID is required for update");

      const franchiseRef = franchisesRef.child(this.id);

      // Fetch the current data from Firebase
      const snapshot = await franchiseRef.once("value");

      if (!snapshot.exists()) throw new Error("Franchise not found");

      const currentData = snapshot.val();
      const fieldsToUpdate = {};

      // Check for updated fields
      for (const key in updatedFields) {
        if (
          updatedFields[key] !== currentData[key] && // Check for changes
          updatedFields[key] !== undefined // Ignore undefined values
        ) {
          fieldsToUpdate[key] = updatedFields[key];
        }
      }

      // If no fields need to be updated, return the instance
      if (Object.keys(fieldsToUpdate).length === 0) {
        console.log("No changes detected, skipping update");
        return this;
      }

      // Update timestamp
      fieldsToUpdate.updated_at = new Date().toISOString();

      // Perform the update
      await franchiseRef.update(fieldsToUpdate);

      // Merge updated fields into the current instance
      Object.assign(this, fieldsToUpdate);

      // Log success message
      console.log("Franchise updated successfully:", this);

      return this;
    } catch (error) {
      console.error("Error updating franchise:", error);
      throw new Error("Failed to update franchise");
    }
  }

  // Delete a franchise by ID from Firebase
  static async delete(franchiseId) {
    try {
      const franchiseRef = franchisesRef.child(franchiseId);

      // Remove the franchise from the database
      await franchiseRef.remove();

      return true;
    } catch (error) {
      console.error("Error deleting franchise:", error);
      throw new Error("Failed to delete franchise");
    }
  }

  // Get a franchise by ID
  static async getById(franchiseId) {
    try {
      const franchiseRef = franchisesRef.child(franchiseId);
      const snapshot = await franchiseRef.once("value");

      if (snapshot.exists()) {
        return snapshot.val(); // Return the franchise data
      } else {
        throw new Error("Franchise not found");
      }
    } catch (error) {
      console.error("Error retrieving franchise:", error);
      throw new Error("Failed to retrieve franchise");
    }
  }

  // Get all franchises
  static async getAll() {
    try {
      const snapshot = await franchisesRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const posts = [];
      snapshot.forEach((child) => {
        posts.push({ pk: child.key, ...child.val() });
      });
      return posts.reverse();
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      throw new Error("Failed to fetch advertisements");
    }
  }
}

class Calendar {
  constructor(data) {
    this.id = data.id || null;
    this.title = data.title;
    this.content = data.content || null;
    this.type = data.type || null;
    this.start_date = data.start_date || null;
    this.end_date = data.end_date || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      type: this.type,
      start_date: this.start_date,
      end_date: this.end_date,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  async create() {
    try {
      const newCalendarRef = await calendarRef.push(this.toJSON());
      this.id = newCalendarRef.key;
      await newCalendarRef.update({ id: this.id });
      return this;
    } catch (error) {
      console.error("Error creating calendar:", error);
      throw new Error("Failed to create calendar");
    }
  }

  static async getById(id) {
    try {
      const calendarRef = calendarRef.child(id);
      const snapshot = await calendarRef.once("value");
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        throw new Error("Calendar not found");
      }
    } catch (error) {
      console.error("Error retrieving calendar:", error);
      throw new Error("Failed to retrieve calendar");
    }
  }

  static async getAll() {
    try {
      const snapshot = await calendarRef.once("value");
      if (!snapshot.exists()) {
        return [];
      }
      const calendars = [];
      snapshot.forEach((child) => {
        calendars.push({ id: child.key, ...child.val() });
      });
      return calendars.reverse();
    } catch (error) {
      console.error("Error fetching calendars:", error);
      throw new Error("Failed to fetch calendars");
    }
  }
  async update() {
    try {
      if (!this.id) {
        throw new Error("Calendar ID is required for update");
      }
      this.updatedAt = new Date().toISOString();
      const postData = this.toJSON();
      await calendarRef.child(this.id).update(postData);
      return this;
    } catch (error) {
      console.error("Error updating calendar:", error);
      throw new Error("Failed to update calendar");
    }
  }

  static async delete(id) {
    try {
      await calendarRef.child(id).remove();
      return true;
    } catch (error) {
      console.error("Error deleting calendar:", error);
      throw new Error("Failed to delete calendar");
    }
  }
}

module.exports = { Post, Inquiry, Franchise, Calendar };
