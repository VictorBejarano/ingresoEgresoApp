import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
    nombre: string;

    subscription: Subscription = new Subscription();

    constructor(
        private authService: AuthService,
        private store: Store<AppState>
    ) {}

    ngOnInit(): void {
        this.subscription = this.store
            .select('auth')
            .pipe(filter((auth) => auth.user != null))
            .subscribe((auth) => (this.nombre = auth.user.nombre));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    logout() {
        this.authService.logout();
    }
}
