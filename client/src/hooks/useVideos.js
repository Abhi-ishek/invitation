import { useState, useEffect, useCallback } from 'react';
import { videoService } from '../services/videoService';

export const useVideos = (category = 'All', search = '', sort = 'featured') => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await videoService.getAllVideos({
        category: category !== 'All' ? category : undefined,
        search: search || undefined,
        sort: sort !== 'featured' ? sort : undefined,
      });
      setVideos(response.data || []);
    } catch (err) {
      console.warn('Backend not responding or network error. Using fallback templates.', err);
      setError(err.message || 'Unable to load videos');
    } finally {
      setLoading(false);
    }
  }, [category, search, sort]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return { videos, loading, error, refetch: fetchVideos };
};
