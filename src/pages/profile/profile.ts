import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { EventsProvider } from '../../providers/events/events';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  loading: boolean;
  user: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider, public eventProvider: EventsProvider) {
    this.loading = false;
    this.user = this.userProvider.getCurrentUser()
  }

  ionViewDidLoad() {
  }


  migrateLocal() {
    this.loading = true
    return this.eventProvider.migrateLocal()
      .then(() => {
        this.loading = false
      })
    // setTimeout(() => {
    //   this.loading = false
    // }, 5000);
  }
}
