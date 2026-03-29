import { useState, useCallback, useRef } from "react";

export function useInfiniteScroll(fetchFn) {
  const [items, setItems]               = useState([]);
  const [page, setPage]                 = useState(0);
  const [hasMore, setHasMore]           = useState(true);
  const [loading, setLoading]           = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const pageRef = useRef(0);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const data = await fetchFn(pageRef.current);
      const content = data?.content || [];

      if (pageRef.current === 0) {
        setItems(content);
      } else {
        setItems(prev => [...prev, ...content]);
      }

      setHasMore(data?.hasNext ?? false);
      pageRef.current += 1;
      setPage(pageRef.current);
    } catch (e) {
      console.error("useInfiniteScroll error:", e);
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setInitialLoading(false);
    }
  }, [fetchFn]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(0);
    pageRef.current = 0;
    setHasMore(true);
    setInitialLoading(true);
    loadingRef.current = false;
  }, []);

  return { items, hasMore, loading, initialLoading, loadMore, reset, setItems };
}
