import { Component } from '@angular/core';
import { NavController, Events, NavParams } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { EventsProvider } from '../../providers/events/events';

import moment from 'moment'
import { EventsPage } from '../events/events';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	currentDate: any
	dayEvents: Array<{ local: any; id: any, time: number, readableTime: string, event: any }>;
	constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider, public eventProvider: EventsProvider, public events: Events) {
		let date = new Date()
		this.dayEvents = []
		this.currentDate = { date: date, readable: this._formatDate(date) }
		this.remakeDayEventsArray()

		this.events.subscribe("events:getAll", (events) => {
			if (events && events.length) {
				this.remakeDayEventsArray()
				events.forEach(e => {
					let event = e.data.event
					this.dayEvents[event.time] = { local: e.local, id: e.id, time: event.time, readableTime: this._formatTime(event.time), event: event.event }
				})
			} else {
				this.remakeDayEventsArray()
			}
		});

		this.events.subscribe("user:login", () => {
			this.getEvents()
		});
		this.getEvents()
	}

	goToEvent(item) {
		this.navCtrl.push(EventsPage, {
			event: item,
			readableDate: this.currentDate.readable,
			currentDate: this.currentDate.date
		});
	}

	remakeDayEventsArray() {
		this.dayEvents = []
		for (let i = 0; i < 24; i++) {
			this.dayEvents.push({ local: false, id: null, time: i, readableTime: this._formatTime(i), event: '' })
		}
	}

	ionViewDidEnter() {
		this.getEvents();
	}

	ionViewWillEnter(){
		this.getEvents();
	}

	getEvents() {
		this.eventProvider.getAllEvents(this.currentDate.date.setHours(0, 0, 0, 0), this.userProvider.getCurrentUser())
	}

	goBackDate() {
		let date = this._addDays(-1, this.currentDate.date)
		this.currentDate = { date: date, readable: this._formatDate(date) }
		this.remakeDayEventsArray()
		this.getEvents()
	}

	goForwardDate() {
		let date = this._addDays(1, this.currentDate.date)
		this.currentDate = { date: date, readable: this._formatDate(date) }
		this.remakeDayEventsArray()
		this.getEvents()
	}

	_formatTime(time) {
		if (time < 12) {
			if (time == 0) time = 12
			return time + 'am'
		}
		else {
			time = time % 12
			if (time == 0) time = 12
			return time + 'pm'
		}
	}

	_formatDate(oldDate) {
		return moment(oldDate).format("ddd Do MMM YYYY")
	}

	_addDays(amount, oldDate) {
		let result = new Date(oldDate);
		result.setDate(result.getDate() + amount);
		return result;
	}
}
