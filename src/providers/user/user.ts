import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { FirebaseDbProvider } from '../firebase-db/firebase-db';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
	public User: any
	constructor(public http: HttpClient, public events: Events, public db: FirebaseDbProvider) {
		this.User = null
	}

	public addUser(user: any) {
		console.log('a')
		return this.db.addUser(user)
			.then(res => {
				console.log('res', res)
				return res
			})
	}

	public checkUser(name: String, password: String) {
		this.User = { name: name, id: '' }
		return this.db.checkUser(name, password)
			.then(res => {
				if (!res) return false
				else {
					this.User.id = res.id
					this.events.publish("user:login", this.User);
					return true
				}
			})
	}

	public getCurrentUser() {
		return this.User
	}

	public logout(){
		this.User = null
		this.events.publish("user:logout", this.User);
	}
}
