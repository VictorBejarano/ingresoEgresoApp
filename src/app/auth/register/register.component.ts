import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

export interface Data {
    nombre: string;
    email: string;
    password: string;
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styles: [],
})
export class RegisterComponent implements OnInit {
    constructor(public authService: AuthService) {}

    ngOnInit(): void {}

    onSubmit(data: Data) {
        console.log(data);
        this.authService.crearUsuario(data.nombre, data.email, data.password);
    }
}
