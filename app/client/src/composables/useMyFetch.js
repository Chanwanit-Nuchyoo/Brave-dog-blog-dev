import { ref } from 'vue'

export const useMyFetch = (url) => {
  const isPending = ref(false)
  const data = ref(null)
  const error = ref(null)

  const fetchData = async (init, queryParams) => {
    isPending.value = true
    const queryString = new URLSearchParams(queryParams)
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + url + '?' + queryString, init)

      if (!response.ok) {
        throw new Error(data.value.message)
      }

      data.value = await response.json()
    } catch (err) {
      error.value = err
    } finally {
      isPending.value = false
    }
  }

  return { fetchData, data, error, isPending }
}
