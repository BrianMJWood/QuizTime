export interface Question {
  label: string;
  answers: Array<string>;
  correctAnswer: number;
}

export interface DataResponse {
  content: Question[];
}

export interface QuizState {
  questions: Array<Question>;
  activeQuestion: number;
  answers: { [question: number]: number };
  isLoading: boolean;
  error: string;
}
