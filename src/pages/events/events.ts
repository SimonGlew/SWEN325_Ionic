import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { EventsProvider } from '../../providers/events/events';
import { HomePage } from '../home/home';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider, public eventProvider: EventsProvider, public alertCtrl: AlertController) {
    this.event = this.navParams.get('event')
    this.readableDate = this.navParams.get('readableDate')
    this.currentDate = this.navParams.get('currentDate').setHours(0, 0, 0, 0)

    this.allEventTypes = ['Sleep', 'School', 'Downtime', 'Social', 'Exercise', 'Productive Time', 'Gaming', 'Family Time', 'Travel', 'Prep', 'Waste Time', 'Health', 'Paid Work']
    this.allTimes = []
    for (let i = 0; i < 24; i++) {
      this.allTimes.push(i)
    }
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
    console.log('ionViewDidLoad EventsPage');
  }

  saveEvent() {
    if (!this.event.event || !this.event.readableTime) {
      this.alertCtrl.create({
        title: 'Cannot Create Event!',
        subTitle: 'Cannot create event, please enter all required fields',
        buttons: ['OK']
      }).present()
    } else {
      this.event.time = this._formatBackToTime(this.event.readableTime)
      return this.eventProvider.makeNewEvent(this.event, this.currentDate)
        .then(() => {
          this.navCtrl.pop()
        })
    }

  }
}
