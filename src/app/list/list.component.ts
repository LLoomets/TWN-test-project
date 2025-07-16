import { Component, inject, OnInit, signal } from '@angular/core';
import { Article } from '../model/article.model';
import { ArticlesService } from '../services/articles.service';
import { catchError, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  articleService = inject(ArticlesService);
  articleItems = signal<Article[]>([]);
  originalData: Article[] = [];
  loading = signal(true);

  sortField: keyof Article | null = null;
  sortDirection: 'asc' | 'desc' | 'default' = 'default';

  expandedRow: number | null = null;

  currentPage = signal(1);
  rowsPerPage = 10;

  ngOnInit(): void {
    this.articleService
      .getArticleList()
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
        finalize(() => this.loading.set(false))
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

      if (field === 'personal_code') {
        const parseDate = (id: number): Date => {
          const idStr = String(id);
          const centuryCode = idStr.charAt(0);
          let century = '';

          if (centuryCode === '1' || centuryCode === '2') century = '18';
          else if (centuryCode === '3' || centuryCode === '4') century = '19';
          else if (centuryCode === '5' || centuryCode === '6') century = '20';

          const year = parseInt(century + idStr.substring(1,3));
          const month = parseInt(idStr.substring(3,5));
          const day = parseInt(idStr.substring(5,7));

          return new Date(year, month, day);
        }

        const dateA = parseDate(a.personal_code);
        const dateB = parseDate(b.personal_code);

        return this.sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
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

  getSortIcon(field: keyof Article): string {
    if (this.sortField !== field) return 'fa-solid fa-sort';
    if (this.sortDirection === 'asc') return 'fa-solid fa-sort-down';
    if (this.sortDirection === 'desc') return 'fa-solid fa-sort-up';
    return 'fa-solid fa-sort';
  }

  toggleExpand(index: number) {
    if (this.expandedRow === index) {
      this.expandedRow = null;
    } else {
      this.expandedRow = index;
    }
  }

  get paginatedList() : Article[] {
    const start = (this.currentPage() - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.articleItems().slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.articleItems().length / this.rowsPerPage);
  }

  changePage(page: number) {
    this.currentPage.set(page);
    this.expandedRow = null;
  }

  visiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages;
    const maxVisible = 5;
  
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
  
    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }
  
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  
    return pages;
  }
}
