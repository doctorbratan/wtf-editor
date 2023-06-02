import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as moment from 'moment';

import { environment } from "../../environments/environment";

export interface Category {
  _id?: string | any,
  image?: string | any,
  imageUpload?: any,
  background?: string | any,
  backgroundUpload?: any,
  name: 
  {
    ru: string | any,
    en?: string | any,
    md?: string | any
  },
  hide: boolean
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  get(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/api/wtf/category`)
  }

  getById(_id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/api/wtf/category/${_id}`);
  }

  post(category: any): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/api/wtf/category`, category)
  }

  patch(category: any): Observable<any> {

    const fd = new FormData()
    const date = moment().format();

    if (category.imageUpload) {
      fd.append('image', category.imageUpload, `${date}` )
    }

    const data = {
      name: category.name,
      hide: category.hide
    }

    fd.append('category', JSON.stringify(data))


    return this.http.patch<any>(`${environment.apiURL}api/wtf/category/${category._id}`, fd)
  }

  delete(_id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiURL}api/wtf/category/${_id}`);
  }

  changeOrder(categories: any[]): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/api/wtf/category/changeOrder`, categories)
  }

  

  



}
