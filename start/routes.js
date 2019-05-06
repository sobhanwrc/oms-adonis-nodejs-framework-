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
Route.post('/contact-us', 'LoginController.contact_us')
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

    Route.get('/admin/service-list', 'AdminController.service_list')
    Route.get('/admin/registered_service/view/:id', 'AdminController.registered_service_view')

    Route.get('/admin/Location', 'AdminController.location')
    Route.post('/admin/location/add', 'AdminController.location_add')
    Route.post('/admin/location/details/:id', 'AdminController.location_details')
    Route.post('/admin/location/edit', 'AdminController.location_edit')
    Route.get('/admin/location/delete/:id', 'AdminController.location_delete')

    Route.get('/admin/service-category-list', 'AdminController.service_category_view')
    Route.get('/admin/service-category/add', 'AdminController.service_category_add')
    Route.get('/admin/services/subcategory', 'AdminController.subcategory')
    Route.get('/admin/services/parentService', 'AdminController.parentService')
    Route.post('/admin/service/parent_service_category_add', 'AdminController.parent_service_category_add')
    Route.post('/admin/service/sub-service-add', 'AdminController.sub_service_add')
    Route.post('/admin/service/category-add', 'AdminController.category_add_submit')
    Route.get('/admin/sub-category-list', 'AdminController.sub_category_list')
    Route.get('/admin/service-category/edit/:id', 'AdminController.service_category_edit_view')
    Route.get('/admin/service-category/delete/:id', 'AdminController.service_category_delete')
    Route.post('/admin/service/category-edit/submit', 'AdminController.category_edit')
    Route.post('/admin/fetch_parent_service_image', 'AdminController.fetch_parent_service_image')
    Route.get('/admin/sub-child_service-category/delete/:parent_service_id/:child_service_id', 'AdminController.child_service_delete')
    Route.get('/admin/sub-parent_service-category/delete/:parent_id', 'AdminController.parent_service_delete')
    Route.get('/admin/sub-service-category/edit/:parent_service_id/:child_service_id', 'AdminController.sub_category_edit')
    Route.post('/admin/service/sub-service-edit-submit', 'AdminController.sub_service_update')
    Route.get('/admin/sub-parent_service-category/edit/:parent_service_id', 'AdminController.sub_parent_category_edit')
    Route.get('/admin/service/view_details/:id', 'AdminController.view_service_category')
    Route.get('/admin/sub-service-category/view/:parent_service_id/:child_service_id', 'AdminController.sub_category_view')
    Route.get('/admin/sub-parent_service-category/view/:parent_service_id', 'AdminController.sub_parent_category_view')

    Route.get('/admin/coupons', 'AdminController.coupons_listings')
    Route.get('/admin/coupon/add', 'AdminController.coupon_add')
    Route.post('/admin/coupon/coupon_submit', 'AdminController.coupon_submit')
    Route.get('/admin/coupon/edit/:id', 'AdminController.coupon_edit')
    Route.post('/admin/coupon/coupon_edit_submit', 'AdminController.coupon_edit_submit')
    Route.get('/admin/coupon/delete/:id', 'AdminController.coupon_delete')
    Route.get('/admin/coupon/view_details/:id', 'AdminController.view_coupon_details')

    Route.get('/admin/assign/coupons', 'AdminController.assign_coupon_listings')
    Route.get('/admin/assign/coupon/add', 'AdminController.assign_coupon_add_view')
    Route.post('/admin/assign/coupon/fetch_coupon_desc', 'AdminController.coupon_desc')
    Route.post('/admin/assign/coupon/submit', 'AdminController.assign_coupon_submit')
    Route.get('/admin/assign/coupon/delete/:id', 'AdminController.unassigned_coupon')
    Route.get('/admin/assign/coupon/view/:id', 'AdminController.assign_coupon_view_details')

    Route.get('/admin/jobs', 'AdminController.jobs_listings')
    Route.get('/admin/jobs/details/:id', 'AdminController.job_details')

    Route.get('/admin/notification', 'AdminController.notification')
}).middleware(['auth:session', 'notification'])
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
Route.post('/api/vendor/topup-credit-stripe', 'ApiController.stripeTopUpCredit')
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

    Route.post('/api/vendorJobAutoAccept', 'ApiController.vendorJobAutoAccept')

    Route.post('/api/vendorSentQuoteToUser', 'ApiController.vendorSentQuoteToUser')

    Route.post('/api/userViewQuoteFromVendors', 'ApiController.userViewQuoteFromVendors')

    Route.post('/api/userAcceptSentQuoteOfVendor', 'ApiController.userAcceptSentQuoteOfVendor')

    Route.post('/api/markJobAsComplete', 'ApiController.markJobAsComplete')

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