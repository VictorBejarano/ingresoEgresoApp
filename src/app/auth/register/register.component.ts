import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';

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
export class RegisterComponent implements OnInit, OnDestroy {
    cargando: boolean;
    subscription: Subscription = new Subscription();

    constructor(
        public authService: AuthService,
        public store: Store<AppState>
    ) {}

    ngOnInit(): void {
        this.subscription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSubmit(data: Data) {
        this.authService.crearUsuario(data.nombre, data.email, data.password);
    }
}
