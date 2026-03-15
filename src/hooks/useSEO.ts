import { useEffect } from "react";

const SITE_NAME = "The Jewellery Studio";
const SITE_URL = "https://thejewellerystudio.com";
const DEFAULT_IMAGE = "/images/shop-interior.jpg";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function useSEO({ title, description, image, url, type = "website" }: SEOProps) {
  useEffect(() => {
    const fullImage = image
      ? (image.startsWith("http") ? image : `${SITE_URL}${image}`)
      : `${SITE_URL}${DEFAULT_IMAGE}`;
    const fullUrl = url
      ? (url.startsWith("http") ? url : `${SITE_URL}${url}`)
      : SITE_URL;

    // Title
    document.title = title;

    // Meta description
    setMeta("description", description);

    // Open Graph
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:image", fullImage, "property");
    setMeta("og:url", fullUrl, "property");
    setMeta("og:type", type, "property");
    setMeta("og:site_name", SITE_NAME, "property");

    // Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", fullImage);

    // Canonical
    setCanonical(fullUrl);
  }, [title, description, image, url, type]);
}
