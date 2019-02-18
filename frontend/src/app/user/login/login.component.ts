import { Component, OnInit } from '@angular/core';
 import {Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  data = {
    userName:'',
    passwrd:''
 
  };
  // constructor(private router: Router) { }
  // frmSubmit(){
  //   var t = this.data;
  //   console.log(t.userName);
  //   if(this.data.userName === "admin" && this.data.passwrd==="admin"){
  //     this.router.navigate(["home/home"]);
  //   }
   
  // }

  constructor(private userService: UserService,private router: Router) {
  }
  ngOnInit() {
    localStorage.removeItem('userToken');
  }
  OnSubmit(form: NgForm) {
    
  this.userService.loginUser(this.data.userName,this.data.passwrd)
  .subscribe((data: any) => { 
  if (data.status == true) { 
    localStorage.setItem('userToken',data.token);
    this.router.navigate(["/dashbrd"]);
    
    }
    else{
     
     
    }
  });
}
 
}
