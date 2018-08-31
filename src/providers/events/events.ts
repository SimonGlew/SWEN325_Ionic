import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseDbProvider } from '../firebase-db/firebase-db';
import { Storage } from '@ionic/storage';

import { Events } from 'ionic-angular';
import { UserProvider } from '../user/user';

import * as _Promise from 'bluebird'

/*
  Generated class for the EventsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventsProvider {

	constructor(public http: HttpClient, public db: FirebaseDbProvider, public events: Events, public userProvider: UserProvider, public storage: Storage) {
	}

	public async getAllEvents(date: Date, user: any) {
		if (user && user.id) {
			let datum = await this.db.getDataOneWhere('/users/' + user.id + '/events', ['date', '==', date])
			this.events.publish("events:getAll", datum);
		} else {
			this.storage.get(String(date))
				.then(values => {
					if (!values) values = []
					values.forEach(value => {
						value.local = true
					})
					this.events.publish("events:getAll", values);
				})
		}
	}

	public async makeNewEvent(events: any, date: any) {
		let user = this.userProvider.getCurrentUser()
		if (!user || !user.id) {
			return this.storage.get(String(date))
				.then(values => {
					events.forEach(event => {
						let index = values.map(r => r.data.event.time).indexOf(event.time)
						if (index == -1) {
							values.push({ id: event.id, data: { event: { event: event.event, readableTime: event.readableTime, time: event.time } } })
						} else {
							values[index] = { id: event.id, data: { event: { event: event.event, readableTime: event.readableTime, time: event.time } } }
						}
					})
					this.storage.set(String(date), values)
					return events
				})
		} else {
			return _Promise.map(events, async (event:any) => {
				let checkEvent = await this.db.checkIfEventExists(event, date, user.id)
				if(!checkEvent){
					delete event.id
					return this.db.makeNewEvent(event, date, user.id)
				}else{
					event.id = checkEvent
					return this.db.updateEvent(event, date, user.id)

				}
			}, { concurrency: 1 })
				.then(() => events)
		}
	}

	public makeArrayForDay(date: any) {
		return new Promise((resolve, reject) => {
			let user = this.userProvider.getCurrentUser()
			if (!user || !user.id) {
				return this.storage.get(String(date))
					.then(values => {
						if (!values) values = []

						this.storage.set(String(date), values)
					})
					.then(() => resolve())
			}
			resolve()
		})
	}

	public async migrateLocal() {
		await new Promise((resolve, reject) => {
			let list = {}
			this.storage.forEach((value, key, index) => {
				list[key] = []
				value.forEach(value => {
					let val = value.data.event
					list[key].push({ event: val.event, readableTime: val.readableTime, time: val.time })
				})
			}).then(() => {
				resolve(list);
			});
		})
			.then(async (list) => {
				await _Promise.map(Object.keys(list), async (key) => {
					return this.makeNewEvent(list[key], parseInt(key))
				}, { concurrency: 1 })
			})
			.then(() => {
				this.storage.clear()
			})
	}

	public deleteEvent(event: any, date: any){
		if(!event.id){
			//local
			return this.storage.get(String(date))
				.then(values => {
					let index = values.map(r => r.data.event.time).indexOf(event.time)

					values.splice(index, 1)


					this.storage.set(String(date), values)
					return values
				})
		}else{
			//firestore
			let user = this.userProvider.getCurrentUser()
			return this.db.removeEvent(event.id, user)
		}
	}
}
