/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock } from 'lucide-react';
import { QUESTIONS } from './data/questions';
import { StudentResult } from './types';

// Components
import LoginPage from './components/LoginPage';
import ExamPage from './components/ExamPage';
import ResultPage from './components/ResultPage';
import AdminPage from './components/AdminPage';

type ViewState = 'login' | 'exam' | 'result' | 'admin';

export default function App() {
  const [view, setView] = useState<ViewState>('login');
  const [studentInfo, setStudentInfo] = useState<{ name: string; class: string; absentNum: string } | null>(null);
  const [currentResult, setCurrentResult] = useState<StudentResult | null>(null);

  // Handle Login
  const onStartExam = (info: { name: string; class: string; absentNum: string }) => {
    setStudentInfo(info);
    setView('exam');
    
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  // Handle Exam Submission
  const onFinishExam = useCallback((result: StudentResult) => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setCurrentResult(result);
    setView('result');

    const savedResultsStr = localStorage.getItem('cbt_results') || '[]';
    const savedResults = JSON.parse(savedResultsStr);
    savedResults.push(result);
    localStorage.setItem('cbt_results', JSON.stringify(savedResults));
  }, []);

  const onBackToLogin = () => {
    setStudentInfo(null);
    setCurrentResult(null);
    setView('login');
  };

  return (
    <div className="min-h-screen bg-bg font-sans text-exam-text selection:bg-primary/20">
      <header className="h-[70px] bg-primary text-white sticky top-0 z-50 shadow-md flex justify-between items-center px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary font-black text-xl shadow-md">
            S5P
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-base leading-tight">ASAS Informatika 2026</h1>
            <p className="text-[10px] opacity-80 uppercase tracking-wider">SMPN 5 PAMEKASAN • KELAS IX</p>
          </div>
        </div>
        
        {studentInfo && view === 'exam' && (
          <div className="flex flex-col items-end">
            <div className="text-sm font-bold leading-none mb-1">{studentInfo.name}</div>
            <div className="text-[10px] opacity-80 uppercase tracking-tighter">
              {studentInfo.class} | Absen: {studentInfo.absentNum}
            </div>
          </div>
        )}

        {view === 'login' && (
          <button 
            onClick={() => setView('admin')}
            className="flex items-center gap-2 text-xs font-bold bg-white/20 hover:bg-white/30 transition-all px-3 py-2 rounded-lg border border-white/30"
          >
            <Lock size={14} />
            <span>Admin</span>
          </button>
        )}
      </header>

      <main className={`mx-auto ${view === 'exam' ? 'w-full' : 'container max-w-5xl px-4 py-8'}`}>
        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <LoginPage onStart={onStartExam} />
            </motion.div>
          )}

          {view === 'exam' && studentInfo && (
            <motion.div key="exam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
              <ExamPage studentInfo={studentInfo} onFinish={onFinishExam} />
            </motion.div>
          )}

          {view === 'result' && currentResult && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <ResultPage result={currentResult} onBack={onBackToLogin} />
            </motion.div>
          )}

          {view === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <AdminPage onBack={() => setView('login')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto py-8 text-center text-exam-muted text-xs border-t border-exam-border bg-gray-50">
        <p>&copy; 2026 CBT Profesional - ASAS Informatika SMPN 5 Pamekasan</p>
      </footer>
    </div>
  );
}
