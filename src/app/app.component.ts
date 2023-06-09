import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'belkalounge-edit';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const potentialToken = localStorage.getItem('auth-token');

    if (!potentialToken) {
      this.router.navigate(['/login'])
    } else {
      this.authService.setToken(potentialToken);
    }
  
  }
}
