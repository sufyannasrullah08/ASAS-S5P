/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Trophy, Download, ArrowLeft, AlertCircle } from 'lucide-react';
import { StudentResult } from '../types';

interface ResultPageProps {
  result: StudentResult;
  onBack: () => void;
}

export default function ResultPage({ result, onBack }: ResultPageProps) {
  const getStatusMessage = () => {
    if (result.status === 'submitted_by_cheat') {
      return {
        title: 'DISKUALIFIKASI',
        desc: 'Ujian dihentikan otomatis karena terdeteksi tindakan yang melanggar ketentuan (pindah tab/aplikasi).',
        color: 'text-red-600',
        bg: 'bg-red-50',
        iconColor: 'text-red-500'
      };
    }
    return {
      title: 'UJIAN SELESAI',
      desc: 'Jawaban Anda telah berhasil disimpan ke sistem. Terima kasih telah mengikuti ujian dengan jujur.',
      color: 'text-primary',
      bg: 'bg-secondary',
      iconColor: 'text-primary'
    };
  };

  const status = getStatusMessage();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className={`rounded-xl p-8 border ${status.bg} border-exam-border border-opacity-50 flex flex-col items-center text-center space-y-4 shadow-sm`}>
        <div className={`p-4 rounded-full bg-white shadow-md ${status.iconColor}`}>
          <Trophy size={40} />
        </div>
        <div>
          <h2 className={`text-xl font-bold uppercase tracking-tight ${status.color}`}>{status.title}</h2>
          <p className="text-exam-muted text-sm font-medium max-w-sm mx-auto mt-1">{status.desc}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-10 shadow-md border border-exam-border flex flex-col items-center relative overflow-hidden">
        <h3 className="text-exam-muted font-bold uppercase tracking-[0.2em] text-[10px] mb-8 text-center w-full">Hasil Akhir</h3>
        
        <div className="relative mb-10">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
            <circle
              cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent"
              strokeDasharray={2 * Math.PI * 80}
              strokeDashoffset={2 * Math.PI * 80 * (1 - result.score / 100)}
              strokeLinecap="round" className="text-primary transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-gray-800 tabular-nums leading-none">{Math.floor(result.score)}</span>
            <span className="text-exam-muted font-bold text-[10px] uppercase tracking-widest mt-2">Poin</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 w-full border-t border-exam-border pt-8">
          <div className="text-center space-y-1">
            <div className="text-xl font-black text-green-500">{result.correctCount}</div>
            <div className="text-[10px] text-exam-muted font-bold uppercase tracking-widest">Benar</div>
          </div>
          <div className="text-center space-y-1 border-x border-exam-border">
            <div className="text-xl font-black text-red-500">{result.wrongCount}</div>
            <div className="text-[10px] text-exam-muted font-bold uppercase tracking-widest">Salah</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-xl font-black text-exam-muted">{result.emptyCount}</div>
            <div className="text-[10px] text-exam-muted font-bold uppercase tracking-widest">Kosong</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-exam-border divide-y divide-bg">
        <div className="flex items-center justify-between py-3">
          <span className="text-exam-muted font-bold text-[10px] uppercase tracking-widest">Peserta</span>
          <span className="text-exam-text font-bold text-sm tracking-tight">{result.name}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-exam-muted font-bold text-[10px] uppercase tracking-widest">Kelas / Absen</span>
          <span className="text-exam-text font-bold text-sm">{result.studentClass} | No. {result.absentNum}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-exam-muted font-bold text-[10px] uppercase tracking-widest">Waktu Selesai</span>
          <span className="text-exam-text font-bold text-sm">{new Date(result.submitTime).toLocaleTimeString('id-ID')} WIB</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button onClick={onBack} className="flex-1 py-4 bg-white border border-exam-border text-exam-text font-bold rounded-lg hover:bg-bg transition-all flex items-center justify-center gap-2 shadow-sm">
          <ArrowLeft size={18} /> Kembali ke Login
        </button>
        <button onClick={() => window.print()} className="flex-1 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all">
          <Download size={18} /> Simpan PDF
        </button>
      </div>

      <div className="p-4 bg-bg rounded-lg border border-exam-border flex items-start gap-3">
        <AlertCircle size={18} className="text-primary shrink-0 mt-0.5" />
        <p className="text-[11px] text-exam-muted leading-relaxed font-medium">HASIL RESMI: Data ini telah diamankan oleh sistem integritas SMPN 5 Pamekasan.</p>
      </div>
    </div>
  );
}
