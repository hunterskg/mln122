import { Question, UserAnswer, DiagnosticResult, Archetype, OptionType } from '@/types/quiz';
import chaptersData from '@/data/chapters.json';
import archetypesData from '@/data/archetypes.json';

export function calculateDiagnosticResult(
  questions: Question[],
  userAnswers: Record<string, string> // questionId -> selectedOptionId
): DiagnosticResult {
  const archetypes = archetypesData as Archetype[];
  let correctCount = 0;

  const typeDistribution: Record<OptionType, number> = {
    marxist: 0,
    folk_fallacy: 0,
    classical_bourgeois: 0,
    technological_fetishism: 0,
  };

  const processedAnswers: UserAnswer[] = [];

  // Group by chapter
  const chapterStats: Record<number, { correct: number; total: number; title: string }> = {};

  chaptersData.forEach((ch) => {
    chapterStats[ch.id] = { correct: 0, total: 0, title: ch.shortTitle };
  });

  questions.forEach((q) => {
    const selectedOptionId = userAnswers[q.id];
    const selectedOption = q.options.find((o) => o.id === selectedOptionId);
    const isCorrect = selectedOptionId === q.correctOptionId;

    if (chapterStats[q.chapterId]) {
      chapterStats[q.chapterId].total += 1;
    }

    if (selectedOption) {
      typeDistribution[selectedOption.type] = (typeDistribution[selectedOption.type] || 0) + 1;
      if (isCorrect) {
        correctCount += 1;
        if (chapterStats[q.chapterId]) {
          chapterStats[q.chapterId].correct += 1;
        }
      }

      processedAnswers.push({
        questionId: q.id,
        selectedOptionId,
        isCorrect,
        selectedType: selectedOption.type,
      });
    }
  });

  const totalQuestions = questions.length;
  const totalScorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const chapterScores = Object.entries(chapterStats)
    .filter(([_, stat]) => stat.total > 0)
    .map(([chapIdStr, stat]) => {
      const chapterId = Number(chapIdStr);
      const percentage = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      let status: 'mastered' | 'pass' | 'review_needed' = 'review_needed';
      if (percentage >= 75) {
        status = 'mastered';
      } else if (percentage >= 50) {
        status = 'pass';
      }

      return {
        chapterId,
        chapterTitle: stat.title,
        correct: stat.correct,
        total: stat.total,
        percentage,
        status,
      };
    });

  // Archetype diagnosis determination
  const marxistRate = totalQuestions > 0 ? (typeDistribution.marxist / totalQuestions) : 0;
  let determinedArchetypeId = 'folk_empiricist';

  if (marxistRate >= 0.7) {
    determinedArchetypeId = 'marxist_dialectician';
  } else {
    // Find the highest error pattern
    const errors: { type: OptionType; count: number }[] = [
      { type: 'technological_fetishism', count: typeDistribution.technological_fetishism },
      { type: 'classical_bourgeois', count: typeDistribution.classical_bourgeois },
      { type: 'folk_fallacy', count: typeDistribution.folk_fallacy },
    ];
    errors.sort((a, b) => b.count - a.count);

    if (errors[0].type === 'technological_fetishism') {
      determinedArchetypeId = 'techno_fetishist';
    } else if (errors[0].type === 'classical_bourgeois') {
      determinedArchetypeId = 'classical_bourgeois';
    } else {
      determinedArchetypeId = 'folk_empiricist';
    }
  }

  const archetype =
    archetypes.find((a) => a.id === determinedArchetypeId) || archetypes[0];

  return {
    totalQuestions,
    correctAnswers: correctCount,
    totalScorePercentage,
    chapterScores,
    typeDistribution,
    archetype,
    answers: processedAnswers,
  };
}
