import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesService } from '../services/articles.service';
import { Article } from '../model/article.model';
import { catchError, finalize } from 'rxjs';

@Component({
  selector: 'app-article',
  imports: [CommonModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit {
  articleService = inject(ArticlesService);
  article = signal<Article | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.articleService
      .getArticle()
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((article) => {
        this.article.set(article);
      });
  }
}

