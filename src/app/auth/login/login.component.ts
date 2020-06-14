import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

export interface Data {
  email: string;
  password: string;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [],
})
export class LoginComponent implements OnInit {
    constructor(private authService: AuthService) {}

    ngOnInit(): void {}

    onSubmit(data: Data) {
        console.log(data);
        this.authService.login( data.email, data.password);
    }
}
