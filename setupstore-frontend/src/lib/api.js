const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper function to handle HTTP requests and JSON parsing
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  // Merge default headers with Authorization and custom options
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const textResponse = await response.text();
  let data;

  // Safely parse JSON response, throw custom error if parsing fails
  try {
    data = textResponse ? JSON.parse(textResponse) : {};
  } catch (e) {
    throw new Error(
      `Server Error (${response.status}): ${response.statusText}`,
    );
  }

  // Throw error with server message if response is not successful
  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }

  return data;
}
