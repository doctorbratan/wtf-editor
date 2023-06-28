import { Component, ViewChild, ElementRef, OnInit  } from '@angular/core';

import { PositionService } from "../../services/position.service";

import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';

export interface Positon {
  _id?: string | any,
  category: string,
  sub_category: string,

  name: 
  {
    ru: string | any,
    en: string | any,
    md: string | any,
  },
  description: {
    ru: string | undefined,
    en: string | undefined,
    md: string | any,
  },
  weigth: 
  {
    ru: string | undefined,
    en: string | undefined,
    md: string | any,
  },

  cost: number | undefined,
  new_cost: number | undefined,
  hide: boolean
  access: boolean
}

@Component({
  selector: 'app-position-edit',
  templateUrl: './position-edit.component.html',
  styleUrls: ['./position-edit.component.css']
})
export class PositionEditComponent implements OnInit {
  @ViewChild('image') imageRef!: ElementRef

  pennding: boolean = false
  loading: boolean = false

   /*  */
   _id: string | undefined

   category: string | undefined
   sub_category: string | undefined

   Image: string | any
   ImageUpload?: any

   name = new FormGroup({
     ru: new FormControl(undefined, [Validators.required, Validators.minLength(1)]),
     en: new FormControl(undefined, [Validators.required, Validators.minLength(1)]),
     md: new FormControl(undefined, [Validators.required, Validators.minLength(1)]),
   })

   description: any = {
    ru: undefined,
    en: undefined,
    md: undefined
   }

   weight: any = {
    ru: undefined,
    en: undefined,
    md: undefined
   }
   
   cost: number | undefined
   new_cost: number | undefined
   access: boolean = true
   hide: boolean = false
   /*  */

  constructor(
    private categoryService: CategoryService,
    private sub_categoryService: SubCategoryService,
    private positionService: PositionService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    let data = this.isNew()
    let _id = this.hasId()

    if (this._id) {
      this.findById()
    } else if (data) {
      this.category = data.category
      this.checkCategory();
      this.sub_category = data.sub_category
      this.checkSubCategory();
    } else if (_id) {
      this._id = _id
      this.findById()
    } else {
      this.router.navigate(['/positions'])
    }
    
  }

  isNew() {

    const category = this.route.snapshot.queryParamMap.get('category');
    const sub_category = this.route.snapshot.queryParamMap.get('sub_category');

    if (sub_category && category) {
      const data = {
        category,
        sub_category
      }
      return data
    } else {
      return false
    }

}

hasId() {
  const _id = this.route.snapshot.queryParamMap.get('_id');

  if (_id) {
    return _id
  } else {
    return false
  }
}

checkSubCategory() {
  this.pennding = true

  this.sub_categoryService.getById(this.sub_category!).subscribe(
    data => {
      if (data) {
        this.pennding = false
      } else {
        this._snackBar.open("Подкатегория не найдена!", "Ок", {duration: 3000})
        this.router.navigate(['/positions']);
      }
    },
    error => {
      this._snackBar.open(
        error.error.message ? error.error.message : "Ошибка"
        , "Ок", 
      {duration: 3000, horizontalPosition: "right"})
      this.router.navigate(['/positions']);
      
    }
  )
}

checkCategory() {
  this.pennding = true

  this.categoryService.getById(this.category!).subscribe(
    data => {
      if (data) {
        this.pennding = false
      } else {
        this._snackBar.open("Категория не найдена!", "Ок", {duration: 3000})
        this.router.navigate(['/positions']);
      }
    },
    error => {
      this._snackBar.open(
        error.error.message ? error.error.message : "Ошибка"
        , "Ок", 
      {duration: 3000, horizontalPosition: "right"})
      this.router.navigate(['/positions']);
      
    }
  )
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

findById() {
  this.pennding = true

  this.positionService.getById(this._id!).subscribe(
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


  this.positionService.create(this.Zip()).subscribe(
    (data) => {

      this._snackBar.open(data.message, "Ок", 
      {duration: 3000, horizontalPosition: "right"})

      this.router.navigate(
        ['/position'],
        {
          queryParams: {
            _id: data.position._id
          }
        }
      )

     this.unZip(data.position)

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


  this.positionService.patch(this.Zip(), this._id!).subscribe(
    (data) => {
      this._snackBar.open(data.message, "Ок", 
      {duration: 3000, horizontalPosition: "right"})

      this.unZip(data.position)

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

  this.positionService.delete(this._id!).subscribe(
    (data) => {

      this._snackBar.open(data, "Ок", 
      {duration: 3000, horizontalPosition: "right"})
      
      this.router.navigate( ['/positions'], {
        queryParams: {
          category: this.category,
          sub_category: this.sub_category
        }
      })
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
  this.sub_category = data.sub_category

  this.name.setValue({ru: data.name.ru, en: data.name.en, md: data.name.md})

  if (data.img) {
    setTimeout(() => {
      this.Image = data.img.url
    }, 300);
  }

  if (data.weight) {
    this.weight = data.weight
  }

  if (data.description) {
    this.description = data.description
  }

  if (data.cost) {
    this.cost = data.cost
  }

  if (data.new_cost) {
    this.new_cost = data.new_cost
  }
  
  this.access = data.access
  this.hide = data.hide

}

Zip() {
  const data = {
    imageUpload: this.ImageUpload ? this.ImageUpload : undefined,
    category: this.category,
    sub_category: this.sub_category,
    name: this.name.value,
    description: this.description,
    weight: this.weight,
    cost: this.cost,
    new_cost: this.new_cost,
    access: this.access,
    hide: this.hide
  }

  return data
}

}
