/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { User, ClipboardList, LogIn, Hash } from 'lucide-react';

interface LoginPageProps {
  onStart: (info: { name: string; class: string; absentNum: string }) => void;
}

export default function LoginPage({ onStart }: LoginPageProps) {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('IX-A');
  const [absentNum, setAbsentNum] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name && studentClass && absentNum) {
      onStart({ name, class: studentClass, absentNum });
    }
  };

  const classes = ['IX-A', 'IX-B', 'IX-C', 'IX-D', 'IX-E'];

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-exam-border overflow-hidden">
      <div className="bg-primary px-8 py-10 text-white text-center relative">
        <div className="relative z-10 space-y-4">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary font-black text-3xl shadow-xl">
            S5P
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Login Siswa</h2>
          <p className="text-secondary text-xs font-medium opacity-80 uppercase tracking-widest">ASAS Informatika 2026</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-exam-muted uppercase tracking-widest ml-1">Nama Lengkap</label>
            <div className="relative">
               <User className="absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-50" size={18} />
               <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama sesuai absen"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-exam-border focus:ring-2 focus:ring-primary outline-none bg-bg transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-exam-muted uppercase tracking-widest ml-1">Kelas</label>
              <div className="relative">
                <ClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-50" size={18} />
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-exam-border focus:ring-2 focus:ring-primary outline-none bg-bg appearance-none"
                >
                  {classes.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-exam-muted uppercase tracking-widest ml-1">No. Absen</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-50" size={18} />
                <input
                  required
                  type="number"
                  min="1"
                  max="50"
                  value={absentNum}
                  onChange={(e) => setAbsentNum(e.target.value)}
                  placeholder="01"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-exam-border focus:ring-2 focus:ring-primary outline-none bg-bg"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
        >
          <LogIn size={20} />
          Mulai Ujian
        </button>

        <div className="text-center pt-4 border-t border-exam-border">
          <div className="flex items-center justify-center gap-4 text-[10px] text-exam-muted uppercase tracking-[2px] font-bold">
            <span>60 Menit</span>
            <span className="w-1 h-1 bg-primary/30 rounded-full" />
            <span>40 Soal</span>
          </div>
        </div>
      </form>
    </div>
  );
}
