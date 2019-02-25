'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.get('/', 'LoginController.index')
Route.get('/forgot-password', 'LoginController.forgot_password')
// Route.get('/user-login', 'LoginController.user_login')
// Route.get('/social-login/facebook', 'LoginController.facebook')
// Route.get('/callback/facebook', 'LoginController.callback_fb')
// Route.get('/social-login/google', 'LoginController.google')
// Route.get('/callback/google', 'LoginController.callback_google')
// Route.group( () => {
//     Route.post('/login', 'LoginController.login')
// }).middleware(['guest'])

//admin routes
Route.group(() => { 
    Route.get('/admin', 'AdminController.login_view')
    Route.post('/admin-login-submit', 'AdminController.login_submit')
}).middleware(['admin'])

Route.group(() => { 
    Route.get('/admin/dashboard', 'AdminController.dashboard')
    Route.get('/admin/logout', 'AdminController.logout')
    Route.get('/admin/profile', 'AdminController.profile')
    Route.post('/admin/changePassword', 'AdminController.changePassword')
    Route.post('/admin/profile/edit', 'AdminController.profile_edit')
    Route.post('/admin/change_profile_image', 'AdminController.change_profile_image')
    
    Route.get('/admin/user-list', 'AdminController.user_list')
    Route.get('/admin/user-list/profile/:id', 'AdminController.user_profile')

    Route.get('/admin/vendor-list', 'AdminController.vendor_list')
    Route.get('/admin/vendor-list/profile/:id', 'AdminController.vendor_profile')
}).middleware(['auth:session'])
//end


//api routes
Route.post('/api/registration', 'ApiController.registration')
Route.post('/api/submitLogin', 'ApiController.submitLogin')
Route.post('/api/socialLogin', 'ApiController.socialLogin')
Route.post('/api/forgotPassword', 'ApiController.forgotPassword')
Route.post('/api/updateForgotPW', 'ApiController.updateForgotPW')
Route.post('/api/addJobIndustrty', 'ApiController.addJobIndustrty')
Route.post('/api/addJobCategory', 'ApiController.addJobCategory')
Route.get('/api/fetchJobCategoryAndIndustry', 'ApiController.fetchJobCategoryAndIndustry')
Route.post('/api/addLocations', 'ApiController.addLocations')
Route.get('/api/fetchLocations', 'ApiController.fetchLocations')
Route.post('/api/addServiceTypes', 'ApiController.addServiceType')
Route.post('/api/addServiceCategory', 'ApiController.addServiceCategory')
Route.get('/api/serviceTypesCategories', 'ApiController.fetchServiceTypeAndCategories')
Route.post('/api/authRefresh', 'ApiController.authRefresh')

Route.get('/api/stripeView', 'ApiController.stripeView')
Route.post('/api/updateJobCategories', 'ApiController.updateJobCategories')

Route.post('/api/addCoupons', 'ApiController.addCoupons');
Route.post('/api/assignCouponsToUser', 'ApiController.assignCouponsToUser')

Route.post('/api/checkDate', 'ApiController.checkDate');

Route.get('/dbs/test', 'ApiController.test')

Route.group(() => { 
    Route.get('/api/userDetails', 'ApiController.userDetails')
    Route.post('/api/profileEdit', 'ApiController.profileEdit')
    Route.post('/api/fetchUserPresentAddress', 'ApiController.fetchUserPresentAddress')
    Route.post('/api/uploadProfileImage', 'ApiController.uploadProfileImage')
    Route.post('/api/changePassword', 'ApiController.changePassword')
    Route.post('/api/addJob', 'ApiController.addJob')
    Route.get('/api/jobList', 'ApiController.jobList')
    Route.post('/api/jobDetails', 'ApiController.jobDetails')
    Route.post('/api/editJob', 'ApiController.editJob')
    Route.get('/api/shoeDonationListings', 'ApiController.shoeDonationListings')
    Route.post('/api/serviceAdd', 'ApiController.serviceAdd')
    Route.get('/api/serviceList', 'ApiController.serviceList')
    Route.post('/api/serviceDetails', 'ApiController.serviceDetails')
    Route.post('/api/editService', 'ApiController.editService')
    Route.post('/api/rateByUserToVendor', 'ApiController.rateByUserToVendor')
    Route.get('/api/fetchVendorRatingDetails', 'ApiController.fetchVendorRatingDetails')
    Route.post('/api/vendorProfileFromUser', 'ApiController.vendorProfileFromUser')
    Route.get('/api/fetchAllLatestDetails', 'ApiController.fetchAllLatestDetails')
    Route.get('/api/vendorTransactionList', 'ApiController.vendorTransactionList')
    Route.get('/api/vendorJobHistory', 'ApiController.vendorJobHistory')

    Route.post('/api/fetchNearestVendor', 'ApiController.fetchNearestVendor')
    Route.post('/api/sendPushToAllocatedVendor', 'ApiController.sendPushToAllocatedVendor')
    Route.post('/api/jobAllocationDecline', 'ApiController.jobAllocationDecline')
    Route.post('/api/jobAllocationAccept', 'ApiController.jobAllocationAccept')

    Route.get('/api/vendorsAllJobRequest', 'ApiController.vendorsAllJobRequest')
    Route.get('/api/vendorAllAcceptAndDeclineJobs', 'ApiController.vendorAllAcceptAndDeclineJobs')

    Route.post('/api/userActiveCoupons', 'ApiController.userActiveCoupons')

    //all stripe route
    Route.post('/api/vendor/topup-credit-stripe', 'ApiController.stripeTopUpCredit')
    Route.post('/api/stripePaymentOfUser', 'ApiController.stripePaymentOfUser')
    Route.post('/api/stripeAddCard', 'ApiController.stripeAddCard')
    Route.post('/api/stripeChangeDefaultCard', 'ApiController.stripeChangeDefaultCard')
    Route.get('/api/stripeFetchCustomerAllCard', 'ApiController.stripeFetchCustomerAllCard')
    
    // Route.get('/api/stripeCreateConnectAccount', 'ApiController.stripeCreateConnectAccount')
    
    Route.post('/api/stripeConnectAccountVendor', 'ApiController.stripeConnectAccountVendor')
    Route.post('/api/checkPayoutsMoodStatus', 'ApiController.checkPayoutsMoodStatus')
    
    Route.post('/api/stripeFundTransferToVendor', 'ApiController.stripeFundTransferToVendor')
    Route.post('/api/stripePaymentWithSavingCard', 'ApiController.stripePaymentWithSavingCard')
    //end
    
    Route.get('/api/logout', 'ApiController.userLogout')

}).middleware(['auth:jwt'])