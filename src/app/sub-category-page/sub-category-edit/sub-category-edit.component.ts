import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SubCategoryService } from '../../services/sub-category.service';
import { CategoryService } from 'src/app/services/category.service';

export interface Sub_Category {
  _id?: string | any,
  category: string,
  name: 
  {
    ru: string | any,
    en: string | any
  },
  adult: boolean,
  hide: boolean
}

@Component({
  selector: 'app-sub-category-edit',
  templateUrl: './sub-category-edit.component.html',
  styleUrls: ['./sub-category-edit.component.css']
})
export class SubCategoryEditComponent implements OnInit {

  pennding: boolean = false
  loading: boolean = false

  /*  */
  _id: string | undefined

  category: string | undefined

  name = new FormGroup({
    ru: new FormControl(undefined, [Validators.required, Validators.minLength(2)]),
    en: new FormControl(undefined, [Validators.required, Validators.minLength(2)]),
    md: new FormControl(undefined, [Validators.required, Validators.minLength(2)])
  })

  hide: boolean = false
  /*  */

  constructor(
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const isNew = this.isNew() 
    const hasId = this.hasId()

    if (isNew) {
      this.category = isNew
      this.checkCategory();
    } else if (hasId) {
      this._id = hasId
      this.findById(hasId)
    } else {
      this.router.navigate(['/sub-categories'])
    } 
    
  }

  isNew() {
      const candidate = this.route.snapshot.queryParamMap.get('category');

      if (candidate) {
        return candidate
      } else {
        return false
      }

  }

  hasId() {
    const candidate = this.route.snapshot.queryParamMap.get('_id')

    if (candidate) {
      return candidate
    } else {
      return false
    }

  }

  checkCategory() {
    this.pennding = true

    if (this.category) {
      this.categoryService.getById(this.category).subscribe(
        data => {
          if (!data) {
            this.router.navigate(['/sub-categories'])
            this._snackBar.open(
              "Категория не найдена!", "Ок", 
            {duration: 3000, horizontalPosition: "right"})
          } else {
            this.pennding = false
          }
        },
        error => {
          this._snackBar.open(
            error.error.message ? error.error.message : "Ошибка"
            , "Ок", 
          {duration: 3000, horizontalPosition: "right"})
          this.router.navigate(['/sub-categories'])
        }
      )
    }
  }

  findById(_id: string) {
    this.pennding = true

    this.subCategoryService.getById(_id).subscribe(
      (data) => {
        if (data) {
          this.unZip(data)
          this.pennding = false
        } else {
          this.router.navigate(['/sub-categories'])
        }
      },
      error => {
        this._snackBar.open(
          error.error.message ? error.error.message : "Ошибка"
          , "Ок", 
        {duration: 3000, horizontalPosition: "right"})
        this.pennding = false
      }
    )
  }

  create() {
    this.pennding = true


    this.subCategoryService.create(this.Zip()).subscribe(
      (data) => {

        this._snackBar.open(data.message, "Ок", 
        {duration: 3000, horizontalPosition: "right"})

        this.router.navigate(
          ['/sub-category'],
          {
            queryParams: {
              _id: data.sub_category._id
            }
          }
        )

        this.unZip(data.sub_category)

        this.pennding = false

      },
      error => {
        this._snackBar.open(
          error.error.message ? error.error.message : "Ошибка"
          , "Ок", 
        {duration: 3000, horizontalPosition: "right"})
        this.pennding = false
      }
    )
  }

  patch() {
    this.pennding = true


    this.subCategoryService.patch(this.Zip(), this._id!).subscribe(
      (data) => {
        this._snackBar.open(data.message, "Ок", 
        {duration: 3000, horizontalPosition: "right"})

        this.unZip(data.sub_category)

        this.pennding = false
      },
      error => {
        this._snackBar.open(
          error.error.message ? error.error.message : "Ошибка"
          , "Ок", 
        {duration: 3000, horizontalPosition: "right"})
        this.pennding = false
      }
    )

  }


  delete() {
    this.pennding = true

    this.subCategoryService.delete(this._id!).subscribe(
      (data) => {
        this._snackBar.open(data, "Ок", 
        {duration: 3000, horizontalPosition: "right"})
        this.router.navigate(
          ['/sub-categories'],
          {
            queryParams: {
              category: this.category
            }
          }
        )
      },
      error => {
        this._snackBar.open(
          error.error.message ? error.error.message : "Ошибка"
          , "Ок", 
        {duration: 3000, horizontalPosition: "right"})
        this.pennding = false
      }
    )
  }


  unZip(data: any) {

    if (data._id) {
      this._id = data._id
    }

    this.category = data.category
    this.hide = data.hide
    this.name.setValue({ru: data.name.ru, en: data.name.en, md: data.name.md })

  }

  Zip() {
    const data = {
      category: this.category,
      name: this.name.value,
      hide: this.hide
    }

    return data
  }

}
