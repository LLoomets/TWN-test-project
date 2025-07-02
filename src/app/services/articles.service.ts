import { inject, Injectable } from '@angular/core';
import { Article } from '../model/article.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  http = inject(HttpClient);
  
  getArticlesFromApi() {
    const url = `https://proovitoo.twn.ee/api/list/972d2b8a`;
    return this.http.get<Article>(url);
  }
}
