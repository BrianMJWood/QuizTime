import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Question, QuizState } from '@quiz/data-access/quiz.models';
import { catchError, map, pipe, switchMap, tap, throwError } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { QuizService } from '../services/quiz.service';

const initialState: QuizState = {
  questions: [],
  activeQuestion: 0,
  answers: {},
  isLoading: false,
  error: '',
};

export const QuizStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, quizService = inject(QuizService)) => ({
    nextQuestion: () => {
      patchState(store, () => ({ activeQuestion: store.activeQuestion() + 1 }));
    },
    prevQuestion: () => {
      patchState(store, () => ({ activeQuestion: store.activeQuestion() - 1 }));
    },
    answerQuestion: (answer: number) => {
      const answers = { ...store.answers(), [store.activeQuestion()]: answer };
      patchState(store, { answers });
    },
    resetQuiz: () => {
      patchState(store, { activeQuestion: 0, answers: {} });
    },
    loadQuestions: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((category) =>
          quizService.getQuestions(category).pipe(
            map(
              (response) => JSON.parse(response.answer.content) as Question[]
            ),
            tapResponse({
              next: (questions) => patchState(store, { questions }),
              error: () => {
                patchState(store, { error: 'Something went wrong!' });
              },
              finalize: () => patchState(store, { isLoading: false }),
            })
          )
        )
      )
    ),
  })),
  withComputed((store) => ({
    currentQuestion: computed(() =>
      store
        .questions()
        .find((q, index) => (index === store.activeQuestion() ? q : null))
    ),
    isPrev: computed(() => store.activeQuestion() > 0),
    isNext: computed(
      () => store.activeQuestion() < store.questions()?.length - 1
    ),
    currentQuestionAnswer: computed(
      () => store.answers()[store.activeQuestion()] ?? -1
    ),
    score: computed(() => {
      let score = 0;
      store.questions().forEach((question, index) => {
        if (store.answers()[index] === question.correctAnswer) {
          score++;
        }
      });
      return score;
    }),
  }))
);
