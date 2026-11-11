export type OptionType = 'marxist' | 'folk_fallacy' | 'classical_bourgeois' | 'technological_fetishism';

export interface Option {
  id: string;
  type: OptionType;
  text: string;
}

export interface Question {
  id: string;
  chapterId: number;
  scenario: string;
  imageUrl?: string;
  imageAlt?: string;
  diagramType?: 'value_structure' | 'dual_labor' | 'capital_circuit' | 'monopoly_price' | 'currency_circulation';
  question: string;
  options: Option[];
  correctOptionId: string;
  explanation: {
    marxistCore: string;
    fallacyBreakdown: string;
    textbookRef: {
      chapter: number;
      section: string;
      page?: number;
      curriculum: string; // e.g., "Giáo trình Kinh tế chính trị Mác - Lênin (Bộ GD&ĐT 2021)"
    };
  };
}

export interface ChapterMeta {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  coreConcepts: string[];
  recommendedPages: string;
}

export interface Archetype {
  id: string;
  code: string;
  name: string;
  title: string;
  tagline: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  prescription: string;
  accentColor: string;
  imageUrl?: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  selectedType: OptionType;
}

export interface DiagnosticResult {
  totalQuestions: number;
  correctAnswers: number;
  totalScorePercentage: number;
  chapterScores: {
    chapterId: number;
    chapterTitle: string;
    correct: number;
    total: number;
    percentage: number;
    status: 'mastered' | 'pass' | 'review_needed';
  }[];
  typeDistribution: Record<OptionType, number>;
  archetype: Archetype;
  answers: UserAnswer[];
}
