import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { User } from '../../shared/user.model';
import { NgForm } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  user: User;


  constructor(private userService: UserService, private toastr: ToastrService,private router: Router) { }

  ngOnInit() {
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.user = {
      first_name: '',
      last_name: '',
      middle_name: '',
      dob: '',
      email: '',
      location_id:'',
      password:'',
      phone_number:''
    }
  }

  OnSubmit(form: NgForm) {
    this.userService.registerUser(this.user)
      .subscribe((data: any) => {
       
        if (data.status == true) {
          this.resetForm(form);
          this.toastr.success('User registration successful');
          this.router.navigate(["/login"])
        }
        else{
          
        }
         
         
      });
  }
}
