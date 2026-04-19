/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { 
  Lock, 
  Download, 
  Trash2, 
  ArrowLeft, 
  Search, 
  Users,
  Award,
  ShieldCheck,
  LogOut,
  FileSpreadsheet
} from 'lucide-react';
import { StudentResult } from '../types';
import { motion } from 'motion/react';

interface AdminPageProps {
  onBack: () => void;
}

export default function AdminPage({ onBack }: AdminPageProps) {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      const saved = localStorage.getItem('cbt_results') || '[]';
      setResults(JSON.parse(saved).sort((a: StudentResult, b: StudentResult) => b.submitTime - a.submitTime));
    }
  }, [isLoggedIn]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert("Password salah!");
    }
  };

  const exportCSV = () => {
    if (results.length === 0) return;
    const headers = ['Nama', 'Kelas', 'Absen', 'Nilai', 'Benar', 'Salah', 'Kosong', 'Status', 'Waktu'];
    const rows = results.map(r => [
      r.name, r.studentClass, r.absentNum, r.score, r.correctCount, r.wrongCount, r.emptyCount, r.status,
      new Date(r.submitTime).toLocaleString('id-ID')
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Hasil_Ujian_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const clearResults = () => {
    if (confirm("Hapus semua data hasil ujian? Tindakan ini permanen.")) {
      localStorage.removeItem('cbt_results');
      setResults([]);
    }
  };

  const filteredResults = results.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.studentClass.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const averageScore = results.length > 0 
    ? (results.reduce((acc, curr) => acc + curr.score, 0) / results.length).toFixed(1) 
    : 0;

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-10">
        <div className="bg-white rounded-xl shadow-lg border border-exam-border overflow-hidden">
          <div className="p-8 text-center bg-primary text-white">
            <Lock size={32} className="mx-auto mb-4" />
            <h2 className="text-xl font-bold">Admin Login</h2>
            <p className="text-secondary text-xs mt-1">Gunakan akses admin</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-exam-muted uppercase tracking-widest ml-1">Password Access</label>
              <input
                autoFocus type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-exam-border focus:ring-2 focus:ring-primary outline-none bg-bg transition-all text-center tracking-[0.5em] font-mono text-xl"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              Masuk Dashboard
            </button>
            <button type="button" onClick={onBack} className="w-full text-xs font-bold text-exam-muted hover:text-black transition-all">
              Batal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-exam-text">Panel Data Admin</h2>
          <p className="text-exam-muted text-sm">Monitor hasil ujian siswa SMPN 5 Pamekasan</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="px-4 py-2 bg-white border border-exam-border text-exam-text rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-bg shadow-sm">
            <FileSpreadsheet size={16} /> Export CSV
          </button>
          <button onClick={() => setIsLoggedIn(false)} className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-primary-dark shadow-md">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Peserta', value: results.length, icon: Users, color: 'text-gray-600' },
          { label: 'Rata-rata', value: averageScore, icon: Award, color: 'text-gray-700' },
          { label: 'Sistem', value: 'AMAN', icon: ShieldCheck, color: 'text-emerald-600' },
          { label: 'Curang', value: results.filter(r => r.status === 'submitted_by_cheat').length, icon: Lock, color: 'text-rose-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-exam-border shadow-sm">
            <p className="text-exam-muted font-bold text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-center gap-2">
               <stat.icon size={14} className={stat.color} />
               <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-exam-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-bg flex flex-col md:flex-row justify-between items-center gap-4 bg-secondary/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-exam-muted" size={16} />
            <input
              type="text" placeholder="Cari nama atau kelas..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg rounded-lg border-none outline-none focus:ring-2 focus:ring-primary transition-all text-xs font-bold"
            />
          </div>
          <button onClick={clearResults} className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:underline px-2 py-1">
            <Trash2 size={12} /> Hapus Database
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg text-[10px] font-bold text-exam-muted uppercase tracking-widest border-b border-exam-border">
                <th className="px-6 py-4">Siswa</th>
                <th className="px-6 py-4 text-center">Kelas</th>
                <th className="px-6 py-4 text-center">Nilai</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg">
              {filteredResults.map((r, idx) => (
                <tr key={idx} className="hover:bg-bg/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-exam-text text-sm">{r.name}</div>
                    <div className="text-[10px] text-exam-muted font-bold uppercase">ABSN: {r.absentNum}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-primary text-xs">{r.studentClass}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-black text-lg ${r.score >= 75 ? 'text-green-600' : 'text-amber-600'}`}>{Math.floor(r.score)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${r.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {r.status === 'completed' ? 'Aman' : 'Curang'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-[10px] text-exam-muted">
                    {new Date(r.submitTime).toLocaleString('id-ID', { dateStyle:'short', timeStyle:'short'})}
                  </td>
                </tr>
              ))}
              {filteredResults.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-exam-muted opacity-30 text-xs font-bold uppercase tracking-[4px]">Data Kosong</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
