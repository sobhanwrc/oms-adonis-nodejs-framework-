import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/user.service';
@Component({
  selector: 'app-user-prof-cnt',
  templateUrl: './user-prof-cnt.component.html',
  styleUrls: ['./user-prof-cnt.component.css']
})
export class UserProfCntComponent implements OnInit {
  userClaims: any;
  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.getUserDetail().subscribe((data: any) => {
       this.userClaims = data;
     
    });
  }
}
