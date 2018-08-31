import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ResultsProvider } from '../../providers/results/results';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-results',
	templateUrl: 'results.html',
})
export class ResultsPage {
	startDate: any;
	endDate: any;
	loading: boolean;
	results: any;
	maxY: any;
	constructor(public navCtrl: NavController, public navParams: NavParams, public resultProvider: ResultsProvider, public userProvider: UserProvider, public events: Events) {
		this.loading = false;
		this.startDate = new Date()
		this.endDate = new Date()
		this.results = []
		this.maxY = 1

		this.events.subscribe("results:getAll", (results) => {
			this.loading = false;
			Object.keys(results).forEach(key => {
				this.results.push({ x: key, y: results[key] })
				this.maxY = Math.max(this.maxY, results[key])
			})
			this.drawGraphAndTable()
		})
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ResultsPage');
	}

	getResults() {
		if(this.startDate >= this.endDate){
			this.results = []
			this.maxY = 1
			let user = this.userProvider.getCurrentUser()
			this.loading = true
			return this.resultProvider.getResults(this.startDate, this.endDate, user.id)
		}
	}

	drawGraphAndTable(){
		
	}

}
