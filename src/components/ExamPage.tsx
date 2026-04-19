/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  Send,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QUESTIONS } from '../data/questions';
import { StudentInfo, StudentResult } from '../types';

interface ExamPageProps {
  studentInfo: StudentInfo;
  onFinish: (result: StudentResult) => void;
}

export default function ExamPage({ studentInfo, onFinish }: ExamPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          calculateAndFinish('submitted_by_timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Anti-cheat: Visibility Change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        calculateAndFinish('submitted_by_cheat');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Anti-cheat: Page Blur
  useEffect(() => {
    const handleBlur = () => {
      calculateAndFinish('submitted_by_cheat');
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  const calculateAndFinish = (status: StudentResult['status']) => {
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let emptyCount = 0;

    QUESTIONS.forEach((q) => {
      if (!answers[q.id]) {
        emptyCount++;
      } else if (answers[q.id] === q.correctAnswer) {
        correctCount++;
        score += 2.5; // 40 questions * 2.5 = 100
      } else {
        wrongCount++;
      }
    });

    onFinish({
      id: Math.random().toString(36).substr(2, 9),
      name: studentInfo.name,
      studentClass: studentInfo.class,
      absentNum: studentInfo.absentNum,
      answers,
      score,
      correctCount,
      wrongCount,
      emptyCount,
      startTime: Date.now() - (3600 - timeLeft) * 1000,
      submitTime: Date.now(),
      status
    });
  };

  const handleSelectAnswer = (questionId: number, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = QUESTIONS[currentIndex];

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr] h-[calc(100vh-70px)] overflow-hidden relative">
      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={`
              fixed lg:static top-0 left-0 z-40 h-full w-[300px] bg-white border-r border-exam-border p-6 overflow-y-auto flex flex-col gap-6
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <div className="flex justify-between items-center lg:hidden">
              <h3 className="font-bold text-exam-text">Navigasi</h3>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-exam-muted"><X size={20} /></button>
            </div>

            <div className="text-center pb-4 border-b border-exam-border">
              <h3 className="font-bold text-xs text-exam-muted uppercase tracking-widest mb-2">Sisa Waktu</h3>
              <div className="bg-exam-text text-white py-2 rounded-lg font-mono text-xl tracking-widest">
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="flex justify-between items-center text-[10px] font-bold text-exam-muted uppercase tracking-widest mb-3">
                <span>Daftar Soal</span>
                <span>{Object.keys(answers).length} / {QUESTIONS.length}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {QUESTIONS.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = currentIndex === idx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`
                        aspect-square rounded-md flex items-center justify-center text-xs font-bold border transition-all
                        ${isCurrent ? 'bg-primary text-white border-primary shadow-md scale-110 z-10' : ''}
                        ${!isCurrent && isAnswered ? 'bg-primary/20 text-primary border-primary/20' : ''}
                        ${!isCurrent && !isAnswered ? 'bg-white text-exam-muted border-exam-border hover:border-primary' : ''}
                      `}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-exam-border">
              <button
                onClick={() => { if(confirm("Selesaikan ujian sekarang?")) calculateAndFinish('completed'); }}
                className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-primary/20"
              >
                <Send size={18} /> Selesaikan Ujian
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-bg p-4 md:p-8 lg:p-12 pb-24 lg:pb-12 flex flex-col relative">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col gap-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl border border-exam-border shadow-sm">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-bg rounded-lg text-primary"><Menu size={20} /></button>
            <div className="bg-exam-text text-white px-4 py-1.5 rounded-lg font-mono font-bold text-lg tracking-widest">{formatTime(timeLeft)}</div>
            <div className="text-xs font-bold text-primary bg-secondary px-3 py-1.5 rounded-full border border-exam-border">Soal {currentIndex + 1} / 40</div>
          </div>

          <div className="bg-white rounded-xl border border-exam-border shadow-soft p-6 md:p-10 flex flex-col min-h-[450px]">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-exam-border">
              <span className="font-bold text-exam-muted text-xs uppercase tracking-widest">Nomor {currentIndex + 1}</span>
              <span className="font-bold text-primary text-xs uppercase tracking-widest">Bobot: 2.5</span>
            </div>

            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-medium text-exam-text leading-relaxed mb-10">{currentQuestion.text}</h2>
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectAnswer(currentQuestion.id, opt.id)}
                    className={`
                      w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all flex items-center gap-4 cursor-pointer
                      ${answers[currentQuestion.id] === opt.id ? 'border-primary bg-secondary text-primary' : 'border-exam-border hover:bg-bg hover:border-primary/50'}
                    `}
                  >
                    <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center font-bold text-sm shrink-0">{opt.id}</span>
                    <span className="text-base md:text-lg font-medium">{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="px-6 py-3 bg-white border border-exam-border text-exam-text font-bold rounded-lg flex items-center gap-2 hover:bg-bg disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft size={20} /> Sebelumnya
            </button>
            <div className="hidden sm:flex items-center gap-2 text-exam-muted font-bold text-xs uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Tersimpan Otomatis
            </div>
            <button
              onClick={() => {
                if (currentIndex === QUESTIONS.length - 1) {
                  if(confirm("Selesaikan ujian?")) calculateAndFinish('completed');
                } else {
                  setCurrentIndex(prev => prev + 1);
                }
              }}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold flex items-center gap-2 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <span>{currentIndex === QUESTIONS.length - 1 ? 'Selesai' : 'Berikutnya'}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary bg-secondary border border-exam-border px-4 py-2 rounded-full shadow-lg">
          <AlertCircle size={14} className="animate-pulse" /> Anti-Cheat Aktif
        </div>
      </main>
    </div>
  );
}
