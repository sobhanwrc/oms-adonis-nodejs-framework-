'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')
const Helpers = use('Helpers')

const Job = use ('App/Models/Job')
const Location = use ('App/Models/Location')
const AssignCouponToUser = use ('App/Models/AssignCouponToUser');
const Coupon = use ('App/Models/Coupon');
const Service = use ('App/Models/Service');
const JobCategory = use('App/Models/JobCategory')

class AdminController {
    login_view({view}) {
        return view.render('admin.login')
    }

    async login_submit ({request, response, session, auth}) {
        var user_email = request.input('username')
        var password = request.input('password')
        var reg_type = 1; 

        try{
            var result = await auth.attempt(user_email, password)
            console.log(result);

            return response.redirect('/admin/dashboard')
        }catch(e) {
            session.flash({ login_error: 'Wrong username or password.' })
            
            return response.redirect('/admin')
        }
    }
    
    async logout ({auth, response}) {
        await auth.logout()

        return response.redirect('/admin')
    }

    async dashboard({view}) {
        var fetch_total_users = await User.find({reg_type : 2});
        var fetch_total_vendors = await User.find({reg_type : 3});
        var totals_jobs_posted = await Job.find();

        var user_progress_bar = 0;
        var vendor_progress_bar = 0;
        var totals_jobs_posted_progress_bar = 0;
        
        if(fetch_total_users.length >= 0 && fetch_total_users.length <= 100) {
            user_progress_bar = fetch_total_users.length + "%";
        }else {
            user_progress_bar = "100%"
        }

        if(fetch_total_vendors.length >= 0 && fetch_total_vendors.length <= 100) {
            vendor_progress_bar = fetch_total_vendors.length + "%";
        }else {
            vendor_progress_bar = "100%"
        }

        if(totals_jobs_posted.length >= 0 && totals_jobs_posted.length <= 100) {
            totals_jobs_posted_progress_bar = totals_jobs_posted.length + "%";
        }else {
            totals_jobs_posted_progress_bar = "100%";
        }

        return view.render('admin.dashboard',{total_users:fetch_total_users.length, total_vendors: fetch_total_vendors.length, user_progress_bar:user_progress_bar, vendor_progress_bar:vendor_progress_bar, totals_jobs_posted : totals_jobs_posted.length, job_progress_bar : totals_jobs_posted_progress_bar})
    }

    async profile ({view}) {
        var admin_details = await User.findOne({reg_type : 1});
        var all_location_details = await Location.find();

        return view.render('admin.profile', {admin_details : admin_details, all_location_details : all_location_details})
    }

    async profile_edit ({auth, request, response, session}){
        var user = await auth.getUser();

        var full_name = request.body.full_name;
        var data = full_name.split(" ");
        var first_name = data[0];
        var last_name = data[1];

        var gender = request.input('gender') ? request.input('gender') : user.gender; //M ='Male', F='Female'

        var phone_number = request.body.phone_number;
        var address = request.body.address;
        var dob = request.body.dob;
        
        
        var location_id = request.body.location_id;

        user.first_name = first_name;
        user.last_name = last_name;
        user.gender = gender;
        user.phone_number = phone_number;
        user.address = address;
        user.location_id = location_id;
        user.dob = dob;

        if(await user.save()) {          
            session.flash({ profile_edit : 'Profile successfully updated.' })
            
            return response.redirect('/admin/profile')
        }else { 
            response.json ({
                status : false,
                code : 400,
                message : "Profile updated failed."
            });
        }
    }

    async changePassword ({auth, request, response}) {
        var user = await auth.getUser();

        //for checking db existing pw with user given pw
        const isSame = await Hash.verify(request.body.old_password, user.password);

        if(isSame) {
            var new_password = await Hash.make(request.body.confirm_password);
            user.password = new_password;

            if(await user.save()) {
                response.json ({
                    status : true,
                    code : 200,
                    message : "Password updated successfully."
                });
            }
        }else{ 
            response.json ({
                status : false,
                code : 400,
                message : "Old password does not match."
            });
        }
    }

    async change_profile_image ({request, response, auth}) {
        
        var user = await auth.getUser();

        var imageFileName = 'admin_profile_image_'+Date.now()+'.jpg';

        const profilePic = request.file('profile_pic', {
            types: ['image'],
            size: '2mb'
        })

        await profilePic.move(Helpers.publicPath('profile_image'), {
            name: imageFileName
        })
        
        if (!profilePic.moved()) {
            return profilePic.error()
        }

        user.profile_image = 'http://'+request.header('Host') + '/profile_image/' + imageFileName;
        user.save();

        return response.redirect('/admin/profile');
        
    }

    async user_list ({view}) {
        var all_user_list = await User.find({reg_type : 2}).sort({_id : -1});

        return view.render('admin.user.user_list', {users : all_user_list})
    }

    async user_profile ({view,params}) {
        var user_id = params.id;
        var user = await User.findOne({_id : user_id});
        var user_location_id = await Location.findOne({_id : user.location_id});
        var location_name = user_location_id.name;

        //coupons
        var user_all_coupon_list = await AssignCouponToUser.find({user_id : user_id, status : {
            $nin : ['Expire']
        }}).sort({_id : -1}).populate('coupon_id');
        // console.log(user_all_coupon_list, 'user_all_coupon_list');
        // return false

        if (user_all_coupon_list.length > 0) {
            var coupon_list_total = user_all_coupon_list.length;
        }else { 
            var coupon_list_total = 0;
        }
        // console.log(coupon_list_total,'coupon_list_total');
        return view.render('admin.user.user_profile', {user_details : user, location  : location_name, coupon_list : user_all_coupon_list, coupon_list_total : coupon_list_total});
    }

    async vendor_list ({view}) {
        var all_vendors = await User.find({reg_type : 3}).sort({_id : -1});
        console.log(all_vendors);

        return view.render('admin.vendor.vendor_list', {vendor_lists : all_vendors})
    }

    async vendor_profile ({view,params}) {
        var vendor_id = params.id;
        var vendor_details = await User.findOne({_id : vendor_id});
        var vendor_location_id = await Location.findOne({_id : vendor_details.location_id});
        var location_name = vendor_location_id.name;

        return view.render('admin.vendor.vendor_profile', {vendor_details : vendor_details, location_name : location_name})
    }

    async service_list ({auth,view, response}) {
        if(await auth.check()) {
            var all_services = await Service.find()
            .populate('user_id')
            .populate('service_category')
            .sort({_id : -1});
            
            return view.render('admin.service.service_list', {all_services : all_services})
        }else {
            response.redirect('/admin')
        }
    }

    async location ({auth, view, response}) {
        if(await auth.check()) {
            var fetch_all_locations = await Location.find().sort({_id : -1});
            return view.render('admin.location.index', { fetch_all_locations: fetch_all_locations})
        }else {
            return response.redirect('/admin')
        }
    }

    async location_add ({auth, request, response, session}) {
        var location_name = this.capitalizeFirstLetter(request.input('location_name'));

        var add = new Location({
            name : location_name
        });

        if(await add.save()) {
            session.flash({ location_add_msg: 'Location added successfully.' });
            return response.redirect('/admin/location');
        }
    }

    async location_delete ({auth, session, response, params}) {
        if(await auth.check()) {
            var location_delete = await Location.remove({_id : params.id});
            if(location_delete) {
                session.flash({ location_add_msg: 'Location deleted successfully.' });
                return response.redirect('/admin/location');
            }
        }else {
            return response.redirect('/admin')
        }
    }

    async location_details ({auth, session, response, params}) {
        var location_details = await Location.find({_id : params.id})
        return location_details;
    }

    async location_edit ({request, response, session}) {
        var location_id = request.input('location_id');
        var location_name = request.input('edit_location_name');

        var edit = await Location.updateOne({ _id :  location_id}, {
            $set :{
                name : location_name
            }
        })

        if(edit) {
            session.flash({ location_add_msg: 'Location name updated successfully.' });
            return response.redirect('/admin/location');
        }
    }

    async service_category_view ({auth, response, view}) {
        if(await auth.check()) {
            var service_category = await JobCategory.find();
            return view.render('admin.service.service_category_list', {service_category,service_category})
        }else {
            return response.redirect('/admin')
        }
    }

    //first letter capital
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
      //end
}

module.exports = AdminController
