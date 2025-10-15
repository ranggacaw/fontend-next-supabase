"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface BlogType {
  id?: number;
  title: string;
  description: string;
}

const BlogListPage = () => {
  const [bloglist, setBlogList] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:4321/blog/list", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle different response structures safely
      const responseData = response.data;

      // Check if responseData is an array directly
      if (Array.isArray(responseData)) {
        setBlogList(responseData);
      }
      // If it's an object, check for common array properties
      else if (typeof responseData === "object" && responseData !== null) {
        // Use type assertion to access properties safely
        const obj = responseData as Record<string, unknown>;

        if (Array.isArray(obj.data)) {
          setBlogList(obj.data);
        } else if (Array.isArray(obj.blogs)) {
          setBlogList(obj.blogs);
        } else if (Array.isArray(obj.items)) {
          setBlogList(obj.items);
        } else {
          // Check if object is empty (no properties)
          if (Object.keys(obj).length === 0) {
            // Empty object likely means no blogs available
            setBlogList([]);
          } else {
            // Object has properties but no array found
            console.error(
              "API response does not contain a blog array:",
              responseData
            );
            setError(
              "Invalid data format: response contains data but no blog array"
            );
            setBlogList([]);
          }
        }
      } else {
        // If responseData is neither array nor object
        console.error(
          "API response is not an array or object:",
          responseData
        );
        setError("Invalid data format received from server");
        setBlogList([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch blog posts"
      );
      console.error("Error fetching blog list:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:4321/blog/delete/${id}`
      );
      console.log(response);
      alert("Blog deleted successfully");

      // Optional: refresh data setelah delete
      fetchData(); // panggil ulang data blogs
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete blog post");
      console.error("Error deleting blog:", err);
      alert("Error deleting blog");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Loading blog posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-500">
          <h2>Error loading blog posts</h2>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
        <Button
          onClick={() => (window.location.href = "/")}
          className="cursor-pointer me-2"
        >
          Home
        </Button>
        <Button
          onClick={() => window.location.reload()}
          className="cursor-pointer"
        >
          Refresh List
        </Button>
      </div>

      {!Array.isArray(bloglist) || bloglist.length === 0 ? (
        <div className="text-center text-gray-500">No blog posts found.</div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {bloglist.map((blog, index) => (
            <div
              key={index}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600">{blog.description}</p>
              <Button
                className="mt-2 cursor-pointer"
                onClick={() => blog.id && handleDelete(blog.id)}
                disabled={!blog.id}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogListPage;
