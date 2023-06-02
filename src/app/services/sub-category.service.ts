import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import {Observable} from 'rxjs'
import { environment } from "../../environments/environment";

export interface Sub_Category {
  _id?: string | any,
  name: 
  {
    ru: string | any,
    en: string | any
  },
  adult: boolean,
  hide: boolean
}

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  constructor(private http: HttpClient) { }

  get(query?: any, sort?: any, select?: any): Observable<any[]> {
    let params = new HttpParams();

    if (query) {
      params = params.set("query", JSON.stringify(query))
    }

    if (sort) {
      params = params.set("sort", JSON.stringify(sort))
    }

    if (select) {
      params = params.set("select", JSON.stringify(select))
    }

    return this.http.get<any[]>(`${environment.apiURL}/api/wtf/sub-category`, { params: params })
  }

  getById(_id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/api/wtf/sub-category/${_id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/api/wtf/sub-category`, data)
  }

  patch(data: any, _id: string): Observable<any> {
    return this.http.patch<any>(`${environment.apiURL}/api/wtf/sub-category/${_id}`, data)
  }

  delete(_id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiURL}/api/wtf/sub-category/${_id}`);
  }

  changeOrder(sub_categories: any[]): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/api/wtf/sub-category/changeOrder`, sub_categories)
  }


}
