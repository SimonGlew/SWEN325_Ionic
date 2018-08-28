import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseDbProvider } from '../firebase-db/firebase-db';
import { Storage } from '@ionic/storage';

import { Events } from 'ionic-angular';
import { UserProvider } from '../user/user';
/*
  Generated class for the EventsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventsProvider {

	constructor(public http: HttpClient, public db: FirebaseDbProvider, public events: Events, public userProvider: UserProvider, public storage: Storage) {
		console.log('Hello EventsProvider Provider');
	}


	public async getAllEvents(date: Date, user: any) {
		console.log('user', user)
		if (user && user.id) {
			let datum = await this.db.getDataOneWhere('/users/' + user.id + '/events', ['date', '==', date])
			this.events.publish("events:getAll", datum);
		} else {
			this.storage.get(String(date))
				.then(values => {
					if (!values) values = []
					this.events.publish("events:getAll", values);
				})
		}
	}

	public async makeNewEvent(event: any, date: Date) {
		return new Promise(async (resolve, reject) => {
			let user = this.userProvider.getCurrentUser()
			if (user && user.id) {
				if (event.id) {
					await this.db.updateEvent(event, date, user.id)
				}else{
					await this.db.makeNewEvent(event, date, user.id)
				}
				resolve()
			} else {
				this.storage.get(String(date))
					.then(values => {
						if (!values) values = []
						values.push({ id: event.id, data: { event: event } })
						this.storage.set(String(date), values)
						resolve()
					})
			}
		})
			.then(() => {
				return event
			})
	}
}
