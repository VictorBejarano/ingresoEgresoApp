import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class IngresoEgresoService {
    constructor(
        private afDB: AngularFirestore,
        public authService: AuthService
    ) {}

    crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
        const user = this.authService.getUsuario();
        return this.afDB
            .doc(`${user.uid}/ingreso-egresos`)
            .collection('items')
            .add({ ...ingresoEgreso });
    }
}
