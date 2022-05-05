import {makeAutoObservable} from 'mobx'

export default class UserStore {
   constructor() {
      this._isAuth = true
      this._user = {}
      makeAutoObservable(this)
   }

   setIsAuth(bool){
      this._isAuth = bool
   }
   setUser(user){
      this._user = user
   }

   getIsAuth(){
      return this._isAuth
   }
   getUser(){
      return this._user
   }
}