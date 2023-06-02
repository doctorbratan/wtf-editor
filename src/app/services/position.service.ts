import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import {Observable} from 'rxjs'
import * as moment from 'moment';

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PositionService {

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

    return this.http.get<any[]>(`${environment.apiURL}/api/wtf/position`, { params: params })
  }

  getById(_id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/api/wtf/position/${_id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/api/wtf/position`, data)
  }

  patch(position: any, _id: string): Observable<any> {

    const fd = new FormData()
    const date = moment().format();

    if (position.imageUpload) {
      fd.append('image', position.imageUpload, `${date}` )
    }

    const data = {
      category: position.category,
      sub_category: position.sub_category,
      name: position.name,
      description: position.description,
      weight: position.weight,
      cost: position.cost,
      new_cost: position.new_cost,
      access: position.access,
      hide: position.hide
    }

    fd.append('position', JSON.stringify(data))

    return this.http.patch<any>(`${environment.apiURL}/api/wtf/position/${_id}`, fd)
  }

  delete(_id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiURL}/api/wtf/position/${_id}`);
  }

  changeOrder(positions: any[]): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/api/wtf/position/changeOrder`, positions)
  }
}
