'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { TeamMemberRole } from '@/types';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { mutate } from 'swr';

interface InviteTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: TeamMemberRole;
}

const roleOptions: Array<{ value: TeamMemberRole; label: string; description: string }> = [
  { 
    value: 'owner', 
    label: 'Owner', 
    description: 'Full access including billing and team management' 
  },
  { 
    value: 'admin', 
    label: 'Admin', 
    description: 'Manage payments, invoices, and team members' 
  },
  { 
    value: 'developer', 
    label: 'Developer', 
    description: 'Access API keys and webhooks, view transactions' 
  },
  { 
    value: 'viewer', 
    label: 'Viewer', 
    description: 'Read-only access to dashboard data' 
  },
];

export function InviteTeamMemberModal({ isOpen, onClose, currentUserRole }: InviteTeamMemberModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<TeamMemberRole>('viewer');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Only OWNER and ADMIN can invite
  const canInvite = currentUserRole === 'owner' || currentUserRole === 'admin';

  // Filter roles based on current user's role
  const availableRoles = roleOptions.filter(option => {
    if (currentUserRole === 'owner') return true; // Owner can assign any role
    if (currentUserRole === 'admin') return option.value !== 'owner'; // Admin cannot create owners
    return false;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);

    try {
      await api.team.invite({
        email: email.trim(),
        name: name.trim() || undefined,
        role,
      });

      // Refresh team members list
      mutate(['team', '']);
      
      // Reset form and close modal
      setEmail('');
      setName('');
      setRole('viewer');
      onClose();
    } catch (err: any) {
      console.error('Failed to invite team member:', err);
      setError(err.message || 'Failed to send invitation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setEmail('');
      setName('');
      setRole('viewer');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  if (!canInvite) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center gap-3 text-amber-600">
            <AlertCircle size={24} />
            <h2 className="text-lg font-semibold">Permission Denied</h2>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Only OWNER and ADMIN roles can invite team members.
          </p>
          <Button onClick={handleClose} className="mt-4 w-full">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div className="flex items-center gap-2">
            <UserPlus size={20} className="text-violet" />
            <h2 className="text-xl font-semibold text-ink">Invite Team Member</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teammate@company.com"
                required
                disabled={submitting}
                className="w-full"
              />
              <p className="mt-1 text-xs text-slate-500">
                An invitation email will be sent to this address
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Name (optional)
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                disabled={submitting}
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {availableRoles.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-md border-2 p-3 transition ${
                      role === option.value
                        ? 'border-violet bg-violet/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={role === option.value}
                      onChange={(e) => setRole(e.target.value as TeamMemberRole)}
                      disabled={submitting}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-ink">{option.label}</div>
                      <div className="text-sm text-slate-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
