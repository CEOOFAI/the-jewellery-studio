import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import useSEO from "../hooks/useSEO";
import { supabase } from "../lib/supabase";

function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script, iframe, object, embed, form").forEach((el) => el.remove());
  doc.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith("on") || attr.value.startsWith("javascript:")) {
        el.removeAttribute(attr.name);
      }
    }
  });
  return doc.body.innerHTML;
}

interface BlogPostData {
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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useSEO({
    title: post ? `${post.title} | The Jewellery Studio` : "Blog | The Jewellery Studio",
    description: post?.excerpt || "Read the latest from The Jewellery Studio, Gibraltar.",
    url: `/blog/${slug}`,
    image: post?.cover_image || undefined,
  });

  const safeContent = useMemo(() => {
    if (!post) return "";
    return sanitizeHtml(post.content);
  }, [post]);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("v2_blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPost(data);
      }
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-navy min-h-screen pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-gold/10 rounded mb-8" />
            <div className="aspect-[16/10] bg-gold/10 rounded-sm mb-8" />
            <div className="h-3 w-24 bg-gold/10 rounded mb-4" />
            <div className="h-8 w-3/4 bg-gold/10 rounded mb-6" />
            <div className="space-y-3">
              <div className="h-3 w-full bg-gold/10 rounded" />
              <div className="h-3 w-full bg-gold/10 rounded" />
              <div className="h-3 w-2/3 bg-gold/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="bg-navy min-h-screen pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center py-20">
          <SectionReveal>
            <h1 className="font-display text-4xl text-warm mb-4">
              Post Not Found
            </h1>
            <p className="font-body text-muted mb-8">
              This post doesn't exist or has been removed.
            </p>
            <Link
              to="/blog"
              className="inline-block font-body text-sm uppercase tracking-luxe text-gold border border-gold/40 px-6 py-3 rounded-sm hover:bg-gold/10 transition-colors"
            >
              Back to Blog
            </Link>
          </SectionReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Back link */}
        <SectionReveal>
          <Link
            to="/blog"
            className="inline-flex items-center font-body text-sm text-muted hover:text-gold transition-colors mb-8"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>
        </SectionReveal>

        {/* Cover image */}
        {post.cover_image && (
          <SectionReveal>
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full aspect-[16/10] object-cover rounded-sm mb-8"
            />
          </SectionReveal>
        )}

        {/* Date */}
        <SectionReveal delay={0.1}>
          <p className="font-body text-[10px] uppercase tracking-elegant text-muted mb-4">
            {formatDate(post.published_at)}
          </p>
        </SectionReveal>

        {/* Title */}
        <SectionReveal delay={0.15}>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-warm mb-2">
            {post.title}
          </h1>
          <GoldDivider className="mt-4 mb-10" />
        </SectionReveal>

        {/* Content */}
        <SectionReveal delay={0.2}>
          <div
            className="font-body text-warm/90 leading-relaxed prose-blog"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        </SectionReveal>

        {/* Sign-off */}
        <SectionReveal delay={0.1}>
          <div className="mt-16">
            <GoldDivider className="mb-8" />
            <p className="font-display text-xl text-warm mb-2">
              Written by Michael
            </p>
            <p className="font-body text-sm text-muted mb-8">
              Master jeweller and owner of The Jewellery Studio, Gibraltar.
            </p>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/35054013690"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-body text-sm uppercase tracking-luxe text-gold border border-gold/40 px-6 py-3 rounded-sm hover:bg-gold/10 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Have questions about this? Chat with Michael
            </a>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
