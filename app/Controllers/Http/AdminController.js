'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')
const Helpers = use('Helpers')
const _ = use('lodash');
const moment = use('moment');
const Mailjet = use('node-mailjet').connect('ce9c25078a4f1474dc6d3ce5524a711c', 'd9ca8c7b9944f10a34eb42118277e6f5');

const Job = use ('App/Models/Job')
const Location = use ('App/Models/Location')
const AssignCouponToUser = use ('App/Models/AssignCouponToUser');
const Coupon = use ('App/Models/Coupon');
const Service = use ('App/Models/Service');
const JobCategory = use('App/Models/JobCategory')
const ServiceType = use('App/Models/ServiceType');
const ServiceCategory = use('App/Models/ServiceCategory');
const VendorAllocation = use('App/Models/VendorAllocation');
const Notification = use('App/Models/Notification');

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
        if(user.location_id != '') {
            var user_location_id = await Location.findOne({_id : user.location_id});
            var location_name = user_location_id.name;
        }else {
            var location_name = '';
        }
        

        var user_all_coupon_list = await AssignCouponToUser.find({user_id : user_id, status : {
            $nin : ['Expire']
        }}).sort({_id : -1}).populate('coupon_id');

        if (user_all_coupon_list.length > 0) {
            var coupon_list_total = user_all_coupon_list.length;
        }else { 
            var coupon_list_total = 0;
        }

        var jobs_post_details = await Job.find({user_id : user_id}).sort({_id : -1}).populate('vendor_id');

        return view.render('admin.user.user_profile', {user_details : user, location  : location_name, coupon_list : user_all_coupon_list, coupon_list_total : coupon_list_total, jobs_post_details : jobs_post_details});
    }

    async vendor_list ({view}) {
        var all_vendors = await User.find({reg_type : 3}).sort({_id : -1});

        return view.render('admin.vendor.vendor_list', {vendor_lists : all_vendors})
    }

    async vendor_profile ({view,params}) {
        var vendor_id = params.id;
        var vendor_details = await User.findOne({_id : vendor_id});
        var vendor_location_id = await Location.findOne({_id : vendor_details.location_id});
        var location_name = vendor_location_id.name;


        var fetch_vendors_all_jobs_of_interest = await VendorAllocation.find
        ({user_id : vendor_id, status : { $ne: 0 } })
        .populate('job_id')
        .sort({_id : -1});

        var newArray = [];
        if(fetch_vendors_all_jobs_of_interest.length > 0) {
            _.forEach(fetch_vendors_all_jobs_of_interest, jobsOfInterest => {
                var vendor_jobs_status = '';
                switch(jobsOfInterest.status) {
                    case 1:
                        vendor_jobs_status = 'Accepted';
                    break;
                    case 2:
                        vendor_jobs_status = 'Decline';
                    break;
                    case 3:
                        vendor_jobs_status = 'Job Request Sent';
                    break;
                    default:
                        vendor_jobs_status = 'N/A'
                }

                newArray.push({
                    '_id' : jobsOfInterest.job_id._id,
                    'vendor_jobs_status' : vendor_jobs_status,
                    'job_id' : jobsOfInterest.job_id.create_job_id,
                    'title' : jobsOfInterest.job_id.job_title
                });
            })
        }

        return view.render('admin.vendor.vendor_profile', {vendor_details : vendor_details, location_name : location_name, jobs_interest : newArray})
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
            var service_category = await ServiceCategory.find().sort({_id : -1});
            return view.render('admin.service.service_category_list', {service_category,service_category})
        }else {
            return response.redirect('/admin')
        }
    }

    async service_category_add({view}) {
        var fetch_all_service_type = await ServiceType.find();
        return view.render('admin.service.category_add', {fetch_all_service_type : fetch_all_service_type})
    }

    async category_add_submit ({request, response, session}) {
        var category_name = request.input('categoty_name');
        var sub_category_id = request.input('all_added_services');
        var category_desc = request.input('category_desc');


        //image
        var imageFileName = 'category_image_'+Date.now()+'.png';

        const profilePic = request.file('category_image', {
            types: ['image'],
            size: '2mb'
        })

        await profilePic.move(Helpers.publicPath('categories_image'), {
            name: imageFileName
        })
        
        if (!profilePic.moved()) {
            var error_details = profilePic.error();
            session.flash({ image_error_msg : error_details.message })
            return response.redirect('/admin/service-category/add');
        }else {
            var add = new ServiceCategory({
                service_category : category_name,
                description : category_desc,
                category_image: 'http://'+request.header('Host') + '/categories_image/' + imageFileName
            })
    
            var details = await add.save();
    
            if(details) {
                var added_category_details = await ServiceCategory.findOne({_id : details._id})
    
                if (sub_category_id != undefined) {
                    for(var i = 0; i < sub_category_id.length; i++){
                        var info = {
                            service_type_id : sub_category_id[i]
                        }
        
                        added_category_details.service_type.unshift(info); 
        
                        await added_category_details.save();
                    }
    
                    session.flash({ category_msg : 'Record added successfully.' })
                    return response.redirect('/admin/service-category-list')
                }else {
                    session.flash({ category_msg : 'Record added successfully.' })
                    return response.redirect('/admin/service-category-list')
                }
            }
        }
    }

    async subcategory({view}) {
        var all_parent_services = await ServiceType.find({});
        return view.render('admin.service.subcategory', {all_parent_services : all_parent_services})
    }

    async parentService({view}) {
        return view.render('admin.service.parent_service_add')
    }

    async parent_service_category_add ({request, response}) {
        var name = request.input('parent_categoty_name');
        var add = new ServiceType ({
            parent_service : name
        })

        if(await add.save()){
            return response.redirect('/admin/services/parentService')
        }
    }

    async fetch_parent_service_image ({request}) {
        var all_parent_services = await ServiceType.findOne({_id : request.body.parent_service_id});
        return all_parent_services.parent_service_image;
    }

    async sub_service_add ({request, response, session}) {
        console.log(request.body);
        var define_value = request.input('define');
        if(define_value == 1) {
            var imageFileName = 'parent_service_image'+Date.now()+'.jpg';

            const profilePic = request.file('parent_service_image', {
                types: ['image'],
                size: '2mb'
            })

            await profilePic.move(Helpers.publicPath('categories_image'), {
                name: imageFileName
            })
            
            if (!profilePic.moved()) {
                return profilePic.error()
            }else {
                var add = new ServiceType ({
                    parent_service : request.input('sub_categoty_name'),
                    parent_service_image : 'http://'+request.header('Host') + '/categories_image/' + imageFileName
                })
        
                if(await add.save()){
                    session.flash({ sub_service_msg : 'Parent service added successfully.' })
                    return response.redirect('/admin/sub-category-list')
                }
            }

            
        }else if (define_value == 2){
            var parent_service_id = request.input('parent_service_id');
            var details = await ServiceType.findOne({_id : parent_service_id});
            var quote = (request.input('ask_for_quote') == 1 ? 1 : 0);

            var info = {
                name: request.input('sub_categoty_name'),
                price: request.input('category_price'),
                ask_for_quote : quote
            };
            
            details.child_services.unshift(info); 

            await details.save();

            session.flash({ sub_service_msg : 'Child service added successfully.' })
            return response.redirect('/admin/sub-category-list')
        }
        
        
    }

    async sub_category_list ({view, auth, request, response}) {
        var service_type = await ServiceType.find().sort({_id : -1});
        console.log(service_type);
        return view.render('admin.service.sub_category_list', { service_type : service_type});
    }

    async sub_category_edit ({view, params}) {
        var details = await ServiceType.findOne({_id : params.parent_service_id});
        var fetch_child_details = _.filter(details.child_services, child_service => child_service._id == params.child_service_id);

        return view.render('admin.service.sub_service_edit', { parent_details : details, fetch_child_details : fetch_child_details[0]})
    }

    async sub_category_view ({view, params}) {
        var details = await ServiceType.findOne({_id : params.parent_service_id});
        var fetch_child_details = _.filter(details.child_services, child_service => child_service._id == params.child_service_id);

        return view.render('admin.service.sub_service_view', { parent_details : details, fetch_child_details : fetch_child_details[0]})
    }

    async sub_parent_category_edit ({view, params}) {
        var details = await ServiceType.findOne({_id : params.parent_service_id});
        var fetch_child_details = details.child_services;

        return view.render('admin.service.sub_service_edit', { parent_details : details, fetch_child_details : fetch_child_details})
    }

    async sub_parent_category_view ({view, params}) {
        var details = await ServiceType.findOne({_id : params.parent_service_id});
        var fetch_child_details = details.child_services;

        return view.render('admin.service.sub_parent_service_view', { parent_details : details, fetch_child_details : fetch_child_details})
    }

    async sub_service_update ({session, request, response}) {
        var parent_service_id = request.body.parent_service_id;
        var child_service_id = request.body.child_service_id;
        var parent_service_name = request.body.parent_service_name;
        var sub_categoty_name = request.body.sub_categoty_name;
        var category_price = request.body.category_price;
        var quote = (request.body.ask_for_quote == "1" ? 1 : 0)
        var parent_service_image = '';

        if(request.file('parent_service_image') != null) {
            var imageFileName = 'parent_service_image'+Date.now()+'.jpg';

            const profilePic = request.file('parent_service_image', {
                types: ['image'],
                size: '2mb'
            })

            await profilePic.move(Helpers.publicPath('categories_image'), {
                name: imageFileName
            })
            
            if (!profilePic.moved()) {
                return profilePic.error()
            }else {
                parent_service_image = 'http://'+request.header('Host') + '/categories_image/' + imageFileName;
            }
        }else{
            parent_service_image =  request.body.exist_parent_service_image;
        }

        var parent_service_update = await ServiceType.updateOne({_id : parent_service_id},{
            $set : {
                parent_service : parent_service_name,
                parent_service_image : parent_service_image
            }
        })

        if(child_service_id == '') {
            var add_child_service = await ServiceType.findOne({_id : parent_service_id});
            var info = {
                "name" : sub_categoty_name,
                "price" : category_price,
                "ask_for_quote" : quote
            }

            add_child_service.child_services.unshift(info);
            await add_child_service.save();
        }else {
            var child_service_update = await ServiceType.updateOne({_id : parent_service_id, "child_services._id" : child_service_id}, {
                $set : {
                    "child_services.$.name" : sub_categoty_name,
                    "child_services.$.price" : category_price,
                    "child_services.$.ask_for_quote" : quote
                }
            })
        }
        

        session.flash({ sub_service_msg : 'Record has been updated successfully.' })
        return response.redirect('/admin/sub-category-list')

    }

    async parent_service_delete ({params, session, response}) {
        //delete whole document
        var delete_sub_service = await ServiceType.deleteOne({_id : params.parent_id});
        if(delete_sub_service) {
            session.flash({ sub_service_msg : 'Service deleted successfully.' })
            return response.redirect('/admin/sub-category-list');
        }
    }

    async child_service_delete ({params, session, response}) {
        var child_service_update = await ServiceType.updateOne({_id : params.parent_service_id, "child_services._id" : params.child_service_id}, {
            $set : {
                "child_services.$.delete" : 1
            }
        })

        //delete document from nested array object
        // var child_service_delete = await ServiceType.update({_id : params.parent_service_id}, {
        //     $pull : {
        //         "child_services" : {
        //             _id : params.child_service_id
        //         }
        //     }
        // }) ;

        if(child_service_update) {
            session.flash({ sub_service_msg : 'Child Service deleted successfully.' })
            return response.redirect('/admin/sub-category-list');
        }
    }

    async service_category_edit_view ({params, request, response, view}) {
        var fetch_all_service_type = await ServiceType.find();
        // console.log(fetch_all_service_type);

        var details = await ServiceCategory.findOne({_id : params.id})

        if(details.service_type.length > 0) {
            var service_type = details.service_type;
            var tmpArray = [];
            for(var i = 0; i < service_type.length; i++) {
                tmpArray.push(service_type[i].service_type_id)
            }

            var finalArray = []; 
            for(var j = 0; j < fetch_all_service_type.length; j++) {
                var find_details = await _.some(tmpArray, fetch_all_service_type[j]._id)

                if(find_details == true) {
                    finalArray.push({
                        _id : fetch_all_service_type[j]._id,
                        parent_service : fetch_all_service_type[j].parent_service,
                        child_services : fetch_all_service_type[j].child_services,
                        check : true
                    })
                }else {
                    finalArray.push({
                        _id : fetch_all_service_type[j]._id,
                        parent_service : fetch_all_service_type[j].parent_service,
                        child_services : fetch_all_service_type[j].child_services,
                        check : false
                    })
                }
            }

            // console.log(finalArray,'finalArray');
        }else {
            finalArray = fetch_all_service_type
        }
        
        // return false
        
        return view.render('admin.service.category_edit',{details : details, fetch_all_service_type : finalArray})
    }

    async view_service_category ({params, view}) {
        var fetch_all_service_type = await ServiceType.find();
        // console.log(fetch_all_service_type);

        var details = await ServiceCategory.findOne({_id : params.id})

        if(details.service_type.length > 0) {
            var service_type = details.service_type;
            var tmpArray = [];
            for(var i = 0; i < service_type.length; i++) {
                tmpArray.push(service_type[i].service_type_id)
            }

            var finalArray = []; 
            for(var j = 0; j < fetch_all_service_type.length; j++) {
                var find_details = await _.some(tmpArray, fetch_all_service_type[j]._id)

                if(find_details == true) {
                    finalArray.push({
                        _id : fetch_all_service_type[j]._id,
                        parent_service : fetch_all_service_type[j].parent_service,
                        child_services : fetch_all_service_type[j].child_services,
                        check : true
                    })
                }else {
                    finalArray.push({
                        _id : fetch_all_service_type[j]._id,
                        parent_service : fetch_all_service_type[j].parent_service,
                        child_services : fetch_all_service_type[j].child_services,
                        check : false
                    })
                }
            }

            // console.log(finalArray,'finalArray');
        }else {
            finalArray = fetch_all_service_type
        }
        
        // return false
        
        return view.render('admin.service.category_details_view',{details : details, fetch_all_service_type : finalArray})
    }

    async service_category_delete ({params, session, response}) {
        var delete_service_category = await ServiceCategory.deleteOne({_id : params.id});

        if(delete_service_category) {
            session.flash({ category_msg : 'Record deleted successfully.' })
            return response.redirect('/admin/service-category-list')
        }
    }

    async category_edit ({auth, session, request, response}) {
        var category_id = request.input("category_id");
        var categoty_edit_name = request.input('categoty_edit_name');
        var category_edit_desc = request.input("category_edit_desc");
        var service_category_id = request.input('all_added_services');
        var category_edit_image = request.file('category_edit_image');

        var edit_details = await ServiceCategory.findOne({_id : category_id})
        edit_details.service_category = categoty_edit_name;
        edit_details.description = category_edit_desc;

        if(category_edit_image != null){
            //image
            var imageFileName = 'category_image_'+Date.now()+'.png';

            const category_image = request.file('category_edit_image', {
                types: ['image'],
                size: '2mb'
            })

            await category_image.move(Helpers.publicPath('categories_image'), {
                name: imageFileName
            })
            
            if (!category_image.moved()) {
                return category_image.error()
            }
            //end

            edit_details.category_image = 'http://'+request.header('Host') + '/categories_image/' + imageFileName;
        }

        var details = await edit_details.save();

        if(details) {
            var edit_category_details = await ServiceCategory.findOne({_id : details._id})

            if (service_category_id != undefined) {

                if(edit_category_details.service_type.length > 0) {

                    for(var k = 0; k < edit_category_details.service_type.length; k++){
                        var delete_details = await ServiceCategory.update(
                            { _id : category_id },
                            { $pull: { service_type: { service_type_id:  edit_category_details.service_type[k].service_type_id} } },
                            { multi: true }
                        )
                    }

                    var fetch_category_details_after_delete = await ServiceCategory.findOne({_id : details._id})

                    if(fetch_category_details_after_delete.service_type.length == 0){
                        for(var p = 0; p < service_category_id.length; p++){
                            var info = {
                                service_type_id : service_category_id[p]
                            }
            
                            fetch_category_details_after_delete.service_type.unshift(info); 
            
                            await fetch_category_details_after_delete.save();
                        }
                    }
                }else {
                    for(var i = 0; i < service_category_id.length; i++){
                        var info = {
                            service_type_id : service_category_id[i]
                        }
        
                        edit_category_details.service_type.unshift(info); 
        
                        await edit_category_details.save();
                    }
                }

                session.flash({ category_msg : 'Record updated successfully.' })
                return response.redirect('/admin/service-category-list')
            }else {
                for(var j = 0; j < edit_category_details.service_type.length; j++){
                    var delete_details = await ServiceCategory.update(
                        { _id : category_id },
                        { $pull: { service_type: { service_type_id:  edit_category_details.service_type[j].service_type_id} } },
                        { multi: true }
                    )
                }

                session.flash({ category_msg : 'Record updated successfully.' })
                return response.redirect('/admin/service-category-list')
            }
        }
    }

    async coupons_listings ({view, request}) {
        var fetch_data = await Coupon.find().sort({_id : -1});
        var newArray = [];

        _.forEach(fetch_data, function(value) {
            var valid_to1 = value.coupons_valid_to;

            var date_diff = moment().diff(valid_to1, 'days');

            if(date_diff <= 0) {
                newArray.push({
                    '_id' : value._id,
                    'coupons_code' : value.coupons_code,
                    'coupons_amount' : value.coupons_amount,
                    'coupon_type' : value.coupon_type,
                    'status' : 'Active'
                });
            }else {
                newArray.push({
                    '_id' : value._id,
                    'coupons_code' : value.coupons_code,
                    'coupons_amount' : value.coupons_amount,
                    'coupon_type' : value.coupon_type,
                    'status' : 'Expire'
                });
            }
        });

        return view.render('admin.coupons.listings', {fetch_data : newArray})
    }
    
    coupon_add ({view}) {
        return view.render('admin.coupons.add')
    }

    async coupon_submit({session, request, response}) {
        var add = new Coupon({
            coupons_title : request.body.coupon_desc,
            coupons_amount : request.body.coupon_amount,
            coupons_valid_to : request.body.valid_to,
            coupons_code : (request.body.coupon_code).toUpperCase(),
            coupon_type : request.body.coupon_type
        });

        await add.save();

        session.flash({ coupon_msg: 'Coupon added successfully.' });
        return response.redirect('/admin/coupons');

    }

    async view_coupon_details({view, params, response}) {
        var coupon_id = params.id;
        var fetch_coupon_details = await Coupon.findOne({_id : coupon_id});

        if(fetch_coupon_details != null){
            var valid_to_date = this.convertToYYYYMMDD(fetch_coupon_details.coupons_valid_to);
            return view.render('admin.coupons.view', {fetch_coupon_details : fetch_coupon_details, valid_to_date : valid_to_date})
        }else {
            session.flash({ coupon_error: 'Coupon id does not match with our records.' });
            return response.redirect('/admin/coupons');
        } 
    }

    async coupon_edit ({view, session, response, params}) {
        var coupon_id = params.id;
        var fetch_coupon_details = await Coupon.findOne({_id : coupon_id});

        if(fetch_coupon_details != null){
            var valid_to_date = this.convertToYYYYMMDD(fetch_coupon_details.coupons_valid_to);
            return view.render('admin.coupons.edit', {fetch_coupon_details : fetch_coupon_details, valid_to_date : valid_to_date})
        }else {
            session.flash({ coupon_error: 'Coupon id does not match with our records.' });
            return response.redirect('/admin/coupons');
        }
    }

    async coupon_edit_submit({session, request, response}) {
        var fetch_details = await Coupon.findOne({_id : request.body.coupon_id});
        fetch_details.coupons_title = request.body.coupon_desc;
        fetch_details.coupons_amount = request.body.coupon_amount;
        fetch_details.coupons_valid_to = request.body.valid_to;
        fetch_details.coupon_type = request.body.coupon_type;
        fetch_details.coupons_code = request.body.coupon_code;
        fetch_details.created_at = Date.now();

        await fetch_details.save();

        session.flash({ coupon_msg: 'Coupon updated successfully.' });
        return response.redirect('/admin/coupons');
    }

    async coupon_delete({session, params, response}) {
        var coupon_id = params.id;
        var remove_data = await Coupon.deleteOne({_id : coupon_id});

        if(remove_data) {
            session.flash({ coupon_msg: 'Coupon deleted successfully.' });
            return response.redirect('/admin/coupons');
        }
    }

    async assign_coupon_listings ({view}) {
        var assign_coupons_list = await AssignCouponToUser.find().populate('user_id').populate('coupon_id');
        
        return view.render('admin.coupons.assign_coupon_listings', {assign_coupons_list : assign_coupons_list})
    }
    
    async assign_coupon_add_view ({view}) {
        var fetch_all_user = await User.find({ reg_type : 2});
        var all_coupons = await Coupon.find();
        var all_active_coupons_list = [];

        _.forEach(all_coupons, function(value) {
            var valid_to = value.coupons_valid_to;

            var date_diff = moment().diff(valid_to, 'days');

            if(date_diff <= 0) {
                all_active_coupons_list.push({
                    '_id' : value._id,
                    'coupons_code' : value.coupons_code,
                    'coupons_amount' : value.coupons_amount,
                    'coupons_title' : value.coupons_title,
                    'coupon_type' : value.coupon_type,
                    'status' : 'Active'
                });
            }
        });
        return view.render('admin.coupons.assign_coupon_add_view', {users : fetch_all_user, coupons : all_active_coupons_list})
    }

    async coupon_desc({request}) {
        var details = await Coupon.findOne({_id : request.body.coupon_id});
        return details.coupons_title;
    }

    async assign_coupon_submit({session, response, request}) {        
        var users = request.input('assign_to_user');
        var coupon_id = request.input('select_coupon');

        var already_assign = 0;
        var newly_assign = 0;

        for(var i = 0; i < users.length; i++) {
            var isCheck = await AssignCouponToUser.find({coupon_id : coupon_id, user_id : users[i]});

            if(isCheck.length > 0) {
                already_assign = already_assign + 1;
            }else {
                var user_details = await User.findOne({_id : users[i]});
    
                var assign = new AssignCouponToUser({
                    user_id : users[i],
                    coupon_id : coupon_id
                })
    
                if(await assign.save()) {
                    newly_assign = newly_assign + 1;

                    var coupon_details = await Coupon.findOne({_id : coupon_id})
                    var sendEmail = Mailjet.post('send');
                    var emailData = {
                        'FromEmail': 'sobhan.das@intersoftkk.com',
                        'FromName': 'Oh! My Concierge',
                        'Subject': 'Promocode',
                        'Html-part': "One promo code has assign to you.",
                        'Recipients': [{'Email': user_details.email}]
                    };
                    await sendEmail.request(emailData);
                }
            }
        };

        if(already_assign == 0 && newly_assign > 0) {
            session.flash({ coupon_msg: 'Coupon has assigned successfully to the user.' });
            return response.redirect('/admin/assign/coupons');
        }
        else if(already_assign > 0 && newly_assign == 0) {
            session.flash({ coupon_msg: 'Coupon has already assigned for the user.' });
            return response.redirect('/admin/assign/coupons');
        }
        else if (already_assign > 0 && newly_assign > 0) {
            session.flash({ coupon_msg: `Coupon has already assigned for ${already_assign} user and coupon has successfully assigned for ${newly_assign} user.` });
            return response.redirect('/admin/assign/coupons');
        }
        
    }

    async unassigned_coupon ({session, params, response}) {
        var unassigned = await AssignCouponToUser.deleteOne({_id : params.id});
        if(unassigned) {
            session.flash({ coupon_msg: 'Coupon has successfully deleted for the user.' });
            return response.redirect('/admin/assign/coupons');
        }
    }

    async jobs_listings({view}) {
        var fetch_all_jobs = await Job.find({}).sort({ _id : -1 })
        .populate('user_id')
        .populate('service_category')
        .populate('added_services_details.parent_service_id')
        .populate('vendor_id');

        return view.render('admin.jobs.listings', { fetch_all_jobs : fetch_all_jobs});
    }

    async job_details ({view, session, params, response}) {
        var fetch_job_details = await Job.findOne({_id : params.id}).sort({ _id : -1 })
        .populate('user_id')
        .populate('service_category')
        .populate('added_services_details.parent_service_id')
        .populate('vendor_id');

        var job_post_date = this.convertToYYYYMMDD(fetch_job_details.created_at);


        var added_services = fetch_job_details.added_services_details;

        if(fetch_job_details != null) {
            return view.render('admin.jobs.details', { fetch_job_details : fetch_job_details, job_post_date : job_post_date, added_services : added_services})
        }else {
            session.flash({ job_error_msg: 'Something went wrong.' })
            return response.redirect('/admin/jobs')
        }
    }

    async notification ({view, response}) {
        var fetch_all_details = await Notification.find().sort({_id : -1});

        return view.render('admin.notification', { fetch_all_details : fetch_all_details});
    }

    //first letter capital
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    //end

    //date converter
    convertToYYYYMMDD(d) {
        var date = new Date(d);
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var dt = date.getDate();
    
        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }
        return (month+'/' +dt + '/'+year);
    }
}

module.exports = AdminController
