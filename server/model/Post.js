const admin = require("firebase-admin");
const database = admin.database();
const postsRef = database.ref("posts"); // 'posts' 경로 참조

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

module.exports = Post;
