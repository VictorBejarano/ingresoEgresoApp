import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    DocumentChangeAction,
} from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class IngresoEgresoService {
    ingresoEgresoListerSubscription: Subscription = new Subscription();
    ingresoEgresoItemsSubscription: Subscription = new Subscription();
    constructor(
        private afDB: AngularFirestore,
        public authService: AuthService,
        private store: Store<AppState>
    ) {}

    initIngresoEgresoListener() {
        this.ingresoEgresoListerSubscription = this.store
            .select('auth')
            .pipe(filter((Auth) => Auth.user != null))
            .subscribe((Auth) => this.ingresoEgresoItems(Auth.user.uid));
    }

    private ingresoEgresoItems(uid: string) {
        this.ingresoEgresoItemsSubscription = this.afDB
            .collection(`${uid}/ingreso-egresos/items`)
            .snapshotChanges()
            .pipe(
                map((docData) => {
                    return docData.map((doc: DocumentChangeAction<any>) => {
                        return {
                            uid: doc.payload.doc.id,
                            ...doc.payload.doc.data(),
                        };
                    });
                })
            )
            .subscribe((coleccion: IngresoEgreso[]) => {
                this.store.dispatch(new SetItemsAction(coleccion));
            });
    }

    cancelarSubscriptions() {
        this.ingresoEgresoListerSubscription.unsubscribe();
        this.ingresoEgresoItemsSubscription.unsubscribe();
    }

    crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
        const user = this.authService.getUsuario();
        return this.afDB
            .doc(`${user.uid}/ingreso-egresos`)
            .collection('items')
            .add({ ...ingresoEgreso });
    }
}
