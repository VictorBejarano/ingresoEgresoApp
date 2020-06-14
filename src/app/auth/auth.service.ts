import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';

import * as firebase from 'firebase';
import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private afAuth: AngularFireAuth, private router: Router) {}

    crearUsuario(nombre: string, email: string, password: string) {
        this.afAuth
            .createUserWithEmailAndPassword(email, password)
            .then((res) => {
                this.router.navigate(['/']);
            })
            .catch((error) => {
                Swal.fire('Error en el login', error.message, 'error');
            });
    }

    initAuthListener() {
        this.afAuth.authState.subscribe((fbUser: firebase.User) => {
            console.log('USER', fbUser);
        });
    }

    login(email: string, password: string) {
        this.afAuth
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                this.router.navigate(['/']);
            })
            .catch((error) => {
                Swal.fire('Error en el login', error.message, 'error');
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
