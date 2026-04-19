/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
}

export interface StudentInfo {
  name: string;
  class: string;
  absentNum: string;
}

export interface StudentResult {
  id: string;
  name: string;
  studentClass: string;
  absentNum: string;
  answers: Record<number, string>;
  score: number;
  correctCount: number;
  wrongCount: number;
  emptyCount: number;
  startTime: number;
  submitTime: number;
  status: 'completed' | 'submitted_by_cheat' | 'submitted_by_timeout';
}
