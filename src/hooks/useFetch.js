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

        // Some JSON APIs (including wttr.in) incorrectly respond with a
        // text/plain content type. Parse the payload itself rather than
        // rejecting otherwise valid JSON based only on the response header.
        const responseBody = await response.text();
        let result;

        try {
          result = JSON.parse(responseBody);
        } catch {
          throw new Error('Received an invalid JSON response from server.');
        }
        
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
