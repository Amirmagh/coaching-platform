import api from './api';

/**
 * Report / moderation service: lets users report content and lets admins
 * list and resolve content reports. Maps to the backend report endpoints.
 */

export const submitReport = async ({ contentType, contentId, reason }) => {
  const { data } = await api.post('/admin/report-issue/', {
    content_type: contentType,
    content_id: contentId,
    reason,
  });
  return data;
};

export const getReports = async (params = {}) => {
  const { data } = await api.get('/admin/reports/', { params });
  return data;
};

export const updateReportStatus = async (reportId, payload) => {
  const { data } = await api.patch(`/admin/reports/${reportId}/`, payload);
  return data;
};

export default { submitReport, getReports, updateReportStatus };
