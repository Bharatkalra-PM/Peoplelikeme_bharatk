import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Database,
  RefreshCw,
  Download,
  Table,
  Activity,
  Code,
  Search,
  CheckCircle2,
  Clock,
  User,
  Eye,
  X,
} from 'lucide-react';

export interface DbUserRecord {
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  city: string;
  created_at: string;
  last_login_at: string;
  login_count: number;
  onboarding_completed: boolean;
  from_role: string;
  to_role: string;
  from_field: string;
  years_experience: number;
  priority: string;
  matched_guide: string;
  goals_count: number;
  latest_action: string;
  actions_history: { timestamp: string; action: string; details: string }[];
  raw_state?: any;
}

export interface DbActivityLog {
  log_id: string;
  timestamp: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  action: string;
  details: string;
}

const SQL_SCHEMA_TEXT = `-- People Like Me Production Database Schema (PostgreSQL / Relational)

CREATE TABLE users (
  user_id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(32) NOT NULL DEFAULT 'switcher', -- 'switcher' | 'guide' | 'admin'
  city VARCHAR(80) DEFAULT 'Bengaluru',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  login_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE move_profiles (
  user_id VARCHAR(64) PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  from_role VARCHAR(120) NOT NULL,
  from_field VARCHAR(120) NOT NULL,
  to_role VARCHAR(120) NOT NULL,
  years_experience INTEGER NOT NULL,
  priority VARCHAR(80) DEFAULT 'Speed to role',
  dependants VARCHAR(80) DEFAULT 'None',
  preferred_guide_gender VARCHAR(40) DEFAULT 'No preference',
  story TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE guide_connections (
  connection_id VARCHAR(64) PRIMARY KEY,
  switcher_id VARCHAR(64) REFERENCES users(user_id),
  guide_id VARCHAR(64) NOT NULL,
  guide_name VARCHAR(120) NOT NULL,
  pod_id VARCHAR(64),
  current_week INTEGER DEFAULT 1,
  status VARCHAR(32) DEFAULT 'accepted',
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_activity_logs (
  log_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(user_id),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  role VARCHAR(32) NOT NULL,
  action VARCHAR(120) NOT NULL,
  details TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

export const DatabaseRecords: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [users, setUsers] = useState<DbUserRecord[]>([]);
  const [logs, setLogs] = useState<DbActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'logs' | 'schema'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>(new Date().toLocaleTimeString());
  const [selectedRecord, setSelectedRecord] = useState<DbUserRecord | null>(null);

  const fetchDatabaseRecords = async () => {
    setLoading(true);
    try {
      // 1. Read local records first
      const localUsersRaw = localStorage.getItem('plm_database_records_v1');
      const localLogsRaw = localStorage.getItem('plm_activity_logs_v1');
      const localUsersMap: Record<string, DbUserRecord> = localUsersRaw
        ? JSON.parse(localUsersRaw)
        : {};
      const localLogs: DbActivityLog[] = localLogsRaw ? JSON.parse(localLogsRaw) : [];

      // 2. Fetch server-side records (captures users across all devices/browsers)
      const res = await fetch('/api/db/records');
      if (res.ok) {
        const data = await res.json();
        const serverUsers: DbUserRecord[] = data.users || [];
        const serverLogs: DbActivityLog[] = data.activity_logs || [];

        const mergedMap = new Map<string, DbUserRecord>();
        for (const u of serverUsers) {
          mergedMap.set(u.email.toLowerCase(), u);
        }
        for (const [emailKey, localU] of Object.entries(localUsersMap)) {
          const existing = mergedMap.get(emailKey);
          if (
            !existing ||
            new Date(localU.last_login_at).getTime() >=
              new Date(existing.last_login_at).getTime()
          ) {
            mergedMap.set(emailKey, localU);
          }
        }

        const combinedUsers = Array.from(mergedMap.values()).sort(
          (a, b) =>
            new Date(b.last_login_at).getTime() - new Date(a.last_login_at).getTime()
        );
        setUsers(combinedUsers);

        const logMap = new Map<string, DbActivityLog>();
        for (const l of [...serverLogs, ...localLogs]) {
          logMap.set(l.log_id, l);
        }
        const combinedLogs = Array.from(logMap.values()).sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setLogs(combinedLogs);
      } else {
        setUsers(
          Object.values(localUsersMap).sort(
            (a, b) =>
              new Date(b.last_login_at).getTime() - new Date(a.last_login_at).getTime()
          )
        );
        setLogs(localLogs);
      }
    } catch {
      const localUsersRaw = localStorage.getItem('plm_database_records_v1');
      const localLogsRaw = localStorage.getItem('plm_activity_logs_v1');
      const localUsersMap: Record<string, DbUserRecord> = localUsersRaw
        ? JSON.parse(localUsersRaw)
        : {};
      const localLogs: DbActivityLog[] = localLogsRaw ? JSON.parse(localLogsRaw) : [];
      setUsers(Object.values(localUsersMap));
      setLogs(localLogs);
    } finally {
      setLoading(false);
      setLastSynced(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    fetchDatabaseRecords();
    const interval = setInterval(fetchDatabaseRecords, 8000);
    if (!embedded && currentUser?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#A8432C]/15 text-[#A8432C] dark:text-[#E58C73] mx-auto flex items-center justify-center">
          <Database className="w-6 h-6" />
        </div>
        <h1 className="font-heading text-2xl text-[#13231F] dark:text-[#E6EEEA]">
          Admin Access Only
        </h1>
        <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0]">
          The User Login & Activity Database is restricted to administrators. Please sign in with the Admin account to view user records.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/signup?mode=signin')}
            className="px-5 py-2.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold cursor-pointer"
          >
            Sign In as Admin
          </button>
          <Link
            to="/home"
            className="px-5 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return () => clearInterval(interval);
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    if (!embedded && currentUser?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#A8432C]/15 text-[#A8432C] dark:text-[#E58C73] mx-auto flex items-center justify-center">
          <Database className="w-6 h-6" />
        </div>
        <h1 className="font-heading text-2xl text-[#13231F] dark:text-[#E6EEEA]">
          Admin Access Only
        </h1>
        <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0]">
          The User Login & Activity Database is restricted to administrators. Please sign in with the Admin account to view user records.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/signup?mode=signin')}
            className="px-5 py-2.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold cursor-pointer"
          >
            Sign In as Admin
          </button>
          <Link
            to="/home"
            className="px-5 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
      u.full_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.from_role || '').toLowerCase().includes(q) ||
      (u.to_role || '').toLowerCase().includes(q) ||
      (u.latest_action || '').toLowerCase().includes(q)
    );
  });

  const handleExportJson = () => {
    const payload = {
      database: 'people_like_me_prod',
      exported_at: new Date().toISOString(),
      tables: {
        users,
        user_activity_logs: logs,
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plm_user_database_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const headers = [
      'user_id',
      'full_name',
      'email',
      'role',
      'city',
      'login_count',
      'last_login_at',
      'from_role',
      'to_role',
      'years_experience',
      'matched_guide',
      'onboarding_completed',
      'latest_action',
    ];
    const rows = users.map((u) =>
      [
        u.user_id,
        `"${(u.full_name || '').replace(/"/g, '""')}"`,
        u.email,
        u.role,
        `"${(u.city || '').replace(/"/g, '""')}"`,
        u.login_count,
        u.last_login_at,
        `"${(u.from_role || '').replace(/"/g, '""')}"`,
        `"${(u.to_role || '').replace(/"/g, '""')}"`,
        u.years_experience ?? 0,
        `"${(u.matched_guide || '').replace(/"/g, '""')}"`,
        u.onboarding_completed,
        `"${(u.latest_action || '').replace(/"/g, '""')}"`,
      ].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plm_users_records_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!embedded && currentUser?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#A8432C]/15 text-[#A8432C] dark:text-[#E58C73] mx-auto flex items-center justify-center">
          <Database className="w-6 h-6" />
        </div>
        <h1 className="font-heading text-2xl text-[#13231F] dark:text-[#E6EEEA]">
          Admin Access Only
        </h1>
        <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0]">
          The User Login & Activity Database is restricted to administrators. Please sign in with the Admin account to view user records.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/signup?mode=signin')}
            className="px-5 py-2.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold cursor-pointer"
          >
            Sign In as Admin
          </button>
          <Link
            to="/home"
            className="px-5 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? 'space-y-6' : 'max-w-6xl mx-auto space-y-6 py-4'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2F7D5B] dark:text-[#5FBF8F]">
            <Database className="w-4 h-4" />
            <span>Live Production User Database • Auto-Sync Active</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA] mt-1">
            User Login & Activity Database Records
          </h1>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            Real-time database records of every user who signed up or logged in, their career transition profile, and chronological actions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={fetchDatabaseRecords}
            className="px-3.5 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh DB ({lastSynced})</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0]">
            Total Users in DB
          </span>
          <p className="text-2xl font-heading font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-1">
            {users.length}
          </p>
          <span className="text-[11px] text-[#2F7D5B] dark:text-[#5FBF8F]">
            Table: public.users
          </span>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0]">
            Total Login Events
          </span>
          <p className="text-2xl font-heading font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-1">
            {users.reduce((acc, u) => acc + (u.login_count || 1), 0)}
          </p>
          <span className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
            Authenticated sessions
          </span>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0]">
            Guide Connections
          </span>
          <p className="text-2xl font-heading font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-1">
            {users.filter((u) => u.matched_guide && u.matched_guide !== 'Not connected yet').length}
          </p>
          <span className="text-[11px] text-[#2D6B8F] dark:text-[#7FB6D6]">
            Table: guide_connections
          </span>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0]">
            Logged Actions
          </span>
          <p className="text-2xl font-heading font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-1">
            {logs.length}
          </p>
          <span className="text-[11px] text-[#8A5A00] dark:text-[#F2B134]">
            Table: user_activity_logs
          </span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-[#FFFFFF] dark:bg-[#0E1E1D] p-1 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                : 'text-[#55665F] dark:text-[#A6B8B0]'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>users ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                : 'text-[#55665F] dark:text-[#A6B8B0]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>user_activity_logs ({logs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                : 'text-[#55665F] dark:text-[#A6B8B0]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>DB Schema (SQL)</span>
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#55665F] dark:text-[#A6B8B0] absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, role, action..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] text-xs text-[#13231F] dark:text-[#E6EEEA]"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Users Table */}
      {activeTab === 'users' && (
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F1F5F2] dark:bg-[#122523] border-b border-[#D3DDD8] dark:border-[#2A403C] text-[11px] font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0]">
                  <th className="py-3 px-4">User / Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Last Login & Count</th>
                  <th className="py-3 px-3">Career Move Profile</th>
                  <th className="py-3 px-3">Matched Guide</th>
                  <th className="py-3 px-3">What They Did (Latest Action)</th>
                  <th className="py-3 px-3 text-right">Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D3DDD8]/60 dark:divide-[#2A403C]">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.email}
                    className="hover:bg-[#F1F5F2]/50 dark:hover:bg-[#122523]/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                        {u.full_name}
                      </div>
                      <div className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] font-mono">
                        {u.email}
                      </div>
                      <div className="text-[10px] text-[#55665F] dark:text-[#A6B8B0]">
                        ID: {u.user_id} • {u.city}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          u.role === 'guide'
                            ? 'bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F]'
                            : u.role === 'admin'
                            ? 'bg-[#A8432C]/15 text-[#A8432C] dark:text-[#E58C73]'
                            : 'bg-[#2D6B8F]/15 text-[#2D6B8F] dark:text-[#7FB6D6]'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                        {new Date(u.last_login_at).toLocaleString()}
                      </div>
                      <div className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                        Logins: <strong>{u.login_count || 1}</strong>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      {u.from_role || u.to_role ? (
                        <div>
                          <span className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                            {u.from_role || 'Current Role'} → {u.to_role || 'Target Role'}
                          </span>
                          <div className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                            {u.from_field || 'General'} • {u.years_experience ?? 3} yrs exp
                          </div>
                        </div>
                      ) : (
                        <span className="text-[#55665F] dark:text-[#A6B8B0] italic">
                          Onboarding in progress
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      {u.matched_guide && u.matched_guide !== 'Not connected yet' ? (
                        <span className="inline-flex items-center gap-1 text-[#2F7D5B] dark:text-[#5FBF8F] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{u.matched_guide}</span>
                        </span>
                      ) : (
                        <span className="text-[#55665F] dark:text-[#A6B8B0]">
                          Not connected yet
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 max-w-xs">
                      <div className="font-medium text-[#13231F] dark:text-[#E6EEEA] truncate">
                        {u.latest_action || 'Signed In'}
                      </div>
                      <div className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                        {u.actions_history?.length || 1} recorded events
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(u)}
                        className="px-2.5 py-1 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect Row</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Activity Logs */}
      {activeTab === 'logs' && (
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F1F5F2] dark:bg-[#122523] border-b border-[#D3DDD8] dark:border-[#2A403C] text-[11px] font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Event / Action</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D3DDD8]/60 dark:divide-[#2A403C]">
                {logs.map((log) => (
                  <tr key={log.log_id} className="hover:bg-[#F1F5F2]/50 dark:hover:bg-[#122523]/50">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#55665F] dark:text-[#A6B8B0] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                      {log.full_name}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                      {log.email}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F2B134]/20 text-[#8A5A00] dark:text-[#F2B134] font-semibold text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#13231F] dark:text-[#E6EEEA]">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Database Schema */}
      {activeTab === 'schema' && (
        <div className="bg-[#0B1D20] text-[#E6EEEA] border border-[#2A403C] rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F2B134] uppercase tracking-wider">
              Relational Schema Definition (schema.sql)
            </span>
            <span className="text-[11px] text-[#A6B8B0] font-mono">
              PostgreSQL 16 / JSONB Compatible
            </span>
          </div>
          <pre className="text-xs font-mono leading-relaxed overflow-x-auto text-[#5FBF8F] bg-[#102A2E] p-4 rounded-xl border border-[#2A403C]">
            {SQL_SCHEMA_TEXT}
          </pre>
        </div>
      )}

      {/* Modal to inspect a single user's complete database row + activity timeline */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D3DDD8] dark:border-[#2A403C]">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2F7D5B] dark:text-[#5FBF8F]">
                  Database Record Inspector • public.users
                </span>
                <h3 className="font-heading text-xl text-[#13231F] dark:text-[#E6EEEA]">
                  {selectedRecord.full_name} ({selectedRecord.email})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0]">
                User Action History ({selectedRecord.actions_history?.length || 0} events)
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {(selectedRecord.actions_history || []).map((act, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] flex items-start justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                        {act.action}:
                      </span>{' '}
                      <span className="text-[#55665F] dark:text-[#A6B8B0]">{act.details}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#55665F] dark:text-[#A6B8B0] shrink-0">
                      {new Date(act.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0]">
                Raw Database Row (JSONB)
              </h4>
              <pre className="text-[11px] font-mono bg-[#0B1D20] text-[#5FBF8F] p-4 rounded-xl overflow-x-auto max-h-72">
                {JSON.stringify(selectedRecord, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};