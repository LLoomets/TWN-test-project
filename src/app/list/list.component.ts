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
  originalData: Article[] = [];

  sortField: keyof Article | null = null;
  sortDirection: 'asc' | 'desc' | 'default' = 'default';

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
        this.articleItems.set(article);
        this.originalData = article;
      });
  }

  sortBy(field: keyof Article) {
    if (this.sortField !== field) {
      this.sortField = field;
      this.sortDirection = 'asc';
    } else {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : this.sortDirection === 'desc' ? 'default' : 'asc';
    }

    if (this.sortDirection === 'default') {
      this.articleItems.set(this.originalData);
      this.sortField = null;
      return;
    }

    const sorted = [...this.articleItems()].sort((a,b) => {
      if (field === 'sex') {
        const order = { 'f' : 0, 'm' : 1};
        const valA = order[a.sex] ?? 2;
        const valB = order[b.sex] ?? 2;

        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      const valA = (a[field] ?? '').toString().toLowerCase();
      const valB = (b[field] ?? '').toString().toLowerCase();

      const isEmptyA = !valA || valA.trim() === '';
      const isEmptyB = !valB || valB.trim() === '';

      if (isEmptyA && !isEmptyB) return 1;
      if (!isEmptyA && isEmptyB) return -1;

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    })
    this.articleItems.set(sorted);
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
