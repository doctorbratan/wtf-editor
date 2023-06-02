import { Component, OnDestroy, OnInit } from '@angular/core';

import { CategoryService } from '../services/category.service';
import { SubCategoryService } from '../services/sub-category.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sub-category-page',
  templateUrl: './sub-category-page.component.html',
  styleUrls: ['./sub-category-page.component.css']
})
export class SubCategoryPageComponent implements OnInit, OnDestroy {

  loading: boolean = false
  change: boolean = false

  categories: any[] | undefined
  seleted_category: string | undefined

  sub_categories: any[] | undefined

  constructor(
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.findCategories()
  }

  ngOnDestroy(): void {
  }

  checkParams() {
    const candidate = this.route.snapshot.queryParamMap.get('category');

    if (candidate) {
      this.seleted_category = candidate
      this.findSubCategories()
    }
  }

  saveOrder(arr: any[] | undefined) {
    this.loading = true

    if (Array.isArray(arr)) {
      const data = []

      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        data.push({ _id: element._id, order: index + 1 })
      }

      this.subCategoryService.changeOrder(data).subscribe(
        (data) => {
          this.findSubCategories();
          this.change = false
          this._snackBar.open(data, "Ок",
            { duration: 3000, horizontalPosition: "right" })
        },
        (error) => {
          console.warn(error)
        }
      )
      
    }

  }

  findCategories(): void {
    this.loading = true

    this.categoryService.get().subscribe(
      (data: any[]) => {

        this.categories = data.map( category => {
          return {
            _id: category._id,
            name: category.name.ru
          }
        })

        this.loading = false
        this.checkParams()
      },
      error => {
        this._snackBar.open(
        error.error.message ? error.error.message : "Ошибка", "Ок",
        { duration: 3000, horizontalPosition: "right" })
      }
    )
  }


  findSubCategories() {
    this.loading = true

    if (this.seleted_category) {
      this.subCategoryService.get({category: this.seleted_category}).subscribe(
        (data: any[]) => {
          this.sub_categories = data
          this.loading = false
        },
        error => {
          this._snackBar.open(
          error.error.message ? error.error.message : "Ошибка", "Ок",
          { duration: 3000, horizontalPosition: "right" })
        }
      )
    }

  }

  changePosition(arr: any[], old_order: number, new_order: number) {
    this.change = true

    if (new_order >= arr.length) {
      var k = new_order - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
    }

    arr.splice(new_order, 0, arr.splice(old_order, 1)[0]);


  }



}
