import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { RegisterPage } from '../pages/register/register';
import { UserProvider } from '../providers/user/user';
import { EventsProvider } from '../providers/events/events';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { HttpClientModule } from '@angular/common/http';
import { FirebaseDbProvider } from '../providers/firebase-db/firebase-db';
import { EventsPage } from '../pages/events/events';
import { CategoriesProvider } from '../providers/categories/categories';
import { ResultsProvider } from '../providers/results/results';
import { ResultsPage } from '../pages/results/results';
import { CategoriesPage } from '../pages/categories/categories';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    ProfilePage,
    RegisterPage,
    EventsPage,
    ResultsPage,
    CategoriesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBmY44Cre7qsrh0ZBm-F-S_T2soZ_S7ErM",
      authDomain: "swen325a21.firebaseapp.com",
      databaseURL: "https://swen325a21.firebaseio.com",
      projectId: "swen325a21",
      storageBucket: "swen325a21.appspot.com",
      messagingSenderId: "945392559720"
  }),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    ProfilePage,
    RegisterPage,
    EventsPage,
    ResultsPage,
    CategoriesPage
  ],
  providers: [
    HttpClientModule,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserProvider,
    EventsProvider,
    FirebaseDbProvider,
    CategoriesProvider,
    ResultsProvider
  ]
})
export class AppModule { }
