'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';

export function useTeamMembers(query = '') {
  return useSWR(['team', query], () => api.team.list(query), { refreshInterval: 30_000 });
}

export function useTeamMember(id: string) {
  return useSWR(['team-member', id], () => api.team.get(id));
}
