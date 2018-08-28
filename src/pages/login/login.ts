import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user:any
  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider, public alertCtrl: AlertController) {
    this.user = { name: '', password: '' }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  async loginUser(){
    let result = await this.userProvider.checkUser(this.user.name, this.user.password)
    if (result) {
      this.navCtrl.setRoot(HomePage);
    } else {
      this.user = { name: '', password: '' };
      this.alertCtrl.create({
        title: 'Cannot Login!',
        subTitle: 'Cannot login user, please try again',
        buttons: ['OK']
      }).present()
    }
  }
}
