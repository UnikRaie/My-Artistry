const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Example: get the token from localStorage or some auth context
const getAuthToken = () => localStorage.getItem("token")

/**
 * Fetch the current user's profile
 * Chooses the endpoint based on the user's role from localStorage
 * @returns {Promise<Object>} The user profile
 */
export const fetchCurrentUserProfile = async () => {
  try {
    const role = localStorage.getItem("role") // "artist" or "hirer"
    const route = role === "artist" ? "/api/a" : "/api/hirer"

    const response = await fetch(`${BACKEND_URL}${route}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

/**
 * Search for artists to chat with
 * @param {Object} params Search parameters
 * @returns {Promise<Object>} Search results
 */
export const searchArtists = async (params = {}) => {
  try {
    const defaultParams = {
      name: "",
      location: "",
      genre: "",
      specialization: "",
      priceFrom: "",
      priceTo: "",
      type: "all",
      page: 1,
      limit: 20,
    }

    const searchParams = { ...defaultParams, ...params }

    const queryString = Object.entries(searchParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")

    const response = await fetch(`${BACKEND_URL}/api/search?${queryString}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching artists:", error)
    throw error
  }
}
