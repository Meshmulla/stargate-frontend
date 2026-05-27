'use client';

import { InviteTeamMemberModal } from '@/components/team/InviteTeamMemberModal';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTeamMembers } from '@/hooks/useTeam';
import { useSession } from '@/lib/session';
import { TeamMemberRole } from '@/types';
import { UserPlus, Users, Shield, Clock } from 'lucide-react';
import { useState } from 'react';

export default function TeamPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { data, isLoading, error } = useTeamMembers();
  const session = useSession();

  // For demo purposes, assume current user is an admin
  // In production, this would come from the session/API
  const currentUserRole: TeamMemberRole = 'admin';
  const currentUserId = session.merchant?.id;

  const members = data?.items ?? [];
  const canInvite = currentUserRole === 'owner' || currentUserRole === 'admin';

  const activeMembers = members.filter(m => m.status === 'active').length;
  const pendingInvites = members.filter(m => m.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Team</h1>
          <p className="mt-1 text-sm text-slate-600">
            Invite teammates and assign access for operations, developers, and finance.
          </p>
        </div>
        {canInvite && (
          <Button onClick={() => setShowInviteModal(true)}>
            <UserPlus size={16} />
            Invite Member
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Members</p>
              <p className="mt-1 text-2xl font-bold text-ink">{members.length}</p>
            </div>
            <Users className="text-slate-400" size={32} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Active</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{activeMembers}</p>
            </div>
            <Shield className="text-emerald-400" size={32} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending Invites</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">{pendingInvites}</p>
            </div>
            <Clock className="text-amber-400" size={32} />
          </div>
        </Card>
      </div>

      {isLoading ? (
        <Card className="py-12 text-center">
          <p className="text-slate-500">Loading team members...</p>
        </Card>
      ) : error ? (
        <Card className="py-12 text-center">
          <p className="text-red-600">Failed to load team members. Please try again.</p>
        </Card>
      ) : members.length === 0 ? (
        <Card className="py-12 text-center">
          <Users size={48} className="mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-semibold text-ink">No team members yet</h3>
          <p className="mt-2 text-sm text-slate-600">
            Get started by inviting your first team member
          </p>
          {canInvite && (
            <Button onClick={() => setShowInviteModal(true)} className="mt-4">
              <UserPlus size={16} />
              Invite Member
            </Button>
          )}
        </Card>
      ) : (
        <Card className="divide-y divide-slate-100 p-0">
          {members.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              currentUserRole={currentUserRole}
              currentUserId={currentUserId}
            />
          ))}
        </Card>
      )}

      <InviteTeamMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        currentUserRole={currentUserRole}
      />
    </div>
  );
}
