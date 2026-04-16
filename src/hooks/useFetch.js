import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching data from a URL.
 * @param {string|null} url - The URL to fetch data from. If null, fetch is skipped.
 * @returns {object} { data, loading, error }
 */
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const abortController = new AbortController();

    const fetchData = async () => {
      // Small optimization: don't set loading if we're already unmounted
      if (!active) return;
      
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { signal: abortController.signal });
        
        if (!active) return;

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('API rate limit exceeded. Please try again later.');
          }
          if (response.status === 404) {
            throw new Error('Resource not found.');
          }
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Received non-JSON response from server.');
        }

        const result = await response.json();
        
        if (active) {
          setData(result);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && active) {
          setError(err.message || 'Something went wrong');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
      abortController.abort();
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
