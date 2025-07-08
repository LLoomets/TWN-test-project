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

  getSexLabel(sex : string): string {
    if(sex === 'm') return 'Mees';
    if(sex === 'f') return 'Naine';
    return '';
  }

  getBirthDateFromId(id: number): string {
    const idStr = String(id);

    const centuryCode = idStr.charAt(0);
    let century = '';

    if (centuryCode === '1' || centuryCode === '2') century = '18';
    else if (centuryCode === '3' || centuryCode === '4') century = '19';
    else if (centuryCode === '5' || centuryCode === '6') century = '20';

    const year = century + idStr.substring(1,3);
    const month = idStr.substring(3,5);
    const day = idStr.substring(5,7);

    return `${day}.${month}.${year}`;
  }
}
