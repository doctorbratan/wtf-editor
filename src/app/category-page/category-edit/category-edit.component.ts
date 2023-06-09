import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { CategoryService } from '../../services/category.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

export interface Category {
  _id?: string | any,
  image?: string | any,
  imageUpload?: any,
  name: any,
  hide: boolean
}


@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit, OnDestroy {

  @ViewChild('image') imageRef!: ElementRef
  @ViewChild('background') backgroundRef!: ElementRef

  $obs: Subscription | undefined
  pennding: boolean = false
  loading: boolean = false

  _id: any = undefined

  name = new FormGroup({
    ru: new FormControl(undefined, [Validators.required, Validators.minLength(2)]),
    en: new FormControl(undefined, [Validators.required, Validators.minLength(2)]),
    md: new FormControl(undefined, [Validators.required, Validators.minLength(2)]),
  })

  Image: any
  ImageUpload: any

  hide = false

  constructor(
    private categoryService: CategoryService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.findCategory()
  }

  ngOnDestroy(): void {
    if (this.$obs) {
      this.$obs.unsubscribe()
    }
  }

  findCategory() {
    this._id = this.route.snapshot.queryParamMap.get('_id');

    if (this._id) {
      this.pennding = true
      
      this.categoryService.getById(this._id).subscribe(
        (data) => {
          if (data) {
            this.unZip(data)
            this.pennding = false
          } else {
            this.router.navigate(['/categories'])
          }
        },
        error => {
          this._snackBar.open(
            error.error.message ? error.error.message : "Ошибка"
            , "Ок", 
          {duration: 3000, horizontalPosition: "right"})
          this.router.navigate(['/categories'])
        }
      )
    }

   
  }

  triggerImageClick() {
    this.imageRef.nativeElement.click()
  }

  onImageUpload(event: any) {
    if (event) {
      const file = event.target.files[0]
      this.ImageUpload = file
  
      const reader = new FileReader()
  
      reader.onload = () => {
        this.Image = reader.result
      }
  
      reader.readAsDataURL(file)
    }
  }

  triggerBackgroundClick() {
    this.backgroundRef.nativeElement.click()
  }



  create() {
    this.pennding = true

    const data = {
      name: this.name.value,
      hide: this.hide
    }

    this.categoryService.post(data).subscribe(
      (data) => {
      
        this._snackBar.open(data.message, "Ок", 
        {duration: 3000, horizontalPosition: "right"})
        
        this.router.navigate(
          ['/category'],
          {
            queryParams: {
              _id: data.category._id
            }
          }
        )

        this.unZip(data.category)

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

    const category = {
      _id: this._id,
      name: this.name.value,
      hide: this.hide,
      imageUpload: this.ImageUpload ? this.ImageUpload : undefined,
    }

    
    this.categoryService.patch(category).subscribe(
      (data) => {
        this._snackBar.open(data.message, "Ок", 
        {duration: 3000, horizontalPosition: "right"})

        this.unZip(data.category)

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

    this.categoryService.delete(this._id).subscribe(
      (data) => {
        this._snackBar.open(data.message, "Ок", 
        {duration: 3000, horizontalPosition: "right"})
        this.router.navigate(['/categories'])
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

    this.hide = data.hide

    this.ImageUpload = undefined
    this.Image = undefined
    setTimeout(() => {
      this.Image = data.image
    }, 1000);

    this.name.setValue({ru: data.name.ru, en: data.name.en, md: data.name.md})
  }


}
