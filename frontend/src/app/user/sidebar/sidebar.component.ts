import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// import { DynamicScriptLoaderService } from '../../shared/script-loader.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  // constructor(private dynamicScriptLoader: DynamicScriptLoaderService) {}
  constructor(private router: Router) { }
  ngOnInit() {
    // Just call your load scripts function with scripts you want to load
    
  }
  
  // private loadScripts() {
  //   // You can load multiple scripts by just providing the key as argument into load method of the service
  //   this.dynamicScriptLoader.load().then(data => {
  //     // Script Loaded Successfully
  //   }).catch(error => console.log(error));
  // }
  logout(){
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }
}
