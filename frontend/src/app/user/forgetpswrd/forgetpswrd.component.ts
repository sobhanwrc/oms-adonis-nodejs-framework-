import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../shared/user.service';
@Component({
  selector: 'app-forgetpswrd',
  templateUrl: './forgetpswrd.component.html',
  styleUrls: ['./forgetpswrd.component.css']
})
export class ForgetpswrdComponent implements OnInit {

chnpswd={
  email:""

}
  


  ngOnInit() {
  }
  constructor(private userService: UserService) {
  }
  OnSubmit(form: NgForm) {
    
  this.userService.chngpswrd(this.chnpswd.email)
  .subscribe((data: any) => {
    if (data.status == true) {
     
    }
    else
     
      console.log(2)
  });
}
}
