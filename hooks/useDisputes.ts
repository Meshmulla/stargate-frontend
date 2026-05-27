'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';

export function useDisputes(query = '') {
  return useSWR(['disputes', query], () => api.disputes.list(query), { refreshInterval: 30_000 });
}

export function useDispute(id: string) {
  return useSWR(['dispute', id], () => api.disputes.get(id), { refreshInterval: 10_000 });
}

export function useDisputeTimeline(id: string) {
  return useSWR(['dispute-timeline', id], () => api.disputes.timeline(id), { refreshInterval: 10_000 });
}
