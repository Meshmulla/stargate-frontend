import type { AuthTokens, CreateInvoiceDto, InvoiceListResponse, LoginDto, PublicInvoice, RegisterDto } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
        ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    });
    if (response.status === 401 && typeof window !== 'undefined') window.location.href = '/login';
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  } catch (error) {
    if (retry) return request<T>(path, options, false);
    throw error;
  }
}

export const api = {
  auth: {
    login: (dto: LoginDto) => request<AuthTokens>('/auth/login', { method: 'POST', body: JSON.stringify(dto) }),
    register: (dto: RegisterDto) => request<AuthTokens>('/auth/register', { method: 'POST', body: JSON.stringify(dto) }),
    refresh: () => request<AuthTokens>('/auth/refresh', { method: 'POST' }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    initTOTP: () => request<{ secret: string; qr_code_url: string }>('/auth/totp/init', { method: 'POST' }),
    verifyTOTP: (dto: { code: string }) => request<{ backup_codes: string[] }>('/auth/totp/verify', { method: 'POST', body: JSON.stringify(dto) }),
    confirmTOTP: () => request('/auth/totp/confirm', { method: 'POST' }),
    disableTOTP: (dto: { code: string }) => request('/auth/totp/disable', { method: 'POST', body: JSON.stringify(dto) }),
    getTOTPStatus: () => request<{ enabled: boolean; last_verified?: string }>('/auth/totp/status', { method: 'GET' }),
  },
  merchants: {
    me: () => request('/merchants/me'),
    update: (dto: unknown) => request('/merchants/me', { method: 'PATCH', body: JSON.stringify(dto) }),
  },
  invoices: {
    list: (query = '') => request<InvoiceListResponse>(`/invoices${query}`),
    create: (dto: CreateInvoiceDto) => request<any>('/invoices', { method: 'POST', body: JSON.stringify(dto) }),
    get: (id: string) => request<any>(`/invoices/${id}`),
    cancel: (id: string) => request<any>(`/invoices/${id}/cancel`, { method: 'POST' }),
    refund: (id: string) => request<any>(`/invoices/${id}/refund`, { method: 'POST' }),
    public: (id: string) => request<PublicInvoice>(`/invoices/public/${id}`),
  },
  payments: {
    prepareTx: (id: string, payer: string) => request<{ xdr: string; network: 'testnet' | 'mainnet' }>(`/payments/${id}/prepare-tx?payer=${encodeURIComponent(payer)}`),
  },
  compliance: {
    screen: (address: string) => request<{ result: 'clear' | 'blocked' | 'review' }>('/compliance/screen', { method: 'POST', body: JSON.stringify({ address }) }),
  },
  team: {
    list: (query = '') => request<any>(`/team${query}`),
    invite: (dto: any) => request<any>('/team/invite', { method: 'POST', body: JSON.stringify(dto) }),
    get: (id: string) => request<any>(`/team/${id}`),
    update: (id: string, dto: any) => request<any>(`/team/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
    remove: (id: string) => request<any>(`/team/${id}`, { method: 'DELETE' }),
    resendInvite: (id: string) => request<any>(`/team/${id}/resend`, { method: 'POST' }),
  },
  webhooks: {
    list: () => request<any[]>('/webhooks'),
    create: (dto: unknown) => request('/webhooks', { method: 'POST', body: JSON.stringify(dto) }),
    remove: (id: string) => request(`/webhooks/${id}`, { method: 'DELETE' }),
    deliveries: (id: string) => request(`/webhooks/${id}/deliveries`),
    retry: (id: string) => request(`/webhooks/deliveries/${id}/retry`, { method: 'POST' }),
  },
  analytics: {
    revenueByPeriod: (period: 'daily' | 'weekly' | 'monthly', days?: number) =>
      request<Array<{ date: string; amount: number }>>(`/analytics/revenue?period=${period}${days ? `&days=${days}` : ''}`),
    topPaymentLinks: (limit?: number) => request<any[]>(`/analytics/top-links${limit ? `?limit=${limit}` : ''}`),
    conversionFunnel: (period?: string) => request<any>(`/analytics/conversion-funnel${period ? `?period=${period}` : ''}`),
    summaryStats: () => request<any>('/analytics/summary'),
  },
  disputes: {
    list: (query = '') => request<any>(`/disputes${query}`),
    get: (id: string) => request<any>(`/disputes/${id}`),
    respond: (id: string, dto: any) => request<any>(`/disputes/${id}/respond`, { method: 'POST', body: JSON.stringify(dto) }),
    uploadEvidence: (id: string, formData: FormData) => 
      fetch(`${API_URL}/disputes/${id}/evidence`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
        },
        body: formData,
      }).then(res => res.json()),
    timeline: (id: string) => request<any[]>(`/disputes/${id}/timeline`),
  },
};
