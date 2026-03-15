import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  cover_image: "",
  content: "",
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("v2_blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch blog posts:", error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setEditing(true);
  }

  function openEdit(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      cover_image: post.cover_image || "",
      content: post.content || "",
    });
    setEditing(true);
  }

  function handleTitleChange(title: string) {
    setForm({
      ...form,
      title,
      slug: editingId ? form.slug : generateSlug(title),
    });
  }

  async function handleSave(publish?: boolean) {
    if (!form.title || !form.slug) return;
    setSaving(true);

    const now = new Date().toISOString();
    const payload: Record<string, unknown> = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      cover_image: form.cover_image || null,
      content: form.content,
      updated_at: now,
    };

    if (publish !== undefined) {
      payload.published = publish;
      payload.published_at = publish ? now : null;
    }

    if (editingId) {
      const { error } = await supabase
        .from("v2_blog_posts")
        .update(payload)
        .eq("id", editingId);
      if (error) console.error("Failed to update post:", error);
    } else {
      payload.published = publish ?? false;
      payload.published_at = publish ? now : null;
      payload.created_at = now;
      const { error } = await supabase.from("v2_blog_posts").insert(payload);
      if (error) console.error("Failed to create post:", error);
    }

    setSaving(false);
    setEditing(false);
    fetchPosts();
  }

  async function togglePublish(post: BlogPost) {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("v2_blog_posts")
      .update({
        published: !post.published,
        published_at: !post.published ? now : null,
        updated_at: now,
      })
      .eq("id", post.id);

    if (error) console.error("Failed to toggle publish:", error);
    fetchPosts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    const { error } = await supabase.from("v2_blog_posts").delete().eq("id", id);
    if (error) console.error("Failed to delete post:", error);
    fetchPosts();
  }

  // Full-page editor
  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl text-warm tracking-elegant">
            {editingId ? "Edit Post" : "New Post"}
          </h1>
          <button
            onClick={() => setEditing(false)}
            className="text-muted text-sm font-body hover:text-warm transition-colors"
          >
            Back to list
          </button>
        </div>

        <div className="space-y-5 max-w-3xl">
          <div>
            <label className="block text-muted text-xs font-body mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-navy border border-gold/10 text-warm text-sm font-body rounded-sm px-3 py-2 focus:border-gold/30 focus:outline-none"
              placeholder="Post title"
            />
          </div>

          <div>
            <label className="block text-muted text-xs font-body mb-1">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full bg-navy border border-gold/10 text-warm text-sm font-body rounded-sm px-3 py-2 focus:border-gold/30 focus:outline-none"
              placeholder="post-url-slug"
            />
          </div>

          <div>
            <label className="block text-muted text-xs font-body mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="w-full bg-navy border border-gold/10 text-warm text-sm font-body rounded-sm px-3 py-2 focus:border-gold/30 focus:outline-none resize-y"
              placeholder="Short summary for listings"
            />
          </div>

          <div>
            <label className="block text-muted text-xs font-body mb-1">Cover Image URL</label>
            <input
              type="text"
              value={form.cover_image}
              onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
              className="w-full bg-navy border border-gold/10 text-warm text-sm font-body rounded-sm px-3 py-2 focus:border-gold/30 focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-muted text-xs font-body mb-1">
              Content <span className="text-muted/50">(HTML supported)</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={16}
              className="w-full bg-navy border border-gold/10 text-warm text-sm font-body rounded-sm px-3 py-2 focus:border-gold/30 focus:outline-none resize-y font-mono"
              placeholder="Write your post content here. HTML is supported."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleSave()}
              disabled={saving || !form.title || !form.slug}
              className="bg-gold text-navy text-sm font-body font-semibold px-5 py-2.5 rounded-sm hover:bg-gold/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !form.title || !form.slug}
              className="bg-gold/10 border border-gold/30 text-gold text-sm font-body px-5 py-2.5 rounded-sm hover:bg-gold/20 transition-colors disabled:opacity-50"
            >
              Save & Publish
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Post list
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-warm tracking-elegant mb-1">Blog</h1>
          <p className="text-muted text-sm font-body">Manage blog posts.</p>
        </div>
        <button
          onClick={openNew}
          className="bg-gold text-navy text-sm font-body font-semibold px-5 py-2.5 rounded-sm hover:bg-gold/90 transition-colors"
        >
          New Post
        </button>
      </div>

      {loading ? (
        <p className="text-muted font-body">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-muted font-body">No blog posts yet.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-navy-card border border-gold/10 rounded-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-warm truncate">{post.title}</h3>
                  <span
                    className={`text-xs font-body px-2 py-0.5 rounded-sm shrink-0 ${
                      post.published
                        ? "bg-green-500/10 text-green-400"
                        : "bg-white/5 text-muted"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                {post.excerpt && (
                  <p className="text-muted text-sm font-body truncate">{post.excerpt}</p>
                )}
                <p className="text-muted/50 text-xs font-body mt-1">
                  {post.published ? `Published ${formatDate(post.published_at)}` : `Created ${formatDate(post.created_at)}`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => togglePublish(post)}
                  className="text-xs font-body px-3 py-1.5 rounded-sm border border-gold/10 text-muted hover:text-warm transition-colors"
                >
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => openEdit(post)}
                  className="text-gold/70 hover:text-gold text-xs font-body transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-400/70 hover:text-red-400 text-xs font-body transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
