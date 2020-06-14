import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';

import * as firebase from 'firebase';
import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';
import {
    ActivarLoadingAction,
    DesactivarLoadingAction,
} from '../shared/ui.actions';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private userSubscription: Subscription = new Subscription();

    constructor(
        private afAuth: AngularFireAuth,
        private router: Router,
        private afDB: AngularFirestore,
        private store: Store<AppState>
    ) {}

    crearUsuario(nombre: string, email: string, password: string) {
        this.store.dispatch(new ActivarLoadingAction());

        this.afAuth
            .createUserWithEmailAndPassword(email, password)
            .then((res) => {
                const user: User = {
                    uid: res.user.uid,
                    nombre,
                    email: res.user.email,
                };

                this.afDB
                    .doc(`${user.uid}/usuario`)
                    .set(user)
                    .then(() => {
                        this.router.navigate(['/']);
                        this.store.dispatch(new DesactivarLoadingAction());
                    });
            })
            .catch((error) => {
                Swal.fire('Error en el login', error.message, 'error');
                this.store.dispatch(new DesactivarLoadingAction());
            });
    }

    initAuthListener() {
        this.afAuth.authState.subscribe((fbUser: firebase.User) => {
            if (fbUser) {
                this.userSubscription = this.afDB
                    .doc(`${fbUser.uid}/usuario`)
                    .valueChanges()
                    .subscribe((usuarioObj: User) => {
                        const newUser = new User(usuarioObj);
                        this.store.dispatch(new SetUserAction(newUser));
                    });
            } else {
                this.userSubscription.unsubscribe();
            }
        });
    }

    login(email: string, password: string) {
        this.store.dispatch(new ActivarLoadingAction());
        this.afAuth
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                this.router.navigate(['/']);
                this.store.dispatch(new DesactivarLoadingAction());
            })
            .catch((error) => {
                Swal.fire('Error en el login', error.message, 'error');
                this.store.dispatch(new DesactivarLoadingAction());
            });
    }

    logout() {
        this.router.navigate(['/login']);
        this.afAuth.signOut();
    }

    isAuth() {
        return this.afAuth.authState.pipe(
            map((fbUser) => {
                if (fbUser == null) {
                    this.router.navigate(['./login']);
                }
                return fbUser != null;
            })
        );
    }
}
