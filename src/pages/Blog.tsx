import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import useSEO from "../hooks/useSEO";
import { supabase } from "../lib/supabase";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  published_at: string;
  created_at: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function SkeletonCard() {
  return (
    <div className="bg-navy-card border border-gold/20 rounded-sm overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-gold/10" />
      <div className="p-5">
        <div className="h-3 w-24 bg-gold/10 rounded mb-3" />
        <div className="h-5 w-3/4 bg-gold/10 rounded mb-3" />
        <div className="h-3 w-full bg-gold/10 rounded mb-2" />
        <div className="h-3 w-2/3 bg-gold/10 rounded mb-4" />
        <div className="h-3 w-20 bg-gold/10 rounded" />
      </div>
    </div>
  );
}

export default function Blog() {
  useSEO({
    title: "Blog | The Jewellery Studio",
    description: "Insights, stories, and expertise from Gibraltar's premier jeweller.",
    url: "/blog",
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from("v2_blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

      setPosts(data || []);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  return (
    <div className="bg-navy min-h-screen pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <SectionReveal>
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            STORIES, GUIDES & INSIGHTS
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-warm">
            From the Workshop
          </h1>
          <GoldDivider className="mt-4 mb-12" />
        </SectionReveal>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <SectionReveal>
            <div className="text-center py-20">
              <p className="font-body text-muted text-lg mb-6">
                No stories yet. Check back soon.
              </p>
              <a
                href="https://wa.me/35054013690"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-body text-sm uppercase tracking-luxe text-gold border border-gold/40 px-6 py-3 rounded-sm hover:bg-gold/10 transition-colors"
              >
                Chat with Michael on WhatsApp
              </a>
            </div>
          </SectionReveal>
        )}

        {/* Post grid */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <SectionReveal key={post.id} delay={i * 0.1}>
                <Link to={`/blog/${post.slug}`} className="block group">
                  <motion.div
                    className="bg-navy-card border border-gold/20 rounded-sm overflow-hidden hover:border-gold/40 transition-colors"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="aspect-[16/10] w-full object-cover"
                      />
                    ) : (
                      <div className="aspect-[16/10] bg-gold/5 flex items-center justify-center">
                        <span className="font-display text-gold/20 text-3xl">
                          TJS
                        </span>
                      </div>
                    )}

                    <div className="p-5">
                      <p className="font-body text-[10px] uppercase tracking-elegant text-muted mb-2">
                        {formatDate(post.published_at)}
                      </p>
                      <h2 className="font-display text-xl text-warm mb-2 group-hover:text-gold transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="font-body text-sm text-muted leading-relaxed line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="font-body text-[11px] uppercase tracking-luxe text-gold">
                        Read More
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
