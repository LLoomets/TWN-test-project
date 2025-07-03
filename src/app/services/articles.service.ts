import { inject, Injectable } from '@angular/core';
import { Article } from '../model/article.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  http = inject(HttpClient);
  
  getArticle() {
    const url = `https://proovitoo.twn.ee/api/list/972d2b8a`;
    return this.http.get<Article>(url);
  }

  getArticleList() {
    const url = `https://proovitoo.twn.ee/api/list`; 
    return this.http.get<{ list: Article[] }>(url).pipe(
      map((res) => res.list) 
    );
  }
}
