'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { TeamMember, TeamMemberRole } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Mail, Trash2, Shield, Clock } from 'lucide-react';
import { useState } from 'react';
import { mutate } from 'swr';

interface TeamMemberCardProps {
  member: TeamMember;
  currentUserRole: TeamMemberRole;
  currentUserId?: string;
}

const roleIcons: Record<TeamMemberRole, string> = {
  owner: '👑',
  admin: '🛡️',
  developer: '💻',
  viewer: '👁️',
};

export function TeamMemberCard({ member, currentUserRole, currentUserId }: TeamMemberCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const canManage = (currentUserRole === 'owner' || currentUserRole === 'admin') && member.id !== currentUserId;
  const canRemove = currentUserRole === 'owner' || (currentUserRole === 'admin' && member.role !== 'owner');

  const handleResendInvite = async () => {
    if (member.status !== 'pending') return;
    
    setLoading(true);
    try {
      await api.team.resendInvite(member.id);
      alert('Invitation resent successfully!');
      mutate(['team', '']);
    } catch (error) {
      console.error('Failed to resend invitation:', error);
      alert('Failed to resend invitation. Please try again.');
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm(`Are you sure you want to remove ${member.name || member.email} from the team?`)) {
      return;
    }

    setLoading(true);
    try {
      await api.team.remove(member.id);
      mutate(['team', '']);
    } catch (error) {
      console.error('Failed to remove team member:', error);
      alert('Failed to remove team member. Please try again.');
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet/10 text-lg">
          {roleIcons[member.role]}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-ink">
              {member.name || 'Pending invite'}
            </span>
            {member.id === currentUserId && (
              <span className="rounded bg-violet/10 px-2 py-0.5 text-xs font-medium text-violet">
                You
              </span>
            )}
          </div>
          <div className="text-sm text-slate-500">{member.email}</div>
          {member.status === 'pending' && (
            <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
              <Clock size={12} />
              Invited {formatDistanceToNow(new Date(member.invited_at), { addSuffix: true })}
            </div>
          )}
          {member.last_active && member.status === 'active' && (
            <div className="mt-1 text-xs text-slate-400">
              Last active {formatDistanceToNow(new Date(member.last_active), { addSuffix: true })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Shield size={15} className="text-slate-400" />
          <span className="text-sm font-medium capitalize text-slate-700">{member.role}</span>
        </div>
        <Badge status={member.status} />
        
        {canManage && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded p-1 hover:bg-slate-100"
              disabled={loading}
            >
              <MoreVertical size={18} className="text-slate-600" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 z-20 w-48 rounded-md border border-slate-200 bg-white shadow-lg">
                  {member.status === 'pending' && (
                    <button
                      onClick={handleResendInvite}
                      disabled={loading}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Mail size={16} />
                      Resend Invitation
                    </button>
                  )}
                  {canRemove && (
                    <button
                      onClick={handleRemove}
                      disabled={loading}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Remove Member
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
