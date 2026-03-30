import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1",
  prepareHeaders: async (headers) => {
    // Clerk client SDK — get short-lived session token
    const clerk = typeof window !== "undefined" ? (window as any).Clerk : null;
    const token = await clerk?.session?.getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});
