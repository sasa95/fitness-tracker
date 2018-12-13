import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './app.reducer';

const config = {
  apiKey: 'AIzaSyAt73WYey-qgj7xP2Ka9KwXZ3oQHtWEedk',
  authDomain: 'ng-fitness-app-11751.firebaseapp.com',
  databaseURL: 'https://ng-fitness-app-11751.firebaseio.com',
  projectId: 'ng-fitness-app-11751',
  storageBucket: 'ng-fitness-app-11751.appspot.com',
  messagingSenderId: '303432071794'
};

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AuthModule,
    StoreModule.forRoot({ ui: appReducer })
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
