import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import { User } from './user.model';

@Injectable({
  providedIn: 'root'

})
export class UserService {


  readonly rootUrl = 'http://18.179.118.55:5000';
  constructor(private http:HttpClient) { }
  
  registerUser(user : User){
    const body: User = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
     dob: user.dob,
      middle_name: user.middle_name,
      password: user.password,
      phone_number: user.phone_number,
      location_id: user.location_id
    }
    
    
    return this.http.post(this.rootUrl + '/api/registration', body);
  }

 
  chngpswrd(email:string) {
  
    let data = new URLSearchParams();
  data.append('email', email);
  


    return this.http.post(this.rootUrl + '/api/forgotPassword',data );
 
  }
  updatepswrd(newpswrd:string) {
  
    let data = new URLSearchParams();
  data.append('new_password', newpswrd);
  data.append('secret_key', 'RXTEMJc8mna4esnV');
  
    return this.http.post(this.rootUrl + '/api/updateForgotPW',data );
 
  }

  loginUser(userName:string,userPasswrd:string) {
  
  let datas = {
    email: userName,
    password: userPasswrd,
    reg_type: 2
  }

var options =  new HttpHeaders().set('Content-Type', 'application/json').set('No-Auth', 'True') ;
    return this.http.post(this.rootUrl + '/api/submitLogin',datas, {headers:options});
 
  }
  getUserDetail(){
    console.log(localStorage.getItem("userToken"));
    return  this.http.get(this.rootUrl+'/api/userDetails');
   }
 
}
