import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(http:Http) { 

    http.get('http://northwind.servicestack.net/customers.json').subscribe(Response => {
console.log(Response.json());
    })
  }

  ngOnInit() {
  }

}
