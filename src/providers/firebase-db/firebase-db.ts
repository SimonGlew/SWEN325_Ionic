import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

/*
  Generated class for the FirebaseDbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseDbProvider {

	constructor(public http: HttpClient, public fireStore: AngularFirestore) {
	}

	public addUser(user: any): Promise<any> {
		return this.getDataOneWhere('/users', ['email', '==', user.email])
			.then((data: any) => {
				if (data.length >= 1) {
					return false;
				} else {
					return this.fireStore.collection<any>('users').add(user)
						.then(() => { return true })
				}
			})
	}

	public checkUser(username: String, password: String): Promise<any> {
		return this.getDataTwoWhere('/users', ['username', '==', username, 'password', '==', password])
			.then((data: any) => {
				if (data.length) return data[0]
				else return false
			})
	}

	public makeNewEvent(event: any, date: any, userid: String) {
		let data = { event: event, date: date }
		return this.fireStore.collection<any>('users/' + userid + '/events').add(data)
			.then(() => { return true })
	}

	public updateEvent(event: any, date: Date, userid: string) {
		let data = { event: event, date: date }
		return this.fireStore.collection('users/' + userid + '/events/').doc(event.id).update(data)
			.then(() => { return true })
	}

	public getDataOneWhere(collection: any, query: any) {
		let list = []
		return new Promise((resolve, reject) => {
			return this.fireStore.collection(collection, (ref) => ref.where('a', '==', 'a'))
				.ref.where(query[0], query[1], query[2])
				.get()
				.then(data => {
					data.forEach(d => list.push({ id: d.id, data: d.data() }))
					resolve(list)
				})
		})
	}

	public getDataTwoWhere<{ data:any }>(collection: any, query: any) {
		let list = []
		return this.fireStore.collection(collection, (ref) => ref.where('a', '==', 'a'))
			.ref.where(query[0], query[1], query[2]).where(query[3], query[4], query[5])
			.get()
			.then(data => {
				list = []
				data.forEach(d => {
					list.push({ id: d.id, data: d.data() })
				})
				return list
			})
	}

	public getData(collection: any, query: any) {
		let list = []
		return new Promise((resolve, reject) => {
			return this.fireStore.collection(collection, (ref) => ref.where('a', '==', 'a'))
				.ref.get()
				.then(data => {

					data.forEach(d => list.push({ id: d.id, data: d.data() }))
					resolve(list)
				})
		})
	}

	public checkIfEventExists(event: any, date: any, userId: any) {
		return this.getDataTwoWhere('users/' + userId + '/events', ['date', '==', date, 'event.time', '==', event.time])
			.then(list => {
				return list ? list[0].id : null
			})
			.catch(() => {
				return null;
			})
	}

	public removeEvent(eventId: any, user: any) {
		if (!user.id) return

		return this.fireStore.collection('users/' + user.id + '/events/').doc(eventId)
			.delete()
	}
}
