import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { CategoriesProvider } from '../../providers/categories/categories';

/**
 * Generated class for the CategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-categories',
	templateUrl: 'categories.html',
})
export class CategoriesPage {
	allEventTypes: any;
	categories: any;
	constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public categoriesProvider: CategoriesProvider, public alertCtrl: AlertController) {
		this.allEventTypes = ['Sleep', 'School', 'Downtime', 'Social', 'Exercise', 'Productive Time', 'Gaming', 'Family Time', 'Travel', 'Prep', 'Waste Time', 'Health', 'Paid Work']
		this.categories = []
		this.events.subscribe('categories:getAll', (categories) => {
			if (categories && categories.length) {
				this.allEventTypes = categories
			}
			this.allEventTypes.forEach(cat => {
				this.categories.push({ name: cat, edit: false })
			})
		})

		this.categoriesProvider.loadCategories()
	}

	public addCategory(){
		this.categories.push({ name: '', edit: true })
	}

	public editCategory(index){
		this.categories[index].edit = true
	}

	public saveCategory(index){
		this.categories[index].edit = false
		this.saveCategories()
	}

	public deleteCategory(index){
		this.categories.splice(index, 1)
	}

	public saveCategories(){
		let check = this.categories.filter(r => r.name == '' || r.edit == true)
		if(!check){
			this.categoriesProvider.saveCategories(this.categories.map(r => r.name))
		}else{
			this.alertCtrl.create({
				title: 'Cannot Save Categories!',
				subTitle: 'Please make sure all categories are correctly named',
				buttons: ['OK']
			}).present()
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CategoriesPage');
	}

}
