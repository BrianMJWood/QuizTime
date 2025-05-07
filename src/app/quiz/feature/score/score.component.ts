import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { QuizStore } from '@quiz/data-access/store/quiz.store';

@Component({
  selector: 'app-score',
  imports: [RouterModule, CommonModule],
  templateUrl: './score.component.html',
  styleUrl: './score.component.css',
})
export class ScoreComponent {
  #router = inject(Router);
  #quizStore = inject(QuizStore);

  score = this.#quizStore.score;
  scoreMessage = computed(() => {
    if (this.score() >= 0 && this.score() < 4) {
      return 'You may want to do the quiz again...';
    }

    if (this.score() >= 4 && this.score() < 8) {
      return 'That was a very good effort!';
    }

    return 'Congratulations! Perfect score';
  });

  startQuizAgain() {
    this.#quizStore.resetQuiz();
    this.#router.navigate(['quiz']);
  }
}
