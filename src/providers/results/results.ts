import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseDbProvider } from '../firebase-db/firebase-db';
import { UserProvider } from '../user/user';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';


/*
  Generated class for the ResultsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ResultsProvider {

	constructor(public http: HttpClient, public storage: Storage, public events: Events, public db: FirebaseDbProvider, public userProvider: UserProvider) {
		console.log('Hello ResultsProvider Provider');
	}

	getResults(startDate, endDate, userId) {
		let results = {}
		if (!userId) {
			this.storage.forEach((value, key, index) => {
				if (parseInt(key) >= startDate && parseInt(key) <= endDate) {
					value.forEach(v => {
						let data = v.data.event
						results[data.event] = !results[data.event] ? 1 : results[data.event] += 1
					})
				}
			})
				.then(() => {
					this.events.publish("results:getAll", results)
				})
		} else {
			return this.db.getDataTwoWhere('users/' + userId + '/events', ['date', '>=', parseInt(startDate), 'date', '<=', parseInt(endDate)])
				.then(data => {
					data.forEach(d => {
						let event = d.data.event
						if (!results[event.event]) {
							results[event.event] = 0
						}
						results[event.event] += 1
					})
					this.events.publish("results:getAll", results)
				})
		}
	}

}
