import React, { useState } from "react";
import { getPosts, addPost } from "../../lib/store";
import type { PostCategory } from "../../lib/types";

export function PostsPage() {
  const [, setTick] = useState(0);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<PostCategory>("News");
  const [content, setContent] = useState("");

  const posts = getPosts();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !content.trim()) return;
    addPost(title.trim(), author.trim(), category, content.trim());
    setTitle(""); setAuthor(""); setCategory("News"); setContent("");
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="posts-page">
      <h2>Community Posts</h2>
      <form data-testid="post-form" onSubmit={handleSubmit}>
        <input data-testid="post-title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input data-testid="post-author" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <select data-testid="post-category" value={category} onChange={(e) => setCategory(e.target.value as PostCategory)}>
          <option value="News">News</option>
          <option value="Question">Question</option>
          <option value="Offer">Offer</option>
        </select>
        <textarea data-testid="post-content" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <button data-testid="post-submit" type="submit">Post</button>
      </form>
      {posts.length === 0 ? (
        <p data-testid="empty-posts">No posts yet</p>
      ) : (
        posts.map((p) => (
          <div key={p.id} data-testid={`post-row-${p.id}`}>
            <span data-testid={`post-title-${p.id}`}>{p.title}</span>
            <span data-testid={`post-author-${p.id}`}>{p.author}</span>
            <span data-testid={`post-category-${p.id}`}>{p.category}</span>
            <span data-testid={`post-content-${p.id}`}>{p.content}</span>
          </div>
        ))
      )}
    </div>
  );
}
