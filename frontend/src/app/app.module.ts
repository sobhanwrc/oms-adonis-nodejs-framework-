import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import { Angular2TokenService } from 'angular2-token';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from './shared/user.service';
 import { DynamicScriptLoaderService } from './shared/script-loader.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { BannerComponent } from './frontEnd/home/banner/banner.component';
import { ServicesComponent } from './frontEnd/home/services/services.component';
import { OurClietsComponent } from './frontEnd/home/our-cliets/our-cliets.component';
import { ServiceCounterComponent } from './frontEnd/home/service-counter/service-counter.component';
import { LatestServicesComponent } from './frontEnd/home/latest-services/latest-services.component';
import { HeaderComponent } from './frontEnd/header/header.component';
import { FooterComponent } from './frontEnd/footer/footer.component';
import { HomeComponent } from './frontEnd/home/home/home.component';
import { AboutComponent } from './frontEnd/about/about.component';
import { ContactComponent } from './frontEnd/contact/contact.component';
import { InnerbannerComponent } from './frontEnd/innerbanner/innerbanner.component';
import { ProfileComponent } from './frontEnd/profile/profile.component';
import { ProfContentComponent } from './frontEnd/profile/prof-content/prof-content.component';
import { ContContentComponent } from './frontEnd/contact/cont-content/cont-content.component';
import { AbtContentComponent } from './frontEnd/about/abt-content/abt-content.component';
import { PrivacyComponent } from './frontEnd/privacy/privacy.component';
import { PrivContentComponent } from './frontEnd/privacy/priv-content/priv-content.component';
import { TermComponent } from './frontEnd/term/term.component';
import { TermContentComponent } from './frontEnd/term/term-content/term-content.component';
import { LostFoundComponent } from './frontEnd/lost-found/lost-found.component';
import { LostFoundCntrComponent } from './frontEnd/lost-found/lost-found-cntr/lost-found-cntr.component';
import { LostFndCntntComponent } from './frontEnd/lost-found/lost-fnd-cntnt/lost-fnd-cntnt.component';
import { EatCompComponent } from './frontEnd/eat-comp/eat-comp.component';
import { EatCompContComponent } from './frontEnd/eat-comp/eat-comp-cont/eat-comp-cont.component';
import { LoginComponent } from './user/login/login.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { TestComponent } from './frontEnd/test/test.component';
import { ForgetpswrdComponent } from './user/forgetpswrd/forgetpswrd.component';
import { SidebarComponent } from './user/sidebar/sidebar.component';
import { TopbarComponent } from './user/topbar/topbar.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { DashCntComponent } from './user/dashboard/dash-cnt/dash-cnt.component';
import { DonationComponent } from './user/donation/donation.component';
import { DntnCntComponent } from './user/donation/dntn-cnt/dntn-cnt.component';
import { AdDonationComponent } from './user/ad-donation/ad-donation.component';
import { AddDonationCntComponent } from './user/ad-donation/add-donation-cnt/add-donation-cnt.component';
import { EditDonationComponent } from './user/edit-donation/edit-donation.component';
import { EditDonationCntComponent } from './user/edit-donation/edit-donation-cnt/edit-donation-cnt.component';
import { DonationDetailComponent } from './user/donation-detail/donation-detail.component';
import { DtailCntComponent } from './user/donation-detail/dtail-cnt/dtail-cnt.component';
import { MyjobComponent } from './user/myjob/myjob.component';
import { MyjobCntComponent } from './user/myjob/myjob-cnt/myjob-cnt.component';
import { JobDetailComponent } from './user/job-detail/job-detail.component';
import { JobdetailCntComponent } from './user/job-detail/jobdetail-cnt/jobdetail-cnt.component';
import { AddJobComponent } from './user/add-job/add-job.component';
import { AddJobCntComponent } from './user/add-job/add-job-cnt/add-job-cnt.component';
import { EditJobComponent } from './user/edit-job/edit-job.component';
import { EditJobCntComponent } from './user/edit-job/edit-job-cnt/edit-job-cnt.component';
import { UserProfComponent } from './user/user-prof/user-prof.component';
import { UserProfCntComponent } from './user/user-prof/user-prof-cnt/user-prof-cnt.component';
import { EditUserProfComponent } from './user/edit-user-prof/edit-user-prof.component';
import { EdtUserProfCntComponent } from './user/edit-user-prof/edt-user-prof-cnt/edt-user-prof-cnt.component';
import { TransictionComponent } from './user/transiction/transiction.component';
import { TransCntComponent } from './user/transiction/trans-cnt/trans-cnt.component';
import { NotifComponent } from './user/notif/notif.component';
import { NotifCntComponent } from './user/notif/notif-cnt/notif-cnt.component';

import { NewpswrdCntComponent } from './user/newpswd/newpswrd-cnt/newpswrd-cnt.component';
import { NewpswdComponent } from './user/newpswd/newpswd.component';

 import { VendorDashComponent } from './vendor/vendor-dash/vendor-dash.component';

import { VendorSignUpComponent } from './vendor/vendor-sign-up/vendor-sign-up.component';
import { VendorLoginComponent } from './vendor/vendor-login/vendor-login.component';
import { VendorTopbarComponent } from './vendor/vendor-topbar/vendor-topbar.component';
import { VendorSidebarComponent } from './vendor/vendor-sidebar/vendor-sidebar.component';
import { VendorForgetpswrdComponent } from './vendor/vendor-forgetpswrd/vendor-forgetpswrd.component';
import { VendorSetpswrdComponent } from './vendor/vendor-setpswrd/vendor-setpswrd.component';
import { VendorProfileComponent } from './vendor/vendor-profile/vendor-profile.component';
import { VndorProfcntComponent } from './vendor/vendor-profile/vndor-profcnt/vndor-profcnt.component';
import { VendorProfeditComponent } from './vendor/vendor-profedit/vendor-profedit.component';
import { VndreditcntComponent } from './vendor/vendor-profedit/vndreditcnt/vndreditcnt.component';
import { VendorTransComponent } from './vendor/vendor-trans/vendor-trans.component';
import { VendorTranscntComponent } from './vendor/vendor-trans/vendor-transcnt/vendor-transcnt.component';
import { VendorTransdetailComponent } from './vendor/vendor-transdetail/vendor-transdetail.component';
import { VndrtransdetailcntComponent } from './vendor/vendor-transdetail/vndrtransdetailcnt/vndrtransdetailcnt.component';
import { VendorWalletComponent } from './vendor/vendor-wallet/vendor-wallet.component';
import { VndrWalletcntComponent } from './vendor/vendor-wallet/vndr-walletcnt/vndr-walletcnt.component';
import { AuthGuard } from './auth/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    ServicesComponent,
    OurClietsComponent,
    ServiceCounterComponent,
    LatestServicesComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    InnerbannerComponent,
    ProfileComponent,
    ProfContentComponent,
    ContContentComponent,
    AbtContentComponent,
    PrivacyComponent,
    PrivContentComponent,
    TermComponent,
    TermContentComponent,
    LostFoundComponent,
    LostFoundCntrComponent,
    LostFndCntntComponent,
    EatCompComponent,
    EatCompContComponent,
    LoginComponent,
    SignUpComponent,
    TestComponent,
    ForgetpswrdComponent,
    SidebarComponent,
    TopbarComponent,
    DashboardComponent,
    DashCntComponent,
    DonationComponent,
    DntnCntComponent,
    AdDonationComponent,
    AddDonationCntComponent,
    EditDonationComponent,
    EditDonationCntComponent,
    DonationDetailComponent,
    DtailCntComponent,
    MyjobComponent,
    MyjobCntComponent,
    JobDetailComponent,
    JobdetailCntComponent,
    AddJobComponent,
    AddJobCntComponent,
    EditJobComponent,
    EditJobCntComponent,
    UserProfComponent,
    UserProfCntComponent,
    EditUserProfComponent,
    EdtUserProfCntComponent,
    TransictionComponent,
    TransCntComponent,
    NotifComponent,
    NotifCntComponent,
    NewpswrdCntComponent,
    NewpswdComponent,
     VendorDashComponent,
    VendorSignUpComponent,
    VendorLoginComponent,
    VendorTopbarComponent,
    VendorSidebarComponent,
    VendorForgetpswrdComponent,
    VendorSetpswrdComponent,
    VendorProfileComponent,
    VndorProfcntComponent,
    VendorProfeditComponent,
    VndreditcntComponent,
    VendorTransComponent,
    VendorTranscntComponent,
    VendorTransdetailComponent,
    VndrtransdetailcntComponent,
    VendorWalletComponent,
    VndrWalletcntComponent,
  
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ToastrModule.forRoot(),
   BrowserAnimationsModule,
    RouterModule.forRoot([
     { path:"home/home", component:HomeComponent },
     { path:"about", component:AboutComponent },
     { path:"contact", component:ContactComponent },
     { path:"lost-found", component:LostFoundComponent },
     { path:"eat-comp", component:EatCompComponent },
     { path:"sign-up", component:SignUpComponent },
     { path:"login", component:LoginComponent },
     { path:"frgtpswrd", component:ForgetpswrdComponent},
     { path:"dashbrd", component: DashboardComponent,canActivate:[AuthGuard]},
     { path:"prof", component: UserProfComponent,canActivate:[AuthGuard]},
     { path:"donation", component: DonationComponent,canActivate:[AuthGuard]},
     { path:"addDonation", component: AdDonationComponent,canActivate:[AuthGuard]},
     { path:"editDonation", component: EditDonationComponent,canActivate:[AuthGuard]},
     { path:"donationDetail", component: DonationDetailComponent,canActivate:[AuthGuard]},
     { path:"myjob", component:MyjobComponent,canActivate:[AuthGuard]},
     { path:"myjobDetail", component: JobDetailComponent,canActivate:[AuthGuard]},
     { path:"addMyjob", component: AddJobComponent,canActivate:[AuthGuard]},
     { path:"editMyjob", component: EditJobComponent,canActivate:[AuthGuard]},
     { path:"editProf", component: EditUserProfComponent,canActivate:[AuthGuard]},
     { path:"trans", component:TransictionComponent,canActivate:[AuthGuard]},
     { path:"notif", component:NotifComponent,canActivate:[AuthGuard]},
     { path:"setpswrd", component:NewpswdComponent},
     {
      path: '', redirectTo: "home/home",
      pathMatch: 'full'
    },
    ])
  ],
  providers: [UserService,DynamicScriptLoaderService,AuthGuard,
    {
      provide : HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi : true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
