import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { EventsProvider } from '../../providers/events/events';
import { HomePage } from '../home/home';
import { CategoriesProvider } from '../../providers/categories/categories';


/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-events',
	templateUrl: 'events.html',
})
export class EventsPage {
	event: any;
	readableDate: String;
	currentDate: Date;
	allEventTypes: any;
	allTimes: any;
	startTime: any;
	endTime: any;
	constructor(public navCtrl: NavController, public navParams: NavParams, public categoriesProvider: CategoriesProvider, public userProvider: UserProvider, public eventProvider: EventsProvider, public events: Events, public alertCtrl: AlertController) {
		this.event = this.navParams.get('event')
		this.readableDate = this.navParams.get('readableDate')
		this.currentDate = this.navParams.get('currentDate').setHours(0, 0, 0, 0)

		this.startTime = this.event.readableTime
		this.endTime = this._formatTime(this._formatBackToTime(this.event.readableTime) + 1)

		this.allEventTypes = ['Sleep', 'School', 'Downtime', 'Social', 'Exercise', 'Productive Time', 'Gaming', 'Family Time', 'Travel', 'Prep', 'Waste Time', 'Health', 'Paid Work']
		this.allTimes = []
		for (let i = 0; i < 24; i++) {
			this.allTimes.push(i)
		}

		this.events.subscribe('categories:getAll', (categories) => {
			console.log('a', categories)
			if(categories && categories.length){
				this.allEventTypes = categories
			}
		})

		this.categoriesProvider.loadCategories()
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

	_formatBackToTime(time) {
		if (time.indexOf('am') != -1) {
			if (time == '12am') return 0
			return parseInt(time)
		} else {
			if (time == '12pm') return 12
			return (parseInt(time) + 12)
		}
	}

	ionViewDidLoad() {
	}

	async saveEvent() {
		if (this.startTime == '11pm') {
			this.event.readableTime = this._formatBackToTime(this.startTime)
			this.event.time = this.startTime
			return this.eventProvider.makeNewEvent([this.event], this.currentDate)
				.then(() => {
					this.navCtrl.pop()
				})
		}
		else if (!this.event.event || !this.startTime || !this.endTime) {
			this.alertCtrl.create({
				title: 'Cannot Create Event!',
				subTitle: 'Cannot create event, please enter all required fields',
				buttons: ['OK']
			}).present()
		} else if (this._formatBackToTime(this.endTime) - this._formatBackToTime(this.startTime) < 1) {
			this.alertCtrl.create({
				title: 'Cannot Create Event!',
				subTitle: 'Please select a acceptable start and end time',
				buttons: ['OK']
			}).present()
		}
		else {
			let eventArr = []
			await this.eventProvider.makeArrayForDay(this.currentDate)
			for (let i = this._formatBackToTime(this.startTime); i < this._formatBackToTime(this.endTime); i++) {
				let event = JSON.parse(JSON.stringify(this.event))
				event.readableTime = this._formatTime(i)
				event.time = i

				eventArr.push(event)
			}
			return this.eventProvider.makeNewEvent(eventArr, this.currentDate)
				.then(() => {
					this.navCtrl.pop()
				})
		}

	}

	deleteEvent(){
		return this.eventProvider.deleteEvent(this.event, this.currentDate)
			.then(() => {
				this.navCtrl.pop()
			})
	}
}
