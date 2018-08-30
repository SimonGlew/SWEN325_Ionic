import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProvider } from '../user/user';

/*
  Generated class for the CategoriesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoriesProvider {

  constructor(public http: HttpClient, public storage: Storage, public userProvider: UserProvider) {
    console.log('Hello CategoriesProvider Provider');
  }


  saveCategories(categories: any) {
    let user = this.userProvider.getCurrentUser()

    if (user) {
      this.storage.setItem((user.id + '_categories'), categories)
    } else {
      this.storage.setItem(('local_categories'), categories)
    }
  }

  loadCategories() {
    let user = this.userProvider.getCurrentUser()

    if (user) {
      return this.storage.get(String(user.id + '_categories'))
        .then(categories => {
          return categories
        })
    } else {
      return this.storage.get('local_categories')
        .then(categories => {
          return categories
        })
    }
  }
}
