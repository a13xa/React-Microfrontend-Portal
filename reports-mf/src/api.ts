import { Report, ReportsQueryParams, PaginatedReportsResponse } from './types';

const ENDPOINTS = {
  reports: '/api/v1/reports',
  reportById: (id: string) => `/api/v1/reports/${id}`,
  exportCsv: '/api/v1/reports/export',
} as const;

const MOCK_REPORTS: Report[] = [
  { id: '1', title: 'Q4 Revenue Analysis', status: 'completed', author: 'Anna Liepiņa', createdAt: new Date(Date.now() - 86400000).toISOString(), metrics: { views: 5240, downloads: 342 } },
  { id: '2', title: 'User Growth Summary', status: 'completed', author: 'Kārlis Vanags', createdAt: new Date(Date.now() - 172800000).toISOString(), metrics: { views: 3180, downloads: 215 } },
  { id: '3', title: 'Infrastructure Cost Report', status: 'in_progress', author: 'Dace Ozoliņa', createdAt: new Date(Date.now() - 259200000).toISOString(), metrics: { views: 1920, downloads: 87 } },
  { id: '4', title: 'Customer Satisfaction Survey', status: 'completed', author: 'Andris Krūmiņš', createdAt: new Date(Date.now() - 345600000).toISOString(), metrics: { views: 4510, downloads: 298 } },
  { id: '5', title: 'API Performance Benchmark', status: 'failed', author: 'Ieva Zariņa', createdAt: new Date(Date.now() - 432000000).toISOString(), metrics: { views: 890, downloads: 45 } },
  { id: '6', title: 'Monthly Active Users', status: 'completed', author: 'Anna Liepiņa', createdAt: new Date(Date.now() - 518400000).toISOString(), metrics: { views: 7630, downloads: 521 } },
  { id: '7', title: 'Security Compliance Audit', status: 'in_progress', author: 'Kārlis Vanags', createdAt: new Date(Date.now() - 604800000).toISOString(), metrics: { views: 2100, downloads: 156 } },
  { id: '8', title: 'Team Velocity Metrics', status: 'completed', author: 'Dace Ozoliņa', createdAt: new Date(Date.now() - 691200000).toISOString(), metrics: { views: 1560, downloads: 93 } },
  { id: '9', title: 'Incident Response Summary', status: 'completed', author: 'Andris Krūmiņš', createdAt: new Date(Date.now() - 777600000).toISOString(), metrics: { views: 3890, downloads: 267 } },
  { id: '10', title: 'Cloud Migration Progress', status: 'in_progress', author: 'Ieva Zariņa', createdAt: new Date(Date.now() - 864000000).toISOString(), metrics: { views: 4210, downloads: 189 } },
  { id: '11', title: 'Employee Onboarding Stats', status: 'completed', author: 'Anna Liepiņa', createdAt: new Date(Date.now() - 950400000).toISOString(), metrics: { views: 980, downloads: 62 } },
  { id: '12', title: 'Feature Adoption Report', status: 'failed', author: 'Kārlis Vanags', createdAt: new Date(Date.now() - 1036800000).toISOString(), metrics: { views: 2340, downloads: 134 } },
  { id: '13', title: 'SLA Compliance Dashboard', status: 'completed', author: 'Dace Ozoliņa', createdAt: new Date(Date.now() - 1123200000).toISOString(), metrics: { views: 5670, downloads: 378 } },
  { id: '14', title: 'Resource Utilization Analysis', status: 'in_progress', author: 'Andris Krūmiņš', createdAt: new Date(Date.now() - 1209600000).toISOString(), metrics: { views: 1430, downloads: 71 } },
  { id: '15', title: 'Annual Technology Review', status: 'completed', author: 'Ieva Zariņa', createdAt: new Date(Date.now() - 1296000000).toISOString(), metrics: { views: 8920, downloads: 645 } },
  { id: '16', title: 'Data Pipeline Optimization', status: 'completed', author: 'Anna Liepiņa', createdAt: new Date(Date.now() - 1382400000).toISOString(), metrics: { views: 2760, downloads: 198 } },
  { id: '17', title: 'Payment Gateway Analysis', status: 'in_progress', author: 'Kārlis Vanags', createdAt: new Date(Date.now() - 1468800000).toISOString(), metrics: { views: 3420, downloads: 241 } },
  { id: '18', title: 'Mobile App Performance', status: 'completed', author: 'Dace Ozoliņa', createdAt: new Date(Date.now() - 1555200000).toISOString(), metrics: { views: 4180, downloads: 312 } },
  { id: '19', title: 'Fraud Detection Metrics', status: 'completed', author: 'Andris Krūmiņš', createdAt: new Date(Date.now() - 1641600000).toISOString(), metrics: { views: 6340, downloads: 489 } },
  { id: '20', title: 'Database Performance Report', status: 'failed', author: 'Ieva Zariņa', createdAt: new Date(Date.now() - 1728000000).toISOString(), metrics: { views: 1890, downloads: 102 } },
  { id: '21', title: 'Customer Retention Analysis', status: 'completed', author: 'Anna Liepiņa', createdAt: new Date(Date.now() - 1814400000).toISOString(), metrics: { views: 5120, downloads: 367 } },
  { id: '22', title: 'Cross-border Transaction Report', status: 'in_progress', author: 'Kārlis Vanags', createdAt: new Date(Date.now() - 1900800000).toISOString(), metrics: { views: 2890, downloads: 178 } },
  { id: '23', title: 'KYC Compliance Status', status: 'completed', author: 'Dace Ozoliņa', createdAt: new Date(Date.now() - 1987200000).toISOString(), metrics: { views: 7210, downloads: 534 } },
  { id: '24', title: 'Load Testing Results', status: 'completed', author: 'Andris Krūmiņš', createdAt: new Date(Date.now() - 2073600000).toISOString(), metrics: { views: 1340, downloads: 88 } },
  { id: '25', title: 'Third-party Integration Audit', status: 'failed', author: 'Ieva Zariņa', createdAt: new Date(Date.now() - 2160000000).toISOString(), metrics: { views: 980, downloads: 56 } },
  { id: '26', title: 'AML Monitoring Dashboard', status: 'completed', author: 'Anna Liepiņa', createdAt: new Date(Date.now() - 2246400000).toISOString(), metrics: { views: 8450, downloads: 612 } },
  { id: '27', title: 'API Gateway Latency Report', status: 'in_progress', author: 'Kārlis Vanags', createdAt: new Date(Date.now() - 2332800000).toISOString(), metrics: { views: 2340, downloads: 145 } },
  { id: '28', title: 'Digital Onboarding Funnel', status: 'completed', author: 'Dace Ozoliņa', createdAt: new Date(Date.now() - 2419200000).toISOString(), metrics: { views: 4890, downloads: 356 } },
  { id: '29', title: 'Server Cost Optimization', status: 'completed', author: 'Andris Krūmiņš', createdAt: new Date(Date.now() - 2505600000).toISOString(), metrics: { views: 3120, downloads: 223 } },
  { id: '30', title: 'Quarterly Risk Assessment', status: 'completed', author: 'Ieva Zariņa', createdAt: new Date(Date.now() - 2592000000).toISOString(), metrics: { views: 6780, downloads: 478 } },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchReportsGraphQL(): Promise<Report[]> {
  await delay(800);
  return MOCK_REPORTS.map((r) => ({ ...r }));
}

export async function fetchReportsPaginated(params: ReportsQueryParams): Promise<PaginatedReportsResponse> {
  void ENDPOINTS;
  await delay(500);

  let filtered = [...MOCK_REPORTS];

  if (params.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter(
      (r) => r.title.toLowerCase().includes(query) || r.author.toLowerCase().includes(query)
    );
  }

  if (params.statusFilter && params.statusFilter !== 'all') {
    filtered = filtered.filter((r) => r.status === params.statusFilter);
  }

  if (params.sortBy) {
    filtered.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (params.sortBy) {
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'author':
          aVal = a.author.toLowerCase();
          bVal = b.author.toLowerCase();
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'views':
          aVal = a.metrics.views;
          bVal = b.metrics.views;
          break;
        case 'downloads':
          aVal = a.metrics.downloads;
          bVal = b.metrics.downloads;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return params.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return params.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / params.pageSize));
  const start = (params.page - 1) * params.pageSize;
  const data = filtered.slice(start, start + params.pageSize);

  return { data, total, page: params.page, pageSize: params.pageSize, totalPages };
}

export async function deleteReport(id: string): Promise<void> {
  void ENDPOINTS;
  await delay(400);
  const index = MOCK_REPORTS.findIndex((r) => r.id === id);
  if (index === -1) throw new Error(`Report ${id} not found`);
  MOCK_REPORTS.splice(index, 1);
}
