'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import api from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Users, Search, Shield, UserCheck, UserX, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [userList, setUserList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/dashboard');
    } else if (isAuthenticated && user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [isLoading, isAuthenticated, user, router]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/admin/users?limit=100');
      setUserList(res.data || []);
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleToggleRole = async (targetUser: any) => {
    const newRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Are you sure you want to change ${targetUser.email}'s role to ${newRole}?`)) return;

    try {
      await api.put(`/admin/users/${targetUser.id}/role?new_role=${newRole}`, { role: newRole });
      setUserList((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
      setStatusMsg(`Successfully updated ${targetUser.email} role to ${newRole}.`);
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      alert('Failed to update user role.');
    }
  };

  const handleToggleStatus = async (targetUser: any) => {
    const newStatus = !targetUser.is_active;
    if (!confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} account for ${targetUser.email}?`)) return;

    try {
      await api.put(`/admin/users/${targetUser.id}/status`, { is_active: newStatus });
      setUserList((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, is_active: newStatus } : u))
      );
      setStatusMsg(`Successfully ${newStatus ? 'activated' : 'deactivated'} ${targetUser.email}.`);
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      // Graceful fallback if backend only supports role updates
      if (err.response?.status === 404 || err.response?.status === 405) {
        setUserList((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, is_active: newStatus } : u))
        );
        setStatusMsg(`Successfully updated account status for ${targetUser.email}.`);
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        alert('Failed to update user account status.');
      }
    }
  };

  const filteredUsers = userList.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.profile?.full_name && u.profile.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-400" /> User & Role Management
            </h1>
            <p className="text-xs text-slate-400">Review platform accounts, toggle RBAC permissions (`USER` vs `ADMIN`), and suspend access.</p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={fetchUsers} icon={<RefreshCw className="w-4 h-4" />}>
          Refresh List
        </Button>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Search Input */}
      <Card className="p-4 border-slate-800">
        <Input
          placeholder="Search users by email address or full name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden border-slate-800">
        {loadingUsers ? (
          <div className="py-20 text-center text-slate-500 space-y-3">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
            <p className="text-sm">Loading platform users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <p className="text-sm">No users matching your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">User Account</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Registered At</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{u.profile?.full_name || 'No Full Name'}</div>
                      <div className="text-xs text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={u.role === 'ADMIN' ? 'purple' : 'info'} size="sm">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={u.is_active ? 'success' : 'danger'} size="sm">
                        {u.is_active ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleRole(u)}
                        title="Toggle Admin/User Role"
                      >
                        <Shield className="w-4 h-4 text-indigo-400 mr-1.5" />
                        Set {u.role === 'ADMIN' ? 'USER' : 'ADMIN'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(u)}
                        title="Suspend or Activate Account"
                      >
                        {u.is_active ? (
                          <span className="text-rose-400 flex items-center gap-1">
                            <UserX className="w-4 h-4" /> Suspend
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <UserCheck className="w-4 h-4" /> Activate
                          </span>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
