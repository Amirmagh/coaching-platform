import { useState, useEffect, useCallback } from 'react';
import * as adminService from '../services/adminService';

/**
 * Generic admin data hook: handles fetching a paginated/filterable admin
 * resource (users, sessions, payments) with search/filter/pagination state,
 * plus a CSV export helper. `fetcher` is one of the adminService list calls.
 */
export const useAdmin = (fetcher, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialParams.pageSize || 10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher(params);
      setData(Array.isArray(result) ? result : result?.results || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setFilter = useCallback((key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const setSearch = useCallback((value) => {
    setParams((prev) => ({ ...prev, search: value }));
    setPage(1);
  }, []);

  // Client-side pagination over the fetched result set.
  const paginated = data.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  // Exports the current data set as a CSV file download.
  const exportCSV = useCallback(
    (columns) => {
      const cols = columns || (data[0] ? Object.keys(data[0]) : []);
      const header = cols.join(',');
      const rows = data.map((row) =>
        cols.map((c) => JSON.stringify(row[c] ?? '')).join(',')
      );
      const csv = [header, ...rows].join('\n');
      const blob = new Blob(["﻿" + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'export.csv';
      link.click();
      URL.revokeObjectURL(url);
    },
    [data]
  );

  return {
    data,
    paginated,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    setPage,
    setFilter,
    setSearch,
    refetch: fetchData,
    exportCSV,
  };
};

export default useAdmin;
