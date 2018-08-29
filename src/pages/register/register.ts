import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { HomePage } from '../home/home';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-register',
	templateUrl: 'register.html',
})
export class RegisterPage {
	user: any
	constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider, public alertCtrl: AlertController) {
		this.user = { email: '', username: '', password: '' };
	}

	ionViewDidLoad() {
	}

	async registerUser() {
		let result = await this.userProvider.addUser(this.user)

		if (result) {
			this.userProvider.checkUser(this.user.username, this.user.password)
			this.navCtrl.setRoot(HomePage);
		} else {
			this.user = { email: '', username: '', password: '' };
			this.alertCtrl.create({
				title: 'Cannot Register!',
				subTitle: 'Cannot register user, please try again',
				buttons: ['OK']
			}).present()
		}
	}

}
