import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// All secrets live here on the server — never exposed to the browser
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD") || "TJS2026!";

// Simple token: hash the password + a daily salt so tokens expire each day
async function makeToken(password: string): Promise<string> {
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const data = new TextEncoder().encode(password + day + SUPABASE_SERVICE_ROLE_KEY);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyToken(token: string): Promise<boolean> {
  const expected = await makeToken(ADMIN_PASSWORD);
  return token === expected;
}

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status);
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop() || "";

  // ── LOGIN ──
  if (path === "login" && req.method === "POST") {
    try {
      const { password } = await req.json();
      if (password === ADMIN_PASSWORD) {
        const token = await makeToken(ADMIN_PASSWORD);
        return jsonResponse({ token });
      }
      return errorResponse("Incorrect access code", 401);
    } catch {
      return errorResponse("Invalid request body", 400);
    }
  }

  // ── All other routes require auth ──
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return errorResponse("Unauthorized", 401);
  }

  // Admin Supabase client (service role — full access)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // ── GET PRODUCTS ──
  if (path === "products" && req.method === "GET") {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return errorResponse(error.message, 500);
    return jsonResponse(data);
  }

  // ── CREATE PRODUCT ──
  if (path === "products" && req.method === "POST") {
    try {
      const body = await req.json();
      const { data, error } = await supabase.from("products").insert(body).select().single();
      if (error) return errorResponse(error.message, 500);
      return jsonResponse(data, 201);
    } catch {
      return errorResponse("Invalid request body", 400);
    }
  }

  // ── UPDATE PRODUCT ──
  if (path === "products" && req.method === "PUT") {
    try {
      const body = await req.json();
      const { id, ...updates } = body;
      if (!id) return errorResponse("Product ID required", 400);
      updates.updated_at = new Date().toISOString();
      const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
      if (error) return errorResponse(error.message, 500);
      return jsonResponse(data);
    } catch {
      return errorResponse("Invalid request body", 400);
    }
  }

  // ── DELETE PRODUCT ──
  if (path === "products" && req.method === "DELETE") {
    const id = url.searchParams.get("id");
    if (!id) return errorResponse("Product ID required", 400);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return errorResponse(error.message, 500);
    return jsonResponse({ success: true });
  }

  // ── UPLOAD IMAGE ──
  if (path === "upload" && req.method === "POST") {
    try {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      if (!file) return errorResponse("No file provided", 400);

      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) return errorResponse(uploadError.message, 500);

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      return jsonResponse({ url: urlData.publicUrl });
    } catch (e) {
      return errorResponse("Upload failed: " + (e as Error).message, 500);
    }
  }

  return errorResponse("Not found", 404);
});
