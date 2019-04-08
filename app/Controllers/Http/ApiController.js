'use strict'

var url = use('url');
const Env = use('Env')
const Hash = use('Hash')
const User = use('App/Models/User')
const JobIndustry = use('App/Models/JobIndustry')
const JobCategory = use('App/Models/JobCategory')
const Job = use('App/Models/Job')
const Mailjet = use('node-mailjet').connect('ce9c25078a4f1474dc6d3ce5524a711c', 'd9ca8c7b9944f10a34eb42118277e6f5');
const gravatar = use('gravatar');
const base64_to_image = use ('base64-to-image');
const randomstring = use("randomstring");
const datetime = use('node-datetime');
const moment = use('moment');
const Encryption = use ('Encryption');
const Location = use ('App/Models/Location');
const Helpers = use ('Helpers');
const ServiceType = use('App/Models/ServiceType');
const ServiceCategory = use('App/Models/ServiceCategory');
const Service = use ('App/Models/Service');
const VendorAllocation = use ('App/Models/VendorAllocation');
const Coupon = use ('App/Models/Coupon');
const AssignCouponToUser = use ('App/Models/AssignCouponToUser');
const stripe = use('stripe')('sk_test_1lfdJgJawDb3EFLvNDyi1p7v');
const AuditLog = use('App/Models/AuditLog');
const Notification = use('App/Models/Notification');
const AppNotification = use('App/Models/AppNotification');
// ('sk_test_1lfdJgJawDb3EFLvNDyi1p7v'); //secret key for test account

const _ = use('lodash');
const Rating = use ('App/Models/Rating');
const {rate,average} = use('average-rating');
const StripeTransaction = use ('App/Models/StripeTransaction');
const axios = use('axios');

var FCM = use('fcm-node');
var serverKey = Env.get("FCM_SERVER_KEY"); //put your server key here
var fcm = new FCM(serverKey);

var msg_body = '';
var click_action = '';

class ApiController {

  // async fetchGeoLocation ({request, response}) {
  //   var address = request.input('user_address');

  //   geocoder.geocode(address)
  //   .then(function(res) {
  //     console.log(res);
  //   })
  //   .catch(function(err) {
  //     console.log(err);
  //   });

  //   // console.log(result);
  // }

    //common api for all 

    async registration ({request, response, auth}) {
        var first_name = request.input('first_name');
        var last_name = request.input('last_name');
        var middle_name = request.input('middle_name');
        var email = request.input('email');
        // var phone_number = request.input('phone_number') ? request.input('phone_number') : '';
        var password = await Hash.make(request.input('password'));
        var address = request.input('address');
        var location_id = request.input('location_id');
        var city = 'Singapore';
        var dob = request.input('dob');
        var company_name = request.input('company_name');
        var company_address = request.input('company_address');
        var uen_no = request.input('uen_no');
        var reg_type = 0;
        var device_id = request.input('device_id');
        var business = {
            company_name : company_name,
            company_address : company_address
        }
        var bank = {};

        var latitude = request.input('latitude') ? request.input('latitude') : 0;
        var longitude = request.input('longitude') ? request.input('longitude') : 0;
        var geoLocation = {
          type : "Point",
          coordinates : [latitude , longitude]
        }

        const avatar = gravatar.url(email, {
            s: '200', // Size
            r: 'pg', // Rating
            d: 'mm' // Default
        });
        
        if(!company_name){
            reg_type = 2 //user
        }else { 
            reg_type = 3 //vendor

            var check_validate = this.validateUEN(uen_no);
            var check_sameUEN = await User.find({uen_no : uen_no});
        }

        var checkExistingUser = await User.findOne({email : email});
        
        if(checkExistingUser) {
            response.json ({
                status : false,
                code : 400,
                message : "User is already registered with us."
            });
        }
        else if (reg_type == 3 && check_validate != true) {
          response.json ({
              status : false,
              code : 400,
              message : "Your UEN number is invalid. Please enter correct UEN number."
          });
        } 
        else if (reg_type == 3 && check_validate == true && check_sameUEN.length > 0) {
          response.json ({
              status : false,
              code : 400,
              message : "UEN number is duplicate. Enter valid UEN number."
          });
        }
        else {
            var add = new User({  
                first_name : first_name,
                middle_name : middle_name,
                last_name : last_name,
                profile_image : "http:" + avatar, 
                profile_image_type : "N",
                email : email,
                // phone_number : phone_number,
                address : address,
                location_id : location_id,
                city : city,
                dob : dob,
                business : business,
                bank_information : bank,
                uen_no : uen_no,
                status : 1, //active
                reg_type : reg_type,
                login_type : "N",
                password: password,
                device_id : device_id,
                geoLocation : geoLocation
            });

            try{
                if(await add.save()) {
                    const user = await User.findOne({email : email});
                    var generate_token = await auth.authenticator('jwt').generate(user);
                    var send_registration_email = this.registrationEmailData(user);

                    if(send_registration_email == true) {
                      var add_notification = this.add_notification(user);

                      //push notification to app
                      msg_body = `Hi, ${user.first_name} ${user.last_name} welcome to OMC`;
                      click_action = 'Registration';
                      this.sentPushNotification(user.device_id, msg_body, user, click_action);
                      //end

                      return response.json({
                          status: true, 
                          code: 200, 
                          token: 'Bearer ' + generate_token.token,
                          message: 'Registration completed successfully.'
                      });
                    }
                }

            }catch (error) {
                throw error;
            }
        }

    }

    async submitLogin ({ request, response, auth}){
      var reg_type = request.input('reg_type'); //2 ='user', 3='vendor'
      var device_token = request.input('device_id');

      const user = await User.findOne({email : request.input('email'), reg_type : reg_type});
      
      if(user === null) {
        response.json ({
            status: false,
            code: 400,
            message : "Wrong username or password."
        });
      } else{ 
        if(Object.keys(user).length > 0) {
          const isSame = await Hash.verify(request.input('password'), user.password);

          if(user != null && isSame && user.status === 1) {
            
            if(user.device_id != ''){ 
              user.device_id = device_token;

              await user.save();
            }else {
              user.device_id = device_token;

              await user.save();
            }

            var generate_token = await auth.authenticator('jwt').generate(user);

              return response.json({
                  status: true,
                  code : 200,
                  token: 'Bearer ' + generate_token.token,
                  message : "Login successfully."
              })
          }else if (user.status == 0) {
              return response.json ({
                  status: false,
                  code: 400,
                  message : "Your account has been deactivated. Because you have recently requested for forgot password. So, check your email for forgot password link or contact with OMC admin."
              });
          }else { 
              return response.json ({
                  status: false,
                  code: 400,
                  message : "Wrong username or password."
              });
          }
          
        }
      }
    }

    async socialLogin ({request, response, auth}) {
      var email = request.input('email');
      var login_type = request.input('login_type'); //F = facebook, G = google, N = Normal
      // var reg_type = 2;
      var user = await User.findOne({email, login_type: 'N'});

      if(user){
        response.json({
          success: false, 
          code: 400, 
          message: 'User already exist.'
        });
      }else{

        if(login_type == 'F'){
          try{
            var already_login_with_social_app = await User.findOne({email,login_type: 'F'});
        
            if(already_login_with_social_app) {
              already_login_with_social_app.first_name = request.input('full_name');
              already_login_with_social_app.email = request.input('email');

              if(already_login_with_social_app.profile_image_type == 'F') {
                if(this.extractHostname(request.input('profile_image')) == 'graph.facebook.com') {
                  already_login_with_social_app.profile_image = request.input('profile_image');
                }
              }
        
              if(already_login_with_social_app.save()){
                const user = await User.findOne({email : email});
                var generate_token = await auth.authenticator('jwt').generate(user);

                return response.json({
                    status : true, 
                    code: 200,
                    token: 'Bearer ' + generate_token.token,
                    message: 'Login successfully.'
                });
              }
            }else{
              var secretKey = await randomstring.generate({
                  length: 7,
                  charset: 'alphanumeric'
              });

              var social_login_pw = await Hash.make(secretKey);

              const newUser = new User({
                first_name: request.input('full_name'),
                last_name: '',
                email: request.input('email'),
                profile_image: request.input('profile_image'),
                profile_image_type : "F",
                password: secretKey,
                reg_type: 2,
                login_type : 'F',
                status: 1
              });
          
              if(await newUser.save()){
                const user = await User.findOne({email : email});
                var generate_token = await auth.authenticator('jwt').generate(user);
                var send_registration_email_from_social_login = this.registrationEmailData(user);

                if(send_registration_email_from_social_login == true) {
                    return response.json({
                        status: true, 
                        code: 200, 
                        token: 'Bearer ' + generate_token.token,
                        password : social_login_pw,
                        message: 'Registration completed successfully with Facebook.'
                    });
                }
              }
            }
          }catch(e){
            response.json({
              status : false,
              code : 300,
              message : "Email already exist."
            });
          }
        }
        else if (login_type == 'G') {
          try{
            var already_login_with_social_app_google = await User.findOne({email,login_type: 'G'});
        
            if(already_login_with_social_app_google) {
              already_login_with_social_app_google.first_name = request.input('full_name');
              already_login_with_social_app_google.email = request.input('email');

              if(already_login_with_social_app_google.profile_image_type == 'G') {
                if(this.extractHostname(request.input('profile_image')) == 'lh5.googleusercontent.com') {
                  already_login_with_social_app_google.profile_image =request.input('profile_image');
                }
              }
        
              if(already_login_with_social_app_google.save()){
                const user = await User.findOne({email : email});
                var generate_token = await auth.authenticator('jwt').generate(user);

                return response.json({
                    status : true, 
                    code: 200, 
                    token: 'Bearer ' + generate_token.token,
                    message: 'Login successfully with Google.'
                });
              }
            }else{
              var secretKey = await randomstring.generate({
                  length: 7,
                  charset: 'alphanumeric'
              });

              var social_login_pw = await Hash.make(secretKey);

              const newUser = new User({
                first_name: request.input('full_name'),
                email: request.input('email'),
                profile_image: request.input('profile_image'),
                profile_image_type : "G",
                password: social_login_pw,
                reg_type: 2,
                login_type : 'G',
                status: 1
              });
          
              if(await newUser.save()){
                const user = await User.findOne({email : email});
                var generate_token = await auth.authenticator('jwt').generate(user);
                var send_registration_email_from_social_login = this.registrationEmailData(user);

                if(send_registration_email_from_social_login == true) {
                    return response.json({
                        status : true, 
                        code: 200, 
                        token: 'Bearer ' + generate_token.token,
                        password : secretKey,
                        message: 'Registration completed successfully with Google.'
                    });
                }
              }
            }
          }catch(e) {
            response.json({
              status : false,
              code : 300,
              message : "Email already exist."
            });
          }
        }
        
      }
    }

    async userDetails ({ request, response, auth}) {
        try {
          var user_details = await auth.getUser();
          // console.log(user_details);
          // return false
          if(user_details.location_id != '') {
            var user_location_id = user_details.location_id;
            if(user_location_id) {
              var location_details = await Location.findOne({_id : user_location_id})
              // console.log(location_details,'location_details');
              // return false
              if(location_details != null){
                var location_place_name = location_details.name;
              }else {
                var location_place_name = "N/A";
              }
              
            }
          }else {
            var location_place_name = "N/A";
          }

          response.json ({
            status : true,
            code:200,
            user_location_name : location_place_name,
            data: user_details
          });
        } catch (error) {
          response.json ({
            status : false,
            code : 400,
            message : "No details found."
          });
        }
    }

    async profileEdit ({ request, response, auth }) {
        var user = await auth.getUser();
        console.log(user,'profile edit');

        var first_name = request.input('first_name') ? request.input('first_name') : user.first_name;
        var middle_name = request.input('middle_name') ? request.input('middle_name') : user.middle_name;
        var last_name = request.input('last_name') ? request.input('last_name') : user.last_name;
        var gender = request.input('gender') ? request.input('gender') : user.gender; //M ='Male', F='Female'

        var bank_name = request.input('bank_name');
        var account_no = request.input('account_no');
        var swift_code = request.input('swift_code');

        var phone_number = request.input('phone_number') ? request.input('phone_number') : user.phone_number;
        var address = request.input('address') ? request.input('address') : user.address;
        // var city = '';
        var dob = request.input('dob') ? request.input('dob') : user.dob;

        if(request.input('company_name')) {
          var company_name = request.input('company_name') ? request.input('company_name') : user.business[0].company_name;
        }else {
          var company_name = ''
        }
        
        if(request.input('company_address')) {
          var company_address = request.input('company_address') ? request.input('company_address') : user.business[0].company_address;
        }else {
          var company_address = ''
        }

        if(request.input('company_ph_no')) {
          var company_ph_no = request.input('company_ph_no') ? request.input('company_ph_no') : user.business[0].company_ph_no;
        }else {
          var company_ph_no = ''
        }
        
        if(request.input('experience')) {
          var experience = request.input('experience') ? request.input('experience') : user.business[0].experience;
        }else {
          var experience = ''
        }
        
        if(request.input('service_type')) {
          var service_type = request.input('service_type') ? request.input('service_type') : user.business[0].service_type;
        }else { 
          var service_type = ''
        }
        
        if(request.input('services')) {
          var services = request.input('services') ? request.input('services') : user.business[0].services;
        }else {
          var services = ''
        }

        // if (request.input('uen_no')) {
        //   var uen_no = request.input('uen_no') ? request.input('uen_no') : user.uen_no;
        // }else {
        //   var uen_no = ''
        // }
        
        
        var location_id = request.input('location_id') ? request.input('location_id') : user.location_id;

        user.bank_information = {
            bank_name : '',
            account_no : '',
            swift_code : '',
        }

        var accept = request.input('auto_accept') ? request.input('auto_accept') : user.business[0].job_auto_accept;

        user.first_name = first_name;
        user.middle_name = middle_name;
        user.last_name = last_name;
        user.gender = gender;
        user.phone_number = phone_number;
        user.address = address;
        user.location_id = location_id;
        user.dob = dob;
        // user.uen_no = uen_no;
        user.business = {
            company_name : company_name,
            company_address : company_address,
            company_ph_no : company_ph_no,
            experience : experience,
            service_type : service_type,
            services : services,
            job_auto_accept : accept
        }
        // user.status = 1;
        // user.forgot_pw_email_sent_date = '';
        // user.forgot_pw_key = '';

        if(await user.save()) {
          var user_details = await auth.getUser();
          var user_location_id = user_details.location_id;

          if(user_location_id) {
            var location_details = await Location.findOne({_id : user_location_id})
            var location_place_name = location_details.name;
          }
          
          //push notification to app
          msg_body = "Your profile has successfully updated.";
          click_action = "Profile";
          await this.sentPushNotification(user.device_id, msg_body, user, click_action);
          //end

          response.json ({
              status : true,
              code : 200,
              data: user,
              message : "Profile updated successfully.",
              user_location_name : location_place_name,
              data : user_details
          });
        }else { 
          response.json ({
              status : false,
              code : 400,
              message : "Profile updated failed."
          });
        }

    }

    async fetchUserPresentAddress ({request, response, auth}) {
      var user = await auth.getUser();
      var checkPresentAddress = request.input('check_address');

      if(checkPresentAddress == 1) {
        if(user.address != '') {
          response.json({
            status : true,
            code : 200,
            data : user.address
          });
        }else { 
          response.json({
            status : false,
            code : 400,
            message : "No address found."
          });
        } 
      }
    }

    async uploadProfileImage ({ request, response, auth}) {
        try{
            var user = await auth.getUser();

            var image_mime_type = request.input('mime');
            var base64Str = 'data:'+ image_mime_type +';base64,'+ request.input('profile_image');
    
            // var base64Str = request.input('profile_i'mage.replace(/^data:image\/jpeg+;base64,/, "");

            var new_link = base64Str.replace(/(\r\n|\r|\n)/g, '');
            var base64Str1 = new_link.replace(/ /g, '+');

            let base64ImageMimeType = base64Str1.split(';base64,');
            var type = base64ImageMimeType[0].split(':image/');

            var path ='public/profile_image/';

            var imageFileName = user.id + '-' + Date.now();
            var optionalObj = {'fileName': imageFileName, 'type': type[1]};
            var uploadImage = base64_to_image(base64Str1,path,optionalObj);

            var full_image_path = request.header('Host') + '/profile_image/' + uploadImage.fileName;

            user.profile_image = 'http://'+full_image_path;
            user.profile_image_type = "N";

            if(await user.save()){
              //push notification to app
              msg_body = "Your profile picture has successfully updated.";
              click_action = "Profile";
              await this.sentPushNotification(user.device_id, msg_body, user, click_action);
              //end

              response.json({
                status: true,
                code:200,
                image_link : full_image_path,
                message: "Profile image uploaded successfully."
              });
            }
        }catch (error) {
            throw error;
        }
    }

    async changePassword ({request, response, auth}) {
        var user = await auth.getUser();

        var user_old_password = request.input('old_password');

        //for checking db existing pw with user given pw
        const isSame = await Hash.verify(user_old_password, user.password);

        if(isSame) {
            var new_password = await Hash.make(request.input('new_password'));
            user.password = new_password;

            if(await user.save()) {
              //push notification to app
              msg_body = "Your password has successfully changed.";
              click_action = "Change Password";
              await this.sentPushNotification(user.device_id, msg_body, user, click_action);
              //end

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

    async forgotPassword ({ request, response}) {
        var email = request.input('email');
        var user = await User.findOne({ email:email });

        if(user) {
            if(user.forgot_pw_key != '') {
                var date1 = new Date(user.forgot_pw_email_sent_date);
                var date2 = new Date();
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

                if(diffDays <= 2) {
                    response.json({
                        status : true,
                        code : 200,
                        message : "Password reset link already sent to your email. Please check your email."
                    });
                    
                } else { 

                    var secretKey = await randomstring.generate({
                        length: 16,
                        charset: 'alphanumeric'
                    });
                    // var link = "http://"+request.header('Host')+"/forgot-password";
                    var link = "http://"+request.header('Host')+"/forgot-password"+ "?key=" + secretKey + "&date="+ Date.now();
        
                    user.forgot_pw_key = secretKey;
                    user.forgot_pw_email_sent_date = Date.now();
                    user.status = 0;//inactive
        
                    var email_sent_status = this.fortgotPasswordSentEmail(user, link);
                    if(email_sent_status == true) {
                      if (await user.save()) {
                        return response.json({
                            status: true, 
                            code: 200,
                            secret_key : secretKey,
                            message: 'Forgot password link sent successfully to your email.'
                        });
                      }
                    }
                }
            } else { 
                var secretKey = await randomstring.generate({
                    length: 16,
                    charset: 'alphanumeric'
                });
                // var link = "http://"+request.header('Host')+"/forgot-password";
                var link = "http://"+request.header('Host')+"/forgot-password"+ "?key=" + secretKey + "&date="+ Date.now();
    
                user.forgot_pw_key = secretKey;
                user.forgot_pw_email_sent_date = Date.now();
                user.status = 0;//inactive
                
                var email_sent_status = this.fortgotPasswordSentEmail(user, link);
                if(email_sent_status == true) {
                  if (await user.save()) {
                    return response.json({
                        status: true, 
                        code: 200,
                        secret_key : secretKey,
                        message: 'Forgot password link sent successfully to your email.'
                    });
                  }
                }
            }

        }else { 
            response.json ({
                status : false,
                code: 400,
                message: "Your email not registered with us."
            });
        }
    }

    async updateForgotPW ({request, response}) {
      var secret_key = request.input('secret_key');
      var new_password = await Hash.make(request.input('new_password'));

      var user = await User.findOne({forgot_pw_key : secret_key});
      if(user){
        user.password = new_password;
        user.status = 1;
        user.forgot_pw_key = '';

        if(await user.save()) {
            response.json ({
                status : true,
                code : 200,
                message : "Password updated successfully."
            });
        }
      }else {
        response.json ({
            status : false,
            code : 400,
            message : "Password updated failed."
        });
      }
    }

    async addJobIndustrty ({request, response}) {
      var add = new JobIndustry ({
        industry_name : this.capitalizeFirstLetter(request.input('industry_name'))
      });

      if(await add.save()) {
        response.json ({
          status : true, 
          code : 200, 
          message : "Added successfully."
        });
      }
    }

    async addJobCategory ({request, response}) {
      var secretKey = await randomstring.generate({
          length: 4,
          charset: 'alphanumeric'
      });

      var base64Str = request.input('categories_image');
      var base64Str1 = base64Str.replace(/ /g, '+');

      let base64ImageMimeType = base64Str1.split(';base64,');
      var type = base64ImageMimeType[0].split(':image/');

      var path ='public/categories_image/';

      var imageFileName = secretKey + '-' + Date.now();
      var optionalObj = {'fileName': imageFileName, 'type': type[1]};
      var uploadImage = base64_to_image(base64Str1,path,optionalObj);

      var full_image_path = request.header('Host') + '/categories_image/' + uploadImage.fileName;

      var add = new JobCategory ({
        category_type : this.capitalizeFirstLetter(request.input('category_type')),
        category_image : 'http://'+full_image_path,
        price : request.input('price'),
        description : request.input('description')
      });

      if(await add.save()) {
        response.json ({
          status : true, 
          code : 200, 
          message : "Added job categories successfully."
        });
      }
    }

    async fetchJobCategoryAndIndustry ({response}) {
      var all_jobcategory = await ServiceCategory.find({service_type : { $gt: [] }},{status: 0, created_at: 0, updated_at: 0, __v:0 }).populate('service_type.service_type_id').sort({_id : -1});

      response.json ({
        status : true,
        code : 200,
        jobCategory : all_jobcategory
      });
    }

    async addJob ({request, response, auth}) {
      var user = await auth.getUser();
      var last_job_details = await Job.find({},{ 'create_job_id' : 1, _id : 0 }).sort({_id:-1}).limit(1);

      if(user.reg_type == 2) {
        var user_id = user._id;
        var service_require_at = request.input('service_require_at');
        var job_category = request.input('job_category');
        var job_endDate = request.input('job_endDate');
        var job_amount = request.input('job_amount');
        var job_time = request.input('job_time');
        var description  = request.input('description');
        var duration = request.input('duration');
        var job_end_time = request.input('end_time');
        var job_allocated_to_vendor = 2; // 1 = allocated, 2 = not allocated
        var create_job_id = '';
        if(last_job_details.length > 0) {
          var last_job_id = (last_job_details[0].create_job_id);
          var values = last_job_id.split("-");
          var last_no = values[1];
          create_job_id = "JOB-" + ( Number(last_no) + 1);
        }else { 
          create_job_id = "JOB-" + 1;
        }

        // var final_job_amount = 0;
        // var coupon_id = request.input('coupon_id') ? request.input('coupon_id') : '';
        // if(coupon_id != '') {
        //   var coupon_details = await Coupon.findOne({_id : coupon_id});
        //   var coupon_discount_amount = coupon_details.coupons_amount;
        //   var discount_amount = parseFloat((job_amount *  coupon_discount_amount) / 100).toFixed(2) ;
        //   final_job_amount = parseFloat(job_amount - discount_amount);
        // }else {
        //   final_job_amount = job_amount;
        // }

        var user_present_address_check = request.input('check_address');

        // array for create job
        var demo = request.input('service_category_type');
        console.log(demo);
        // var demo = [
        //   {
        //     parent_service_id : '5c78dd0563f38236efdf35d5',
        //     child_service_id : '5c78df9c9ed89a3ea251adc4'
        //   },
        //   {
        //     parent_service_id : '5c78df0f9ed89a3ea251adc0',
        //     child_service_id : '5c78df409ed89a3ea251adc2'
        //   }
        // ]
        //end

        var add_job = new Job({
          create_job_id : create_job_id,
          user_id : user_id,
          // service_require_at : service_require_at,
          job_amount : job_amount,
          service_category : job_category,
          // job_date : date,
          // job_endDate : job_endDate,
          // job_time : job_time,
          // job_end_time : job_end_time,
          // description : description,
          // duration : duration,
          status : 1, // 1= active, 2 = inactive, 3 = complete
          job_allocated_to_vendor : job_allocated_to_vendor,
          ask_quote : request.input('ask_quote')
        });
        var jod_id = await add_job.save();

        if(jod_id != '') {
          var update_job = await Job.findOne({_id : jod_id._id}).populate('service_category');
          
          var dynamic_job_title = update_job.service_category.service_category;

          for(var i = 0; i < demo.length; i++){
            var fetch_parent_service_details = await ServiceType.findOne({_id : demo[i].parent_service_id});
            
            dynamic_job_title = dynamic_job_title + "-" + fetch_parent_service_details.parent_service;

            var added_services_details = {
              parent_service_id : demo[i].parent_service_id,
              child_service_id : demo[i].child_service_id,
            }

            update_job.added_services_details.unshift(added_services_details);

            await update_job.save();
          }

          if(dynamic_job_title != '') {
            dynamic_job_title = dynamic_job_title + "#"+ jod_id.create_job_id;
            
            update_job.job_title = dynamic_job_title;

            await update_job.save();

            var job_add_notification = this.add_notification(user,update_job);

            var add_data_to_audit_table = new AuditLog({
              job_id : jod_id._id,
              status : "Job created"
            })            

            await add_data_to_audit_table.save();
          }

          // if(user_present_address_check == undefined) {
          //   user.user_address2 = service_require_at
          //   await user.save();
          // }
          
          await this.fetchNearestVendor(user,update_job);

          // if(coupon_id != '') {
          //   var update = await AssignCouponToUser.findOne({user_id : user._id, coupon_id : coupon_id});
          //   update.status = "Redeemed";

          //   await update.save();
          // }

          response.json({
            status : true,
            code : 200,
            added_job_id : jod_id._id,
            message : "Job added successfully."
          });
        }
      } else { 
        response.json({
          status : false,
          code : 400,
          message : "You don't have a permission to add job."
        });
      }
    }

    async fetchNearestVendor (user, job) {
      user.reg_type = 2;
      // return false

      if(user.reg_type == 2) {

        var vendors_list = await User.find({reg_type : 3}, {_id : 1});

        var all_vendor_list = _.map(vendors_list, '_id');
        var total_assign_value = 1;
        var withOutAllocatedVendors = [];

        for(var i = 0; i < all_vendor_list.length; i++) {
          var status = await Job.find({vendor_id : all_vendor_list[i]})
          if(status.length > 0) {
          }else { 
            withOutAllocatedVendors.push(all_vendor_list[i]);
          }
        }

        console.log(withOutAllocatedVendors,'withOutAllocatedVendors');

        await _.chunk(withOutAllocatedVendors,4).map(id => {
          _.forEach(id, function(value) {
            Service.find({user_id : value, service_category : job.service_category._id})
            .then(function (matching_vendor_with_service) {

              console.log(matching_vendor_with_service,'matching_vendor_with_service');

              if(matching_vendor_with_service.length > 0) {
                 
                if (total_assign_value <= 4) {

                  _.forEach(matching_vendor_with_service, function(value) {
                    var add = new VendorAllocation ({
                      user_id : value.user_id,
                      job_id : job._id,
                      status : 0 // 0 = not allocated, 1 = allocated
                    });
                    
                    if(add.save()) {
                      total_assign_value = total_assign_value + 1;
                    }
  
                  });

                }else { 
                  return false;
                }
              }else {
                return "No vendors are found."
              }
            });
          });
        });

        return false
      }
    }

    async sendPushToAllocatedVendor ({request, response}) {
      var job_id = request.input('job_id');
      var find_all_allocated_vendors = await VendorAllocation.find({job_id : job_id, status : 0})
      .populate('user_id')
      .populate({path: 'job_id', populate: {path: 'user_id'}})
      .sort({_id : -1});

      if(find_all_allocated_vendors.length > 0){

        var auto_accept_vendors_array = [];
        var without_auto_accept_vendors_array = [];

        _.forEach(find_all_allocated_vendors, data => {
          if(data.user_id.business[0].job_auto_accept == 1){
            auto_accept_vendors_array.push(data)
          }else {
            without_auto_accept_vendors_array.push(data)
          }
        })

        if(auto_accept_vendors_array.length > 0){
          var choose_1st_vendor = auto_accept_vendors_array[0];

          choose_1st_vendor.status = 1 ; // 1 = job auto accept by vendor.
          
          if(await choose_1st_vendor.save()) {
            //admin notification
            await this.add_notification(choose_1st_vendor.user_id,'','', choose_1st_vendor);
            //end

            var update_job = await Job.findOne({_id : choose_1st_vendor.job_id._id})
            update_job.vendor_id = choose_1st_vendor.user_id._id;
            update_job.job_allocated_to_vendor = 1;

            await update_job.save();

            //push notification sent to user with vendor details
            var title = `${choose_1st_vendor.job_id.job_title}`;
            msg_body = `Your job request has accept by ${choose_1st_vendor.user_id.first_name} ${choose_1st_vendor.user_id.last_name}`;
            click_action = "Accept";
            await this.sentPushNotification(choose_1st_vendor.job_id.user_id.device_id, msg_body, choose_1st_vendor.job_id.user_id, click_action, title);
            //end

            //push notification sent to vendor with user job details
            var title = `${choose_1st_vendor.job_id.job_title}`;
            msg_body = `You have auto accept a job request from ${choose_1st_vendor.job_id.user_id.first_name} ${choose_1st_vendor.job_id.user_id.last_name}`;
            click_action = "Accept";
            await this.sentPushNotification(choose_1st_vendor.user_id.device_id, msg_body, choose_1st_vendor.user_id, click_action, title);
            //end

            response.json({
              status : true,
              code : 200,
              message : `${choose_1st_vendor.user_id.first_name} ${choose_1st_vendor.user_id.last_name} has accept your job request.`
            })
          }

        }else {
          var choose_1st_without_auto_accept_vendor = without_auto_accept_vendors_array;

          var vendor_email = choose_1st_without_auto_accept_vendor[0].user_id.email;

          // await update_job.save();
          choose_1st_without_auto_accept_vendor[0].status = 3 ; // 3 = invitation sent.
          await choose_1st_without_auto_accept_vendor[0].save();

          console.log(choose_1st_without_auto_accept_vendor,'after invitation sent');
          
          var add_notification = this.add_notification('','','','','',choose_1st_without_auto_accept_vendor);

          //push notification sent to vendor with job request
          var title = `${choose_1st_without_auto_accept_vendor[0].job_id.job_title}`;
          msg_body = `You have one job request from ${choose_1st_without_auto_accept_vendor[0].job_id.user_id.first_name} ${choose_1st_without_auto_accept_vendor[0].job_id.user_id.last_name}`;
          click_action = "Invitation";
          await this.sentPushNotification(choose_1st_without_auto_accept_vendor[0].user_id.device_id, msg_body, choose_1st_without_auto_accept_vendor[0].user_id, click_action, title);
          //end

          var sendEmail = Mailjet.post('send');
          var emailData = {
              'FromEmail': 'sobhan.das@intersoftkk.com',
              'FromName': 'Oh! My Concierge',
              'Subject': 'Invitation for Job Request',
              'Html-part': "You are invited for a job. Please see your job requests section.",
              'Recipients': [{'Email': vendor_email}]
          };
          
          if (sendEmail.request(emailData)) {
            //push notification sent to user with vendor details
            var title = `${choose_1st_without_auto_accept_vendor[0].job_id.job_title}`;
            msg_body = `Job request is received by ${choose_1st_without_auto_accept_vendor[0].user_id.first_name} ${choose_1st_without_auto_accept_vendor[0].user_id.last_name}`;
            click_action = "Invitation";
            await this.sentPushNotification(choose_1st_without_auto_accept_vendor[0].job_id.user_id.device_id, msg_body, choose_1st_without_auto_accept_vendor[0].job_id.user_id, click_action, title);
            //end

            response.json({
              status : true,
              code : 200,
              message : "Invitation has sent to a particular vendor successfully."
            })
          }
        }

      }else {
         response.json({
           status : false,
           code : 400,
           message : "No vendors are available."
         })
      }
    }

    async jobAllocationDecline ({request, response, auth}) {
      var user = await auth.getUser();
      if(user.reg_type == 3) {
        var  allocation_id = request.input('allocation_id');
        var job_id = request.input('job_id');

        var allocation_details_update = await VendorAllocation.findOne({_id : allocation_id, job_id : job_id, status : 3})
        .populate('user_id')
        .populate({path: 'job_id', populate: {path: 'user_id'}});

        allocation_details_update.status = 2; // invitation decline by vendor

        if(await allocation_details_update.save()) {
          //push notification sent to user for decline request from vendor end.
          var title = `${allocation_details_update.job_id.job_title}`;
          msg_body = `${allocation_details_update.user_id.first_name} ${allocation_details_update.user_id.last_name} has decline your job request.`;
          click_action = "Decline";
          await this.sentPushNotification(allocation_details_update.job_id.user_id.device_id, msg_body, allocation_details_update.job_id.user_id, click_action, title);
          //end

          await this.add_notification(user,'',allocation_details_update);

          //find others available vendors
          var fetch_new_allocated_vendor = await VendorAllocation.find({job_id : job_id, status : 0})
          .populate('user_id')
          .populate({path: 'job_id', populate: {path: 'user_id'}});
          console.log(fetch_new_allocated_vendor, 'fetch_new_allocated_vendor_from_decline');

          if(fetch_new_allocated_vendor.length > 0){
            var auto_accept_vendors_array = [];
            var without_auto_accept_vendors_array = [];

            _.forEach(fetch_new_allocated_vendor, data => {
              if(data.user_id.business[0].job_auto_accept == 1){
                auto_accept_vendors_array.push(data)
              }else {
                without_auto_accept_vendors_array.push(data)
              }
            })

            if(auto_accept_vendors_array.length > 0){
              var choose_1st_vendor = auto_accept_vendors_array[0];
    
              choose_1st_vendor.status = 1 ; // 1 = job auto accept by vendor.
              
              if(await choose_1st_vendor.save()) {
                //admin notification
                await this.add_notification(choose_1st_vendor.user_id,'','', choose_1st_vendor);
                //end
    
                var update_job = await Job.findOne({_id : choose_1st_vendor.job_id._id})
                update_job.vendor_id = choose_1st_vendor.user_id._id;
                update_job.job_allocated_to_vendor = 1;
    
                await update_job.save();
    
                //push notification sent to user with vendor details
                var title = `${choose_1st_vendor.job_id.job_title}`;
                msg_body = `Your job request has accept by ${choose_1st_vendor.user_id.first_name} ${choose_1st_vendor.user_id.last_name}`;
                click_action = "Accept";
                await this.sentPushNotification(choose_1st_vendor.job_id.user_id.device_id, msg_body, choose_1st_vendor.job_id.user_id, click_action, title);
                //end
    
                //push notification sent to vendor with user job details
                var title = `${choose_1st_vendor.job_id.job_title}`;
                msg_body = `You have auto accept a job request from ${choose_1st_vendor.job_id.user_id.first_name} ${choose_1st_vendor.job_id.user_id.last_name}`;
                click_action = "Accept";
                await this.sentPushNotification(choose_1st_vendor.user_id.device_id, msg_body, choose_1st_vendor.user_id, click_action, title);
                //end
    
                response.json({
                  status : true,
                  code : 200,
                  message : `${choose_1st_vendor.user_id.first_name} ${choose_1st_vendor.user_id.last_name} has accept your job request.`
                })
              }
    
            }else {
              var choose_1st_without_auto_accept_vendor = without_auto_accept_vendors_array;
    
              var vendor_email = choose_1st_without_auto_accept_vendor[0].user_id.email;
    
              // await update_job.save();
              choose_1st_without_auto_accept_vendor[0].status = 3 ; // 3 = invitation sent.
              await choose_1st_without_auto_accept_vendor[0].save();
    
              console.log(choose_1st_without_auto_accept_vendor,'after invitation sent');
              
              var add_notification = this.add_notification('','','','','',choose_1st_without_auto_accept_vendor);
    
              //push notification sent to vendor with job request
              var title = `${choose_1st_without_auto_accept_vendor[0].job_id.job_title}`;
              msg_body = `You have one job request from ${choose_1st_without_auto_accept_vendor[0].job_id.user_id.first_name} ${choose_1st_without_auto_accept_vendor[0].job_id.user_id.last_name}`;
              click_action = "Invitation";
              await this.sentPushNotification(choose_1st_without_auto_accept_vendor[0].user_id.device_id, msg_body, choose_1st_without_auto_accept_vendor[0].user_id, click_action, title);
              //end
    
              var sendEmail = Mailjet.post('send');
              var emailData = {
                  'FromEmail': 'sobhan.das@intersoftkk.com',
                  'FromName': 'Oh! My Concierge',
                  'Subject': 'Invitation for Job Request',
                  'Html-part': "You are invited for a job. Please see your job requests section.",
                  'Recipients': [{'Email': vendor_email}]
              };
              
              if (sendEmail.request(emailData)) {
                //push notification sent to user with vendor details
                var title = `${choose_1st_without_auto_accept_vendor[0].job_id.job_title}`;
                msg_body = `Job request is received by ${choose_1st_without_auto_accept_vendor[0].user_id.first_name} ${choose_1st_without_auto_accept_vendor[0].user_id.last_name}`;
                click_action = "Invitation";
                await this.sentPushNotification(choose_1st_without_auto_accept_vendor[0].job_id.user_id.device_id, msg_body, choose_1st_without_auto_accept_vendor[0].job_id.user_id, click_action, title);
                //end
    
                response.json({
                  status : true,
                  code : 200,
                  message : "Invitation has sent to a particular vendor successfully."
                })
              }
            }

          }
          //end
          
          response.json({
            status : true,
            code : 200,
            message : "You have successfully decline the job allocation request."
          });
        }
      }else {
        response.json({
          state : false,
          code : 400,
          message : "You don't have a permission to do that."
        })
      }

    }

    async jobAllocationAccept ({request, response, auth}) {
      var user = await auth.getUser();
      if(user.reg_type == 3) {
        var  allocation_id = request.input('allocation_id');
        var job_id = request.input('job_id');

        var fetch_allocated_details = await VendorAllocation.findOne({job_id : job_id, status : 3, _id : allocation_id}).populate('user_id').populate({path: 'job_id', populate: {path: 'user_id'}});
        
        console.log(fetch_allocated_details, 'fetch_allocated_details');

        fetch_allocated_details.status = 1 ; // 1 = invitation accept by vendor.
        
        if(await fetch_allocated_details.save()) {
          await this.add_notification(user,'','', fetch_allocated_details);

          var update_job = await Job.findOne({_id : fetch_allocated_details.job_id._id})
          update_job.vendor_id = fetch_allocated_details.user_id._id;
          update_job.job_allocated_to_vendor = 1;

          await update_job.save();

          //push notification sent to user with vendor details
          var title = `${fetch_allocated_details.job_id.job_title}`;
          msg_body = `${fetch_allocated_details.user_id.first_name} ${fetch_allocated_details.user_id.last_name} has accept your job request.`;
          click_action = "Accept";
          await this.sentPushNotification(fetch_allocated_details.job_id.user_id.device_id, msg_body, fetch_allocated_details.job_id.user_id, click_action, title);
          //end

          response.json({
            status : true,
            code : 200,
            message : "You have successfully accept this job request."
          })
        }

      }else {
        response.json({
          status : false,
          code : 400,
          message : "You don't have a permission to do that."
        })
      }
    }

    async vendorsAllJobRequest ({response, auth}) {
      var user = await auth.getUser();

      var job_request_list = await VendorAllocation.find({user_id : user._id, status :3}).populate({path: 'job_id', populate: {path: 'service_category'}})
      .populate({path: 'job_id', populate: {path: 'added_services_details.parent_service_id'}})
      .sort({_id : -1});

      if(job_request_list.length > 0) {
        response.json({
          status : true,
          code : 200,
          data : job_request_list
        })
      }else {
        response.json({
          status : false,
          code : 400,
          message : "No record found."
        })
      }
    }

    async vendorAllAcceptAndDeclineJobs ({response, auth}) {
      var user = await auth.getUser();

      //multiple populate from sub-document
      var job_request_list_of_accept_decline = await VendorAllocation.find({user_id : user._id, status :{
        $in : [1,2]
      }})
      .sort({_id : -1})
      .populate({path: 'job_id', populate: {path: 'added_services_details.parent_service_id'}})
      .populate({path: 'job_id', populate: {path: 'service_category'}})

      if(job_request_list_of_accept_decline.length > 0) {
        response.json({
          status : true,
          code : 200,
          data : job_request_list_of_accept_decline
        })
      }else {
        response.json({
          status : false,
          code : 400,
          message : "No record found."
        })
      }
    }

    async jobList ({request, response, auth}) {
      var user = await auth.getUser();
      var all_jobs_list = await Job.find({user_id: user._id}).sort({ _id : -1 })
      .populate('service_category')
      .populate('added_services_details.parent_service_id')
      .populate('vendor_id');

      if(all_jobs_list.length > 0) {
        response.json({
          status : true,
          code: 200,
          data: all_jobs_list 
        });
      }else { 
        response.json({
          status : false,
          code: 400,
          message: "No job found." 
        });
      }
      
    }

    async jobDetails ({request, response, auth}) {
      var user = await auth.getUser()
      var job_id = request.input('job_id');

      var job_details = await Job.find({_id : job_id, user_id : user._id})
      .populate('service_category')
      .populate('added_services_details.parent_service_id')
      .populate('vendor_id');

      if(job_details.length > 0) {
        response.json({
          status : true,
          code : 200,
          data : job_details
        });
      }else { 
        response.json({
          status : false,
          code : 400,
          message : "No job found."
        });
      }
    }

    async editJob ({request, response, auth}) {
      var user = await auth.getUser();
      var job_id = request.input('job_id');
      var job_update = await Job.findById({_id : job_id});

      if(job_update) {
        
        var job_title = request.input('job_title') ? request.input('job_title') : job_update.job_title;
        var service_require_at = request.input('service_require_at') ? request.input('service_require_at') : job_update.service_require_at;
        var job_industry = request.input('job_industry') ? request.input('job_industry') : job_update.job_industry;
        var job_category = request.input('job_category') ? request.input('job_category') : job_update.job_category;
        
        // var job_date = request.input('job_date') ? request.input('job_date') : job_update.job_date;

        if(request.input('job_date')) {
          var job_date = request.input('job_date');
          // dd/mm/yyyy
          var date_arr = job_date.split('/');
          var y = date_arr[2];
          var m = date_arr[1];
          var d = date_arr[0];
          var date = y+'-'+m+'-'+d; 
        }else {
          var date = job_update.job_date;
        }


        var job_time = request.input('job_time') ? request.input('job_time') : job_update.job_time;
        var description = request.input('description') ? request.input('description') : job_update.description;
        var job_endDate = request.input('job_endDate') ? request.input('job_endDate') : job_update.job_endDate;
        var duration = request.input('duration') ? request.input('duration') : job_update.duration;
        var job_end_time = request.input('end_time') ? request.input('end_time') : job_update.job_end_time;
        var job_amount = request.input('job_amount') ? request.input('job_amount') : job_update.job_amount;
        var check_address = request.input('check_address');

        job_update.job_title = job_title;
        job_update.service_require_at = service_require_at;
        job_update.job_industry = job_industry;
        job_update.job_category = job_category;
        job_update.job_date = date;
        job_update.job_time = job_time;
        job_update.description = description;
        job_update.job_endDate = job_endDate;
        job_update. duration = duration;
        job_update.job_end_time = job_end_time;
        job_update.job_amount = job_amount;

        if(await job_update.save()) {
          var updated_job_details = await Job.findById({_id : job_id, user_id : user._id});

          if (check_address == undefined) {
            user.user_address2 = service_require_at
            await user.save();
          }

          response.json({
            status : true,
            code : 200,
            message : "Job edit successfully.",
            data : updated_job_details
          });
        }
      }else { 
        response.json({
          status : false,
          code : 400,
          message : "No job found."
        });
      }
    }

    async addLocations ({request, response}) {
      var location_name = request.input('location_name');
      var add = new Location({
        name : location_name
      });

      if(await add.save()) {
        response.json({
          status : true,
          code : 200,
          message : "Location added successfully."
        })
      }
    }

    async fetchLocations ({response}) {
      var all_locations = await Location.find({status : 1}, {status : 0, __v : 0, created_at : 0});

      response.json({
        status : true,
        code : 200,
        data : all_locations
      });
    }

    async shoeDonationListings ({response, auth}) {
      var user = await auth.getUser()

      var all_list = await Shoe.find({ user_id : user._id, status : 1});

      if(all_list.length > 0) {
        response.json ({
          status : true,
          code : 200,
          data : all_list
        });
      } else{ 
        response.json ({
          status : false,
          code : 400,
          message : "No list found as off now."
        });
      }
    }

    async addServiceType ({request, response}) {
      var service_type_name = request.input('name');
      var add = new ServiceType ({
        service_type : service_type_name,
        status : 1
      });

      if(await add.save()) {
        response.json ({
          status : true, 
          code : 200,
          message : "Service added successfully."
        });
      }
    }

    async addServiceCategory ({request, response}) {
      var service_category = request.input('name');
      var add = new ServiceCategory ({
        service_category : service_category,
        status : 1
      });

      if(await add.save()) {
        response.json ({
          status : true, 
          code : 200,
          message : "Service added successfully."
        });
      }
    }

    async fetchServiceTypeAndCategories ({response}) {
      var all_servicecategory = await ServiceCategory.find({},{status: 0, created_at: 0, updated_at: 0, __v:0 }).populate('service_type.service_type_id');;

      response.json ({
        status : true,
        code : 200,
        all_servicecategory : all_servicecategory,
      });
    }

    async serviceAdd ({request, response, auth}) {
      try {
        var user = await auth.getUser();
        if(user.reg_type == 3) {
          var last_service_details = await Service.find({},{ 'create_service_id' : 1, _id : 0 }).sort({_id:-1}).limit(1);

          var create_service_id = '';

          if(last_service_details.length > 0) {
            var last_job_id = (last_service_details[0].create_service_id);
            var values = last_job_id.split("-");
            var last_no = values[1];

            create_service_id = "Service-" + ( Number(last_no) + 1);
          }else { 
            create_service_id = "Service-" + 1;
          }

          var already_post_or_not = await Service.find({user_id : user._id, service_category : request.input('service_category')});

          if(already_post_or_not.length > 0) {
            response.json({
              status : false,
              code : 400,
              message : "You have already post a service with this category."
            })
          }else {
            var demo = request.input('service_type');
            // var demo = ['5c78df0f9ed89a3ea251adc0', '5c78dd1763f38236efdf35d6']

            var add_service = new Service ({
              create_service_id : create_service_id,
              user_id : user._id,
              service_category : request.input('service_category'),
            });
            var service = await add_service.save();
            if(service) {
              var fetch_service_details = await Service.findOne({_id : service._id}).populate('service_category').populate('user_id');

              var dynamic_service_title = fetch_service_details.service_category.service_category+"#"+fetch_service_details.create_service_id;

              for(var i = 0; i < demo.length; i ++) {
                var update_service_details = await Service.findOne({_id : service._id});
                
                var info = {
                  parent_service_id : demo[i]
                }

                update_service_details.added_services_details.unshift(info);
                await update_service_details.save();
              }
            }

            if(dynamic_service_title != ''){
              fetch_service_details.service_title = dynamic_service_title;
              await fetch_service_details.save();

              var add_notification = this.add_notification('','','','',fetch_service_details);

              response.json ({
                  status : true,
                  code : 200,
                  message : "Service added successfully."
              });
            }
          }
          
        }else { 
          response.json ({
            status : true,
            code : 200,
            message : "You don't have a permission to add service."
          });
        }
        
      } catch (error) {
        response.json ({
          status : false,
          code : 400,
          message : "Something went wrong."
        });
      }
    }

    async serviceList ({response, auth}) {
      var user = await auth.getUser();
      if(user.reg_type == 3) {
        var all_services = await Service.find({'user_id' : user._id})
        .populate('service_category')
        .populate('added_services_details.parent_service_id')
        .sort({_id : -1});

        if(all_services.length > 0) {
          response.json({
            status : true,
            code : 200,
            data : all_services
          });
        }else { 
          response.json({
            status : false,
            code : 400,
            message : "No service found."
          });
        }
      } else { 
        response.json({
          status : false,
          code : 400,
          message : "You don't have a permission to see services list."
        });
      }
    }

    async serviceDetails ({request, response, auth}) {
      var user = await auth.getUser();
      if(user.reg_type == 3) {
        var service_id = request.input('service_id');

        var service_details = await Service.findOne({_id : service_id, user_id : user._id})
        .populate('service_type')
        .populate('service_category');

        if(service_details) {
          response.json ({
            status : true,
            code : 200,
            data : service_details
          });
        } else { 
          response.json ({
            status : false,
            code : 400,
            message : "No details found."
          });
        }
      }else { 
        response.json ({
          status : false,
          code : 400,
          message : "You don't have a permission to see service details."
        });
      }
    }

    async editService ({ request, response, auth}) {
      var user = await auth.getUser();

      if(user.reg_type == 3) {
        var service_id = request.input('service_id'); 
        var service_details = await Service.findOne({_id : service_id, user_id : user._id})

        if(service_details) {
          service_details.service_title = request.input('service_title') ? request.input('service_title') : service_details.service_title;
          
          service_details.service_type = request.input('service_type') ? request.input('service_type') : service_details.service_type;
          
          service_details.service_category = request.input('service_category') ? request.input('service_category') : service_details.service_category;

          service_details.rate = request.input('rate') ? request.input('rate') : service_details.rate;

          // service_details.start_date = request.input('start_date') ? request.input('start_date') : service_details.start_date;
          // if(request.input('start_date')) {
          //   var start_date = request.input('start_date');
          //   // dd/mm/yyyy
          //   var date_arr = start_date.split('/');
          //   var y = date_arr[2];
          //   var m = date_arr[1];
          //   var d = date_arr[0];
          //   var date = y+'-'+m+'-'+d; 

          //   service_details.start_date = date;
          // }else {
          //   service_details.start_date = service_details.start_date;
          // }


          // service_details.end_date = request.input('end_date') ? request.input('end_date') : service_details.end_date;
          // if(request.input('end_date')) {
          //   //end date
          //   var end_date = request.input('end_date');
          //   // console.log(end_date,'end_date');
          //   var date_arr_end_date = end_date.split('/');
          //   var y = date_arr_end_date[2];
          //   var m = date_arr_end_date[1];
          //   var d = date_arr_end_date[0];
          //   var end_date_modified = y+'-'+m+'-'+d;

          //   service_details.end_date = end_date_modified;
          // }else {
          //   service_details.end_date = service_details.end_date;
          // }



          service_details.description = request.input('description') ? request.input('description') : service_details.description;

          service_details.status = request.input('status') ? request.input('status') : service_details.status;

          if(await service_details.save()) {
            var updated_service_details = await Service.findOne({_id : service_id, user_id : user._id})
            .populate('service_type')
            .populate('service_category');

            response.json({
              status : true,
              code : 200,
              message : "Service edit successful.",
              data : updated_service_details
            });
          }
        } else { 
          response.json ({
            status : false,
            code : 400,
            message : "No service found."
          });
        }

      } else { 
        response.json ({
          status : false,
          code : 400,
          message : "You don't have a permission to edit service."
        });
      }
    }

    async authRefresh ({request, response, auth}) {
      // validate the user credentials and generate a JWT token
      var email = request.input('email');
      const user = await User.findOne({email : email});
      var generate_token = await auth.authenticator('jwt').generate(user);

      return response.json({
          status : true, 
          code: 200, 
          token: 'Bearer ' + generate_token.token
      });
    }

    async changeAddress({request, response, auth}) {
      var user = await auth.getUser();
      var user_new_address = request.input('new_address');

      user.user_address2 = user_new_address;

      if(await user.save()) {
        var user_job = Job.find({_id: request.input('job_id'), user_id : user._id});
        user_job.service_require_at = user_new_address; 
        if(await user_job.save()){
          response.json({
            status : true,
            code : 200,
            message : "Address changed successfully."
          });
        }
      }
    }

    async rateByUserToVendor ({request, response, auth}) {
      var user = await auth.getUser();
      var vendor_id = request.input('vendor_id');
      var rating_number = request.input('rating_number');
      var comment = request.input('comment');
      var job_id = request.input('job_id');

      var fetch_rating_details = await Rating.findOne({vendor_id: vendor_id});

      if(fetch_rating_details) {
          const rating_details_if_exist = _.filter(fetch_rating_details.rating_by_user, rate => rate.user_id == user.id);

          if(rating_details_if_exist.length > 0) {
            response.json({
              status : false,
              code : 400,
              message : "Your review has been complete."
            });
          }else{
            var all_rating = {
              user_id : user._id,
              number_of_rating : rating_number,
              comment : comment,
              job_id : job_id
            };
            fetch_rating_details.rating_by_user.unshift(all_rating);
            var rating_details = await fetch_rating_details.save();

            if(rating_details) {
              var user_job = await Job.find({_id : job_id});
              user_job.review = 1;
              user_job.rating_details = rating._id;
              await user_job.save();

              response.json({
                status : true,
                code : 200,
                message : "Rating addeed successfully."
              });
            }
          }
      }else{
        var all_rating = {
          user_id : user._id,
          number_of_rating : rating_number,
          comment : comment,
          job_id : job_id
        };

        var add = new Rating ({
          vendor_id : vendor_id,
          rating_by_user : all_rating
        });

        var add_rating = await add.save();

        if(add_rating){
          var user_job = await Job.findOne({_id : job_id});
          user_job.review = 1;
          user_job.rating_details = rating_number;
          await user_job.save();

          response.json({
            status : true,
            code : 200,
            message : "Rating addeed successfully."
          });
        }else{
          response.json({
            status : false,
            code : 400,
            message : "Rating addeed failed."
          });
        }
      }
    }

    async fetchVendorRatingDetails ({request, response, auth}) {
      var user = await auth.getUser();
      if(user.reg_type == 3) {
        var fetchRating = await Rating.findOne({vendor_id : user._id})
        if(fetchRating) {
          var total_user_rating = fetchRating.rating_by_user.length;

          var total_rating_one = (_.filter(fetchRating.rating_by_user, rate => rate.number_of_rating == 1)).length;
          var total_rating_two = (_.filter(fetchRating.rating_by_user, rate => rate.number_of_rating == 2)).length;
          var total_rating_three = (_.filter(fetchRating.rating_by_user, rate => rate.number_of_rating == 3)).length;
          var total_rating_four = (_.filter(fetchRating.rating_by_user, rate => rate.number_of_rating == 4)).length;
          var total_rating_five = (_.filter(fetchRating.rating_by_user, rate => rate.number_of_rating == 5)).length;

          // from 1 to 5 stars
          let rating = [total_rating_one, total_rating_two, total_rating_three, total_rating_four, total_rating_five];
          var rate_rating = rate(rating); // --> 0.84

          // calculate average
          var avg_rating = average(rating); // --> 4.4
          
          var new_array = [];
          new_array.push ({
            total_user_rating : total_user_rating,
            avg_rating : avg_rating,
            one_star : total_rating_one,
            two_star : total_rating_two,
            three_star : total_rating_three,
            four_star : total_rating_four,
            five_star : total_rating_five
          });

          response.json ({
            status : true,
            code : 200,
            data : new_array
          });
        }else { 
          response.json ({
            status : false,
            code : 400,
            data : "No rating details found."
          });
        }
        
      }else { 
        response.json ({
          status : false,
          code : 400,
          message : "You don't have a permission to see vendor rating details."
        })
      }
    }

    async vendorProfileFromUser ({request, response, auth}) {
      var user = await auth.getUser();

      var vendor_id = request.input('vendor_id');

      var vendor_details = await User.find({'_id' : vendor_id, 'reg_type' : 3},{
        first_name : 1,
        middle_name : 1,
        last_name : 1,
        profile_image : 1,
        email : 1,
        phone_number : 1,
        business : 1
      });

      var all_servicecategory = await ServiceType.find({_id : vendor_details[0].business[0].services},{status: 0, created_at: 0, updated_at: 0, __v:0 });

      var all_servicetype = await ServiceCategory.find({_id : vendor_details[0].business[0].service_type},{status: 0, created_at: 0, updated_at: 0, __v:0 });

      response.json({
        status : true,
        code : 200,
        data : vendor_details,
        service_type : all_servicetype,
        services : all_servicecategory
      });
    }

    async fetchAllLatestDetails ({request, response, auth}) {
      var user = await auth.getUser();
      if(user.reg_type == 2) {
        var jobs = await Job.find({'user_id' : user._id}).sort({created_at : -1, _id : -1}).limit(5)
        .populate('job_industry')
        .populate('job_category')
        .populate('user_id');

        if(jobs.length > 0) {
          var latest_fiveJobs = jobs;
        }else { 
          var latest_fiveJobs = "No latest jobs found."
        }

        var transactions = await StripeTransaction.find({'user_id' : user._id}).sort({created_at : -1, _id : -1}).limit(5);

        if(transactions.length > 0) {
          var latest_fiveTransactions = transactions;
        }else {
          var latest_fiveTransactions = "No latest transactions found."
        }

        response.json({
          status : true,
          code : 200,
          latest_fiveJobs : latest_fiveJobs,
          latest_fiveTransactions : latest_fiveTransactions
        });
      }else {
        var services = await Service.find({'user_id' : user._id}).sort({created_at : -1, _id : -1}).limit(5);

        if(services.length > 0) {
          var latest_fiveServices = services;
        }else { 
          var latest_fiveServices = "No latest services found."
        }

        var complete_job = await Job.find({'vendor_id' : user._id, status : 3}).sort({created_at : -1, _id : -1}).limit(5)
        .populate('job_industry')
        .populate('job_category')
        .populate('user_id');
        
        if(complete_job.length > 0) {
          var latest_fiveCompleteJObs = complete_job;
        }else {
          var latest_fiveCompleteJObs = "No complete jobs found."
        }

        response.json({
          status : true,
          code : 200,
          latest_fiveServices : latest_fiveServices,
          latest_fiveCompleteJObs : latest_fiveCompleteJObs
        });
      }
    }

    async vendorTransactionList ({response, auth}) {
      var user = await auth.getUser();

      var transaction_list = await StripeTransaction.find({user_id : user._id, type : 'OMC_pay_to_Vendor'});

      if (transaction_list.length > 0) {
        response.json({
          status : true,
          code : 200,
          data : transaction_list
        });
      } else {
        response.json({
          status : false,
          code : 400,
          message : "No transaction details found."
        });
      }
    }

    async vendorJobHistory ({response, auth}) {
      var user = await auth.getUser() ;

      var jobs_history = await Job.find({'vendor_id' : user._id, status : 3}).sort({ _id : -1}).populate('user_id')
      .populate('job_industry')
      .populate('job_category');

      if(jobs_history.length >0) {
        response.json({
          status : true,
          code : 200,
          data : jobs_history
        });
      } else { 
        response.json({
          status : false,
          code : 400,
          message : "No jobs history found."
        });
      }
    }
    
    async updateJobCategories ({response, request }){
      // var secretKey = await randomstring.generate({
      //     length: 4,
      //     charset: 'alphanumeric'
      // });

      // var base64Str = request.input('categories_image');
      // var base64Str1 = base64Str.replace(/ /g, '+');

      // let base64ImageMimeType = base64Str1.split(';base64,');
      // var type = base64ImageMimeType[0].split(':image/');

      // var path ='public/categories_image/';

      // var imageFileName = secretKey + '-' + Date.now();
      // var optionalObj = {'fileName': imageFileName, 'type': type[1]};
      // var uploadImage = base64_to_image(base64Str1,path,optionalObj);

      // var full_image_path = request.header('Host') + '/categories_image/' + uploadImage.fileName;

      var update = await JobCategory.updateOne({_id : request.input('id')}, {
        $set : {
          // category_type : this.capitalizeFirstLetter(request.input('category_type')),
          // price : request.input('price'),
          // category_image : 'http://'+full_image_path
          description : request.input('description')
        }
      })

      if(update){
        response.json({
          message : "Update successfully."
        })
      }
    }

    async addCoupons ({request, response}) {
      var coupons_title = request.input('coupons_title');
      var coupons_amount = request.input('coupons_amount');
      var coupons_valid_from = request.input('start_date');
      var coupons_valid_to = request.input('end_date');
      var coupons_code = request.input('coupons_code').toUpperCase();
      var coupon_type = request.input('coupon_type');

      var add = new Coupon({
        coupons_title : coupons_title,
        coupons_amount : coupons_amount,
        coupons_valid_from : coupons_valid_from,
        coupons_valid_to : coupons_valid_to,
        coupons_code : coupons_code,
        coupon_type : coupon_type
      });
      
      await add.save();

      response.json({
        status : true,
        code : 200,
        message : "Coupon added successfully."
      });
    }

    async assignCouponsToUser ({request, response}) {
      var user = request.input('user_id');
      var coupon_id = request.input('coupon_id');

      var isCheck = await AssignCouponToUser.find({coupon_id : coupon_id, user_id : user});

      if(isCheck.length > 0) {
        response.json({
          status : false,
          code : 400,
          message : "Coupon already assign to this user."
        });
      }else {
        var user_details = await User.findOne({_id : user});

        var assign = new AssignCouponToUser({
          user_id : user,
          coupon_id : coupon_id
        })

        if(await assign.save()) {
          var coupon_details = await Coupon.findOne({_id : coupon_id})
          var sendEmail = Mailjet.post('send');
          var emailData = {
              'FromEmail': 'sobhan.das@intersoftkk.com',
              'FromName': 'Oh! My Concierge',
              'Subject': 'Promocode',
              'Html-part': "You are allocated.",
              'Recipients': [{'Email': user_details.email}]
          };
          await sendEmail.request(emailData);

          response.json({
            status : true,
            code : 200,
            message : "Coupon successfully assigned to the user."
          });
        }
      }
    }

    async userActiveCoupons ({request, response, auth}) {
      var user = await auth.getUser();

      if(user.reg_type == 2) {
        var coupons_list = await AssignCouponToUser.find({user_id : user._id,
          status: { 
            $nin: [ "Expire", "Redeemed" ]
          } 
        }).populate('coupon_id').sort({_id : -1});

        var newCouponsListArray = [];
        
        if (coupons_list.length > 0) {
          _.forEach(coupons_list, function(value) {
            var valid_to1 = value.coupon_id.coupons_valid_to;

            var date_diff = moment().diff(valid_to1, 'days');

            if(date_diff <= 0) {
              newCouponsListArray.push(value)
            }else {
              AssignCouponToUser.updateOne({_id : value._id},{
                $set :{
                  status : "Expire"
                }
              }).then(function(error, result){
                if(error){
                  throw error;
                }else {
                  console.log(result,'result');
                }
              });
            }
          });
          
          response.json ({
            status : true,
            code : 200,
            data : newCouponsListArray
          });
        }else {
          response.json({
            status : false,
            code : 400,
            message : "You don't have any active coupons."
          });
        }
      }else {
        response.json({
          status : false,
          code : 400,
          message : "You don't have a permission to use this features."
        });
      }
      
    }
    
    //check date format and age 
    checkDate ({request,response}) {
      var date_str = request.input('date'); 
      // dd/mm/yyyy
      var date_arr = date_str.split('/');
      var y = date_arr[2];
      var m = date_arr[1];
      var d = date_arr[0];
      var date = y+'-'+m+'-'+d;

      var dob_check = request.input('dob_check');
      if (dob_check == 1) {
        var checking = moment(date, "YYYY-MM-DD").isValid();
        if(checking == true) {
          // var future_date_isValid = moment().isBefore(date);
          var years = moment().diff(date, 'years');
          if(years >= 18 && years <= 70) {
            response.json({
              status : true,
              code : 200,
              message : "Date is correct and user is above 18 years old."
            });
          }else { 
            response.json({
              status : false,
              code : 400,
              message : "Sorry, you are not eligible to register. Age should be above 18 years and not more than 70 years."
            })
          } 
        }else {
          response.json({
            status : false,
            code : 400,
            message : "Date is empty or not valid."
          })
        }
      }else {
        var checking = moment(date, "YYYY-MM-DD").isValid();
        if(checking == true) {
          var future_date_isValid = moment().isBefore(date);
          if(future_date_isValid == true){
            response.json({
              status : true,
              code : 200,
              message : "Date is correct."
            });
          }else {
            response.json({
              status : false,
              code : 400,
              message : "Past date can't be accepted. Only future date allow from today."
            });
          }
          
        }else {
          response.json({
            status : false,
            code : 400,
            message : "Date is empty or not valid."
          })
        }
      }
    }

    //stripe functions
    async stripeTopUpCredit ({request, response, auth}) {
      try {
        var user = await auth.getUser();
        if(request.input("topup_amount") < 40) {
          response.json({
            status : false,
            code : 400,
            message : "Credit amount should be greater than $40 ."
          });
        } else { 
          var customer_details = await stripe.customers.retrieve(request.input("stripe_customer_id"));
          var existing_account_balance = Number(customer_details.account_balance);
          var new_balance = 0;

          if(existing_account_balance > 0) {
            new_balance = existing_account_balance + Number(request.input("topup_amount") * 100);
          }else { 
            new_balance = Number(request.input("topup_amount") * 100);
          }

          var update_customer = await stripe.customers.update(request.input("stripe_customer_id"), {
            account_balance: new_balance 
          });

          if(update_customer) {
            user.stripe_details = {
              account_balance : new_balance
            }

            await user.save();

            response.json ({
              status : true,
              code : 200,
              message : "Top up added successfully."
            });
          } else { 
            response.json ({
              status : false,
              code : 400,
              message : "Top up added failed."
            });
          }
        }
        
      }catch (error) {
        throw error;
      }
    }

    async stripeView ({request,view, response}) {
      return view.render('stripe_view')
    }

    //job amount payment and create new omc user to stripe
    async stripePaymentOfUser ({request, response, auth}) {
      const token = request.body.stripeToken;
      var user = await auth.getUser();

      const save_card = request.input('save_card'); // 1 = 'save card on stripe', 0 ='delete save card from stripe'

      if (user.stripe_details == '') {
        var customer_id = '';
      }else{ 
        var customer_id = user.stripe_details[0].customer_id;
      }
      
      if(customer_id != '') {
        //stripe add card
        var addCard = await stripe.customers.createSource(customer_id,{
          source: token
        });

        if (addCard) {
          //stripe update customer default card
          var save = await stripe.customers.update(customer_id, {
            default_source : addCard.id
          });
          if(save) {
            //stripe create charge
            const charge = await stripe.charges.create({
              amount: request.input('job_amount') * 100,
              currency: 'sgd',
              description: request.input('description'),
              customer : customer_id
            });
    
            if(charge) {
              var add_charges_details = new StripeTransaction ({
                user_id : user._id,
                transaction_id : charge.id,
                type : 'User_pay_to_OMC'
              });
              if(await add_charges_details.save()) {
                var user_job = await Job.findOne({_id : request.input('job_id')});
                user_job.job_amount = request.input('job_amount');
                user_job.status = 1;
                user_job.transaction_id = charge.id;
                
                var save_job = await user_job.save();

                if(save_job) {
                  if(save_card == 0) {
                    //stripe delete default card
                    var delete_card = await stripe.customers.deleteCard(customer_id,addCard.id);
                  }

                  var add_notification = this.add_notification(user,'','','','','',user_job);

                  var send_payment_invoice = this.paymentInvoiceEmail(user, charge, save_job);
                  if(send_payment_invoice == true) {
                    response.json({
                      status : true,
                      code : 200,
                      message : "Payment successfully."
                    });
                  }
                }
              }
            }else { 
              response.json({
                status : false,
                code : 400,
                message : "Payment declined."
              });
            }
          }
        }
      }else { 
        // Create a Customer:
        const customer = await stripe.customers.create({
          source: token,
          email: user.email,
          description : "OMC User"
        });

        if(customer) {
          var user = await User.findOne({email : user.email});

          user.stripe_details = {
            customer_id : customer.id,
            account_balance : customer.account_balance,
            invoice_prefix : customer.invoice_prefix,
            customer_created : customer.created
          }

          if(await user.save()) {
            var user = await User.findOne({email : user.email});
            var customer_id = user.stripe_details[0].customer_id;

            const charge = await stripe.charges.create({
              amount: request.input('job_amount') * 100,
              currency: 'sgd',
              description: request.input('description'),
              customer : customer_id
            });
    
            if(charge) {
              var add_charges_details = new StripeTransaction ({
                user_id : user._id,
                transaction_id : charge.id,
                type : 'User_pay_to_OMC'
              });
              if(await add_charges_details.save()) {
                var user_job = await Job.findOne({_id : request.input('job_id')});
                // user_job.job_amount = request.input('job_amount');
                user_job.status = 1;
                user_job.transaction_id = charge.id;

                var save_job = await user_job.save();

                if(save_job) {
                  if(save_card == 0) {
                    //stripe delete default card
                    var delete_card = await stripe.customers.deleteCard(customer_id,charge.source.id);
                  }
                  
                  var add_notification = this.add_notification(user,'','','','','',user_job);

                  var send_payment_invoice = this.paymentInvoiceEmail(user, charge, save_job);
                  if(send_payment_invoice == true) {
                    response.json({
                      status : true,
                      code : 200,
                      message : "Payment successfully."
                    });
                  }
                }
              }
            }else { 
              response.json({
                status : false,
                code : 400,
                message : "Payment declined."
              });
            }
          }
        }
      }
    }

    //add card
    // async stripeAddCard ({request, response, auth}) {
    //   const token = request.body.stripeToken;
    //   var user = await auth.getUser();
    //   var customer_id = user.stripe_details[0].customer_id;
      
    //   var addCard = await stripe.customers.createSource(customer_id,{
    //     source: token 
    //   });
      
    //   if (addCard) {
    //     response.json({
    //       status : true,
    //       code : 200,
    //       message : "Card added successfully."
    //     });
    //   } else { 
    //     response.json({
    //       status : false,
    //       code : 400,
    //       message : "Card added failed."
    //     });
    //   }
    // }

    //fetch customer all save cards list
    async stripeFetchCustomerAllCard ({request, response, auth}) {
      var user = await auth.getUser();

      if (user.stripe_details == '') {
        response.json({
          status : false,
          code : 400,
          message : "You are not a stripe customer."
        });
      }else{ 
        var customer_id = user.stripe_details[0].customer_id;

        var list_all_cards = await stripe.customers.listCards (customer_id);

        if(list_all_cards.data.length > 0) {
          response.json({
            status : true,
            code : 200,
            data : list_all_cards.data
          });
        }else { 
          response.json({
            status : false,
            code : 400,
            message : "No cards found as off now."
          });
        }
      }
    }

    //change default card
    async stripeChangeDefaultCard ({request, response, auth}) {
      var user = await auth.getUser();
      var customer_id = user.stripe_details[0].customer_id;
      
      var set_default_card_id = request.input('stripe_card_id');

      var save = await stripe.customers.update(customer_id, {
        default_source : set_default_card_id
      });

      if(save) {
        response.json({
          status : true,
          code : 200,
          message : "Default card change successfully."
        });
      }else { 
        response.json({
          status : false,
          code : 400,
          message : "Default card change failed."
        });
      }
    }

    //open connect account through API
    async stripeConnectAccountVendor ({request, response, auth}) {
      var user = await auth.getUser();
      if(user.reg_type == 3) {
        //stripe connect account create
        var connect_user = await stripe.accounts.create({
          type: 'standard',
          country: 'SG',
          email: user.email
        });

        if(connect_user) {
          var user_update = await User.updateOne({
            _id: user._id //matching with table id
          },{
            $set: {
              stripe_details: [{
                customer_id : connect_user.id
              }]
            }
          });
          if(user_update) {
            response.json({
              status : true,
              code : 200,
              message : "Your stripe account has been successfully associated with us."
            });
          }
        }
      }else {
        response.json({
          status : false,
          code : 400,
          message : "You don't have a permission to create a bank account."
        });
      }
    }

    //check connect user bank payouts active or inactive
    async checkPayoutsMoodStatus ({request, response, auth}) {
      var user = await auth.getUser();

      if(user.reg_type == 3) {
        var connect_user_details = await stripe.accounts.retrieve(user.stripe_details[0].customer_id);
        
        if (connect_user_details.payouts_enabled == false) {
          response.json({
            status : false,
            code : 400,
            message : "Your payouts mood is disabled. Please go to your stripe account and fill up bank details."
          });
        }else { 
          response.json({
            status : true,
            code : 200,
            message : "Your bank details is associated with us."
          });
        }
      }else {
        response.json({
          status : false,
          code : 400,
          message : "You don't have a permission ."
        });
      }
    }

    //associate vendor bank account with stripe connect
    async stripeCreateConnectAccount ({request, response, auth}) {
      console.log(request);
      var user = await auth.getUser();
      
      var queryString = request.get();
      var code = queryString.code;
      var scope = queryString.scope;

      if(code) {
        try {
          axios.post('https://connect.stripe.com/oauth/token', {
            client_secret: "sk_test_1lfdJgJawDb3EFLvNDyi1p7v",
            code:code,
            grant_type:'authorization_code'
          }).then ( function (result){
            if(result.status == 200) {
              var vendor_account_id = result.data.stripe_user_id;
              
              User.updateOne({
                _id: user._id //matching with table id
              },{
                $set: {
                  stripe_details: [{
                    customer_id : vendor_account_id
                  }]
                }
              }).then(function (result) {
                if(result) {
                  response.json({
                    status : true,
                    code : 200,
                    message : "Your bank details has been successfully associated with us."
                  });
                }
              });
            }

          }).catch (function (error){
            console.log("false");
            console.log("======start=========");
            console.log(error.response.data.error_description)
            console.log("======end=========");

            var error_msg = error.response.data.error_description;
            response.json({
              status : false,
              code : 400,
              message : error_msg
            });
          });

        }catch (error) {
          throw error;
        }
      }
    }

    //fund release to vendor bank account
    async stripeFundTransferToVendor ({request, response, auth}) {
      var user = await auth.getUser();
      if(user.reg_type == 3) {
        if(user.stripe_details.length > 0) {
          var vendor_customer_account_id = user.stripe_details[0].customer_id;
  
          var transfer = await stripe.transfers.create({
            amount: request.input('release_amount') * 100,
            currency: "sgd",
            destination: vendor_customer_account_id
          });
          
          if(transfer) {
            var add = new StripeTransaction ({
              user_id : user._id,
              transaction_id : transfer.id,
              type : "OMC_pay_to_Vendor"
            });
            if(await add.save()) {
              response.json ({
                status : true,
                code : 200,
                message : "Amount release to your account has been successful. Your release amount will be credited to your associate bank account within seven business days."
              });
            }
          }
        }else { 
          response.json ({
            status : false,
            code : 400,
            message : "Your bank account has not associated with us. So, please add your bank details."
          });
        }
      }else {
        response.json ({
          status : false,
          code : 400,
          message : "You don't have a permission to do that."
        });
      }
      
    }

    //create payment with saving card
    async stripePaymentWithSavingCard ({request, response, auth}) {
      var customer_card_id = request.input('card_id');
      var user = await auth.getUser();
      var cvc = request.input('cvc');

      if(customer_card_id) {
        var charge = await stripe.charges.create({
          amount: request.input('job_amount') * 100,
          currency: "sgd",
          source: customer_card_id, // obtained with Stripe.js
          customer : user.stripe_details[0].customer_id,
          // cvc_check : cvc,
          description: request.input('description')
        });

        if(charge) {
          var add_charges_details = new StripeTransaction ({
            user_id : user._id,
            transaction_id : charge.id,
            type : 'User_pay_to_OMC'
          });
          if(await add_charges_details.save()) {
            var user_job = await Job.findOne({_id : request.input('job_id')});
            user_job.job_amount = request.input('job_amount');
            user_job.status = 1;
            user_job.transaction_id = charge.id;
            await user_job.save();

            response.json({
              status : true,
              code : 200,
              message : "Payment successfully."
            });
          }
        }else { 
          response.json({
            status : false,
            code : 400,
            message : "Payment declined."
          });
        }
      }else { 
        response.json({
          status : false,
          code : 400,
          message : "Invalid card."
        });
      }
    }
    //end

    //checking uen number validation
    validateUEN (uen) {
      var debug = true;
      const entityTypeIndicator = [
          'LP', 'LL', 'FC', 'PF', 'RF', 'MQ', 'MM', 'NB', 'CC', 'CS', 'MB', 'FM', 'GS', 'GA',
          'GB', 'DP', 'CP', 'NR', 'CM', 'CD', 'MD', 'HS', 'VH', 'CH', 'MH', 'CL', 'XL', 'CX',
          'RP', 'TU', 'TC', 'FB', 'FN', 'PA', 'PB', 'SS', 'MC', 'SM'
      ];
  
      if (debug) {
          console.log('(A) Businesses registered with ACRA');
          console.log('(B) Local companies registered with ACRA');
          console.log('(C) All other entities which will be issued new UEN');
      }
  
      // check that uen is not empty
      if (!uen || String(uen) === '') {
          if (debug) { console.log('UEN is empty'); }
          return false;
      }
  
      // check if uen is 9 or 10 digits
      if (uen.length < 9 || uen.length > 10) {
          if (debug) { console.log('UEN is not 9 or 10 digits'); }
          return false;
      }
  
      uen = uen.toUpperCase();
      var uenStrArray = uen.split('');
  
      // (A) Businesses registered with ACRA
      if (uenStrArray.length === 9) {
          // check that last character is a letter
          if (!isNaN(uenStrArray[uenStrArray.length - 1])) {
              if (debug) { console.log('(A) last character is not an alphabet'); }
              return false;
          }
  
          for (var i = 0; i < uenStrArray.length - 1; i++) {
              // check that first 8 letters are all numbers
              if (isNaN(uenStrArray[i])) {
                  if (debug) { console.log('(A) there are non-numbers in 1st to 8th letters'); }
                  return false;
              }
          }
  
          // (A) Businesses registered with ACRA (SUCCESS)
          if (debug) { console.log('valid (A) Businesses registered with ACRA'); }
          return true;
      }
      else if (uenStrArray.length === 10) {
          // check that last character is a letter
          if (!isNaN(uenStrArray[uenStrArray.length - 1])) {
              if (debug) { console.log('(B)(C) last character is not an alphabet'); }
              return false;
          }
  
          // (B) Local companies registered with ACRA
          if (!isNaN(uenStrArray[0]) && !isNaN(uenStrArray[1]) && !isNaN(uenStrArray[2]) && !isNaN(uenStrArray[3])) {
              // check that 5th to 9th letters are all numbers
              if (!isNaN(uenStrArray[4]) && !isNaN(uenStrArray[5]) && !isNaN(uenStrArray[6]) &&
                  !isNaN(uenStrArray[7]) && !isNaN(uenStrArray[8])) {
                  // (B) Local companies registered with ACRA (SUCCESS)
                  if (debug) { console.log('valid (B) Local companies registered with ACRA'); }
                  return true;
              } else {
                  if (debug) { console.log('(B) there are non-numbers in 5th to 9th letters'); }
                  return false;
              }
          }
          // (C) All other entities which will be issued new UEN
          else {
              // check that 1st letter is either T or S or R
              if (uenStrArray[0] !== 'T' && uenStrArray[0] !== 'S' && uenStrArray[0] !== 'R') {
                  if (debug) { console.log('(C) 1st letter is incorrect'); }
                  return false;
              }
  
              // check that 2nd and 3rd letters are numbers only
              if (isNaN(uenStrArray[1]) || isNaN(uenStrArray[2])) {
                  if (debug) { console.log('(C) 2nd and 3rd letter is incorrect'); }
                  return false;
              }
  
              // check that 4th letter is an alphabet
              if (!isNaN(uenStrArray[3])) {
                  if (debug) { console.log('(C) 4th letter is not an alphabet'); }
                  return false;
              }
  
              // check entity-type indicator
              var entityTypeMatch = false,
                  entityType = String(uenStrArray[3]) + String(uenStrArray[4]);
              for (var i = 0; i < entityTypeIndicator.length; i++) {
                  if (String(entityTypeIndicator[i]) === String(entityType)) {
                      entityTypeMatch = true;
                  }
              }
              if (!entityTypeMatch) {
                  if (debug) { console.log('(C) entity-type indicator is invalid'); }
                  return false;
              }
  
              // check that 6th to 9th letters are numbers only
              if (isNaN(uenStrArray[5]) || isNaN(uenStrArray[6]) || isNaN(uenStrArray[7]) || isNaN(uenStrArray[8])) {
                  if (debug) { console.log('(C) 2nd and 3rd letter is incorrect'); }
                  return false;
              }
  
              // (C) All other entities which will be issued new UEN (SUCCESS)
              if (debug) { console.log('valid (C) All other entities which will be issued new UEN'); }
              return true;
          }
      }
  
      return false;
    }
    //end

    //for getting hostname
    extractHostname(url) {
      var hostname;
      //find & remove protocol (http, ftp, etc.) and get hostname

      if (url.indexOf("//") > -1) {
          hostname = url.split('/')[2];
      }
      else {
          hostname = url.split('/')[0];
      }

      //find & remove port number
      hostname = hostname.split(':')[0];
      //find & remove "?"
      hostname = hostname.split('?')[0];

      return hostname;
    }
    //end

    //registration sent email data
    registrationEmailData(user) {

      var email_body = `<!DOCTYPE html>
      <html lang="en">
        <meta http-equiv="content-type" content="text/html;charset=UTF-8" />
        <head>
        </head>
        <body><div>

      
        <table class="width_100 currentTable" align="center" border="0" cellpadding="0" cellspacing="0"  style="border-collapse:collapse; height:650px;" data-module="Account Password 1">
            <tr>
                <td width="650" align="center" valign="middle" background="1.png" style="background-image: url('https://i.ibb.co/5YtXNsx/1.png'); background-position: center center; background-repeat: repeat; background-size: cover;" bgcolor="#f7f8f8" data-bg="Account Password 1" data-bgcolor="Account Password 1">
                    <table align="center" border="0" cellpadding="0" width="400" cellspacing="0" style="border: 1px solid #9a9292;
       
        border-radius: 18px;
        background: #dbdbdb;">
                        <tr>
                            <td width="100%" height="10" style="line-height:1px;"></td>
                        </tr>
                        <tr>
                            <td width="100%" align="center" valign="middle" style="line-height:1px;">
                                <a href="http://ohmyconcierge.s3-website-ap-northeast-1.amazonaws.com" target="_blank" style="display:inline-block;"><img src='http://18.179.118.55:5000/logo.png' alt="logo_chef_final" border="0" /></a>
                            </td>
                        </tr>
                        <tr>
                            <td width="100%" height="21" style="line-height:1px;"></td>
                        </tr>
                        <tr>
                            <td width="100%" align="center" valign="middle">
                                <table class="width_90percent" align="center" border="0" cellpadding="0" width="400" cellspacing="0" style="border-collapse: collapse; max-width:90%; -webkit-border-radius: 10px; border-radius: 10px";  data-bgcolor="Box Color">
                                    <tr>
                                        <td width="100%" align="center" valign="middle">
                                            <table class="width_90percent" align="center" border="0" cellpadding="0" width="400" cellspacing="0" style="border-collapse: collapse; max-width:90%;">
                                                <tr>
                                                    <td width="100%" height="53" style="line-height:1px;"></td>
                                                </tr>
                                               
                                                <tr>
                                                    <td width="100%" align="center" valign="middle" data-size="Main Title" data-min="20" data-max="28" data-color="Main Title" style="margin:0px; padding:0px; font-size:15px; color: #c63a39; margin-bottom: 10px; font-family: 'Open Sans', Helvetica, Arial, Verdana, sans-serif; font-weight:bold;">
                                                       <p style="color: #1c9aea; font-weight:normal">
                                                              Hi ${user.first_name}, 
                                                              You have successfully registered to our services.
                                                              <br>
                                                                  Thank You!
                                                       </p>
                                                      <!-- <strong style="font-size: 40px; display: block; color: #b3b3b3;">[ Event Name ]</strong>-->
                                                    </td>
                                                </tr>
                                             
                                                <tr>
                                                    <td class="display-block padding" width="100%" height="21" style="line-height:1px;"></td>
                                                </tr>
                                                <tr>
                                                  
                                                </tr>
    
                                                <tr>
                                                    <td class="display-block padding" width="100%" height="25" style="line-height:1px;"></td>
                                                </tr>
    
    
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td width="100%" height="39" style="line-height:1px;"></td>
                        </tr>
    
                        <tr>
                            <td width="100%" align="center" valign="middle" data-size="Footer Description" data-min="9" data-max="16" data-color="Footer Description" style="margin:0px; padding:0px; font-size:15px; color:#000000; font-family: 'Open Sans', Helvetica, Arial, Verdana, sans-serif; font-weight:bold; line-height:24px;">
                                © 2018 All right reserved OMC 
                            </td>
                        </tr>
    
                        <tr>
                            <td width="100%" height="24" style="line-height:1px;"></td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
    
    
        </body>
      </html>`;

      var sendEmail = Mailjet.post('send');
      var emailData = {
          'FromEmail': 'sobhan.das@intersoftkk.com',
          'FromName': 'Oh! My Concierge',
          'Subject': 'Registration confirmation',
          'Html-part': email_body,
          'Recipients': [{'Email': user.email}]
      };
      
      if (sendEmail.request(emailData)) {
        return true;
      }

    }
    //end

    //forgot password sent email
    fortgotPasswordSentEmail(user,link) {

      var email_body = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                  <head>
                  <body>
                  <div>

      
                  <table class="width_100 currentTable" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse; height:650px;" data-module="Account Password 1">
                      <tbody><tr>
                          <td width="650" align="center" valign="middle" background="1.png" style="background-image: url('https://i.ibb.co/5YtXNsx/1.png'); background-position: center center; background-repeat: repeat; background-size: cover;" bgcolor="#f7f8f8" data-bg="Account Password 1" data-bgcolor="Account Password 1">
                              <table align="center" border="0" cellpadding="0" width="400" cellspacing="0" style="
                 /* border: 1px solid #9a9292; */
                 padding: 8px;
                 border-radius: 18px;
                 background: #f7f7f7;
                 ">
                                  <tbody><tr>
                                      <td width="100%" height="0" style="line-height:1px;"></td>
                                  </tr>
                                  <tr>
                                      <td width="100%" align="center" valign="middle" style="line-height:1px;">
                                          <a href="#" target="_blank" style="display:inline-block;"><img src='http://18.179.118.55:5000/logo.png' alt="logo_chef_final" border="0" /></a>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td width="100%" height="21" style="line-height:1px;"></td>
                                  </tr>
                                  <tr>
                                      <td width="100%" align="center" valign="middle">
                                          <table class="width_90percent" align="center" border="0" cellpadding="0" width="400" cellspacing="0" style="border-collapse: collapse; max-width:90%; -webkit-border-radius: 10px; border-radius: 10px" ;="" data-bgcolor="Box Color">
                                              <tbody><tr>
                                                  <td width="100%" align="center" valign="middle">
                                                      <table class="width_90percent" align="center" border="0" cellpadding="0" width="400" cellspacing="0" style="border-collapse: collapse; max-width:90%;">
                                                          <tbody><tr>
                                                              <!--<td width="100%" height="23" style="line-height:1px;"></td>-->
                                                          </tr>
                                                         
                                                          <tr>
                                                              <td width="100%" data-size="Main Title" data-min="20" data-max="28" data-color="Main Title" style="margin:0px;padding:0px;font-size: 13px;color: #292929;margin-bottom: 10px;font-family: 'Open Sans', Helvetica, Arial, Verdana, sans-serif;"><h2 style="font-size: 20px;">Hi ${user.first_name},</h2>
                                                                 <p style="/* color: #1c9aea; */font-weight:normal;">You recently requested to reset your password for your OMC account. Use the button below to reset it. <strong>This password reset is only valid for the next 48 hours.</strong></p>
                                                                 <a href="${link}" target="_blank" style="padding: 6px 12px;
                  background: #f8912a;
                  border-radius: 5px;
                  color: #fff;"> Reset Your Password</a>
                  <p style="/* color:#1c9aea */">If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                  
                 
                                                                <!-- <strong style="font-size: 40px; display: block; color: #b3b3b3;">[ Event Name ]</strong>-->
                                                              </td>
                                                          </tr>
                                                       
                                                          <tr>
                                                              <td class="display-block padding" width="100%" height="11" style="line-height:1px;border-bottom: 1px solid #bdbdbd;
                  line-height: 1px;"></td>
                                                              
                                                          </tr>
                                                           <tr>
                                                            
                                                               <td class="display-block padding" width="100%" height="11" style="line-height:1px;"></td>
                                                          </tr>
                                                          <tr>
                                                           <td> <p style="font-size: 11px;color: #1c9aea;">If you’re having trouble with the button above, copy and paste the URL below into your web browser.<br>${link}
              </p></td>
                                                          </tr>
              
                                                          <tr>
                                                              <td class="display-block padding" width="100%" height="25" style="line-height:1px;"></td>
                                                          </tr>
              
              
                                                      </tbody></table>
                                                  </td>
                                              </tr>
                                          </tbody></table>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td width="100%" height="39" style="line-height:1px;"></td>
                                  </tr>
              
                                  <tr>
                                      <td width="100%" align="center" valign="middle" data-size="Footer Description" data-min="9" data-max="16" data-color="Footer Description" style="margin:0px;padding:0px;font-size: 12px;color:#000000;font-family: 'Open Sans', Helvetica, Arial, Verdana, sans-serif;font-weight:bold;line-height:24px;">
                                          © 2018 All right reserved OMC 
                                      </td>
                                  </tr>
              
                                  <tr>
                                      <td width="100%" height="0" style="line-height:1px;"></td>
                                  </tr>
                              </tbody></table>
                          </td>
                      </tr>
                  </tbody></table>
              </div>
                  </body>
                </html>`;


                var sendEmail = Mailjet.post('send');
                var emailData = {
                    'FromEmail': 'sobhan.das@intersoftkk.com',
                    'FromName': 'Oh! My Concierge',
                    'Subject': 'Forgot Password Link',
                    'Html-part': email_body,
                    'Recipients': [{'Email': user.email}]
                };

                if(sendEmail.request(emailData)) {
                  return true;       
                }
    }
    //end

    //payment invoice email
    paymentInvoiceEmail (user, charge, save_job) {
      var email_body = `<!DOCTYPE html>
      <html>
      <head>
          <title></title>
      
      <link href="//netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
      <script src="//netdna.bootstrapcdn.com/bootstrap/3.1.0/js/bootstrap.min.js"></script>
      <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
      <!------ Include the above in your HEAD tag ---------->
      
      </head>
      <body>
      
      <div class="container">
          <div class="row">
              <div class="col-xs-12">
                  <div class="invoice-title">
                      <h2>Invoice</h2><h3 class="pull-right">Transaction No # ${charge.id}</h3>
                  </div>
                  <hr>
                  <div class="row">
                      <div class="col-xs-6">
                          <address>
                          <strong>Billed To:</strong><br>
                              ${user.first_name} ${user.middle_name}  ${user.last_name} <br>
                              ${user.address}<br>
                              ${user.city}
                          </address>
                      </div>
                      <div class="col-xs-6 text-right">
                          <address>
                          <strong>Payment Method:</strong><br>
                              Card Name: ${charge.source.brand} <br>
                              Card Number: ***** ${charge.source.last4} <br>
                              Exp Date: ${charge.source.exp_month}/${charge.source.exp_year} <br>
                              Cardholder Name : ${charge.source.name}
                          </address>
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-xs-6 text-right">
                          <address>
                              <strong>Payment Status:</strong><br>
                              Paid<br><br>
                          </address>
                      </div>
                  </div>
              </div>
          </div>
          
          <div class="row">
              <div class="col-md-12">
                  <div class="panel panel-default">
                      <div class="panel-heading">
                          <h3 class="panel-title"><strong>Payment summary</strong></h3>
                      </div>
                      <div class="panel-body">
                          <div class="table-responsive">
                              <table class="table table-condensed">
                                  <thead>
                                      <tr>
                                          <td class="text-center"><strong>Job ID</strong></td>
                                          <td class="text-center"><strong>Amount</strong></td>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr>
                                          <td class="text-center">${save_job._id}</td>
                                          <td class="text-center">${save_job.job_amount}</td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      <style type="text/css">
          .invoice-title h2, .invoice-title h3 {
          display: inline-block;
      }
      
      .table > tbody > tr > .no-line {
          border-top: none;
      }
      
      .table > thead > tr > .no-line {
          border-bottom: none;
      }
      
      .table > tbody > tr > .thick-line {
          border-top: 2px solid;
      }
      </style>
      </body>
      </html>
      `;

      var sendEmail = Mailjet.post('send');
      var emailData = {
          'FromEmail': 'sobhan.das@intersoftkk.com',
          'FromName': 'Oh! My Concierge',
          'Subject': 'Payment Invoice',
          'Html-part': email_body,
          'Recipients': [{'Email': user.email}]
      };

      if(sendEmail.request(emailData)) {
        return true;       
      }

    }
    //end

    //first letter capital
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    //end

    async userLogout ({ auth, response }) {
        const user =  await auth.current.user
        const token = auth.getAuthHeader()
        // await auth.user
        //         .tokens()
        //         .where('type', 'jwt_refresh_token')
        //         // .where('is_revoked', false)
        //         // .where('token', Encryption.decrypt(token))
        //         .update({ is_revoked: true });

        // const refreshToken = '' // get it from user
        // await auth.check();
        // await auth
        //   .scheme('jwt')
        //   .revokeTokens([token], true)

        await auth
          .authenticator('jwt')
          .revokeTokens([token], true)

        return response.json({
            status: true,
            code: 200,
            message : "Logout successfully."
        });
    }

    test ({request }) {
      console.log(request);
      console.log(request.get(),'get');

      var details = request.get();
      var code = details.code;
      var state = details.state;


      axios.post('https://www.dbs.com/sandbox/api/sg/v1/oauth/tokens', {
        Authorization: "Basic " + code,
        redirect_uri : 'http://localhost:5000/dbs/test',
        code:"e2619f54-f3fe-453a-8710-6333cf6486fa",
        grant_type:'token'
      }).then(function(error, result){
        console.log(result,'result');
      })
    }

    async add_notification(user_details = '', added_job_details = '', decline ='', accept = '', service = '', find_allocated_vendor = '', user_payment = '') {
      var desc = '';
      if(user_details != ''){
        if(user_details.reg_type == 2){
          desc = `${user_details.first_name} ${user_details.last_name} just registered with us as a Customer.`
        }else {
          desc = `${user_details.first_name} ${user_details.last_name} just registered with us as a Vendor.`
        }
      }

      if(added_job_details != ''){
        desc = `${added_job_details.job_title} is created by ${user_details.first_name} ${user_details.last_name}.`
      }

      if(decline != ''){
        desc = `${user_details.first_name} ${user_details.last_name} has decline a job request.`
      }

      if(accept != '') {
        desc = `${user_details.first_name} ${user_details.last_name} has accept a job request.`
      }

      if(service != '') {
        desc = `${service.service_title} has registered by ${service.user_id.first_name} ${service.user_id.last_name}.`
      }

      if(find_allocated_vendor != ''){
        desc = `Job request sent to the vendor ${find_allocated_vendor[0].user_id.first_name} ${find_allocated_vendor[0].user_id.last_name} for ${find_allocated_vendor[0].job_id.job_title}`;
      }

      if(user_payment != '') {
        desc = `${user_details.first_name} ${user_details.last_name} has paid $${user_payment.job_amount} for ${user_payment.job_title}`;
      }

      var add = await Notification({
        description : desc,
        created_at : Date.now()
      })

      return await add.save();
    }

    async sentPushNotification (device_id, msg_body, user_details = '', click_action = '', title = ''){
      if(title != ''){
        title = title;
      }else {
        title = "Oh! My Concierge"
      }

      var message = {
          to: device_id,
          // collapse_key: 'text message',
          notification: {
            title: title, 
            body: msg_body,
            sound: "default",
            icon: "ic_launcher",
            tag : Date.now()
          },
          
          data: {  //you can send only notification or only data(or include both)
            'title' : title,
            'body' : msg_body,
            'click_action' : click_action,
            'tag' : Date.now()
          }
      };
      console.log(message,'push notification');

      fcm.send(message, function(err, response){
          if (err) {
              console.log("Something has gone wrong!");
          } else {
              console.log("Successfully sent with response: ", response);
              var add = new AppNotification({
                user_id : user_details._id,
                message : msg_body
              })

              add.save();
          }
      });
    }

    email_domain_check(email){
      var user_email = email;
      var email_api_key = Env.get('MAILBOX_LAYER_API_KEY');
      console.log(email_api_key,'email_api_key');
      // return false

      try {
        axios('http://apilayer.net/api/check', {
          access_key: '40b8a61171b1442ae2d243337d414a4b',
          email: user_email
        }).then ( function (result){
          console.log(result,'result');
          return false
        }).catch (function (error){
          console.log("then catch");
          throw error;
        });

      }catch (error) {
        console.log("try catch");
        throw error;
      }
    }


}

module.exports = ApiController
