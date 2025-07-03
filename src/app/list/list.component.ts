import { Component, inject, OnInit, signal } from '@angular/core';
import { Article } from '../model/article.model';
import { ArticlesService } from '../services/articles.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-list',
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  articleService = inject(ArticlesService);
  articleItems = signal<Article[]>([]);

    ngOnInit(): void {
      this.articleService
        .getArticleList()
        .pipe(
          catchError((err) => {
            console.log(err);
            throw err;
          })
        )
        .subscribe((article: Article[]) => {
          this.articleItems.set(article)
        });
    }
}
