import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../shared/user.service';
@Component({
  selector: 'app-newpswd',
  templateUrl: './newpswd.component.html',
  styleUrls: ['./newpswd.component.css']
})
export class NewpswdComponent implements OnInit {

  newpswrd={
    pswrd:"",
    cnfpswrd:""
  
  }
    
  
  
    ngOnInit() {
    }
    constructor(private userService: UserService,private router: Router) {
    }
    OnSubmit(form: NgForm) {
      
    this.userService.updatepswrd(this.newpswrd.pswrd)
    .subscribe((data: any) => {
      console.log(data);
      if (data.status == true) {
       
        this.router.navigate(["/login"])
      }
      else
       
        console.log(2)
    });
  }

}
