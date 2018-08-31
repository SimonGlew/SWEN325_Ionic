import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { UserProvider } from '../providers/user/user';
import { CategoriesPage } from '../pages/categories/categories';
import { ResultsPage } from '../pages/results/results';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<any>;
  user: any
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public events: Events, public userProvider: UserProvider) {
    this.initializeApp();
    this.user = null
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Manage Categories', component: CategoriesPage, nav: true },
      { title: 'Results', component: ResultsPage, nav: true }
    ];

    this.events.subscribe("user:login", (user) => {
      this.user = user;
    });

    this.events.subscribe("user:logout", (user) => {
      this.user = null;
      this.nav.setRoot(HomePage);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    if (page.nav) {
      this.nav.push(page.component, {})
    } else {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      this.nav.setRoot(page.component);
    }
  }

  registerUser() {
    this.nav.push(RegisterPage, {});
  }

  login() {
    this.nav.push(LoginPage, {});
  }

  profile() {
    this.nav.push(ProfilePage, {});
  }

  logout() {
    this.userProvider.logout()
  }
}
