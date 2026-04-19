import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { APIRespond } from '@/@types/api';
import { RootState } from '@/store';
import { selectCacheData, setCacheData } from '@/store/slices/cache/cacheSlice';

// Generic hook to fetch and cache data using Redux
const useFetchAndCache = <T>(
  key: string,
  fetchPromise: Promise<APIRespond<T>>
) => {
  const dispatch = useDispatch();
  const cachedData = useSelector((state: RootState) =>
    selectCacheData<T>(state, key)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setDataState] = useState<T | null>(cachedData); // Local state for rendering

  useEffect(() => {
    if (!cachedData && !loading) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await fetchPromise;
          const fetchedData = response.body;
          // Comparison logic
          const isDataSame =
            JSON.stringify(cachedData) === JSON.stringify(fetchedData);
          // If the data is different, update both Redux store and local state
          if (!isDataSame) {
            dispatch(setCacheData({ key, data: fetchedData })); // Update Redux cache
            setDataState(fetchedData); // Update local state
          }
        } catch (err: any) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  return { data: data ?? cachedData, loading, error };
};

export default useFetchAndCache;
