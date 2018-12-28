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
const stripe = use('stripe')('sk_test_1lfdJgJawDb3EFLvNDyi1p7v'); //secret key for test account
const _ = use('lodash');
const Rating = use ('App/Models/Rating');
const {rate,average} = use('average-rating');
const StripeTransaction = use ('App/Models/StripeTransaction');
const axios = use('axios');
//for fetch geo location
// var NodeGeocoder = use('node-geocoder');
// var options = {
//   provider: 'google',
 
//   // Optional depending on the providers
//   httpAdapter: 'https', // Default
//   apiKey: '37231128145-3lbk67f5nc1ag8fonehohppt3hqgd7j0.apps.googleusercontent.com', // for Mapquest, OpenCage, Google Premier
//   formatter: null         // 'gpx', 'string', ...
// };
 
// var geocoder = NodeGeocoder(options);
//end

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
        var business = {
            company_name : company_name,
            company_address : company_address
        }
        var bank = {};

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
              messages : "UEN number is duplicate. Enter valid UEN number."
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
                password: password
            });

            try{
                if(await add.save()) {
                    const user = await User.findOne({email : email});
                    var generate_token = await auth.generate(user);
                    var send_registration_email = this.registrationEmailData(user);

                    if(send_registration_email == true) {
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
            var generate_token = await auth.generate(user);

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
        res.json({
          success: false, 
          code: 300, 
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
                var generate_token = await auth.generate(user);

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
                var generate_token = await auth.generate(user);
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
            res.json({
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
                var generate_token = await auth.generate(user);

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
                var generate_token = await auth.generate(user);
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
          var user_location_id = user_details.location_id;

          if(user_location_id) {
            var location_details = await Location.findOne({_id : user_location_id})
            var location_place_name = location_details.name;
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

        var company_name = request.input('company_name') ? request.input('company_name') : user.business[0].company_name;
        var company_address = request.input('company_address') ? request.input('company_address') : user.business[0].company_address;
        var company_ph_no = request.input('company_ph_no') ? request.input('company_ph_no') : user.business[0].company_ph_no;
        var experience = request.input('experience') ? request.input('experience') : user.business[0].experience;
        var service_type = request.input('service_type') ? request.input('service_type') : user.business[0].service_type;
        var services = request.input('services') ? request.input('services') : user.business[0].services;
        var uen_no = request.input('uen_no') ? request.input('uen_no') : user.uen_no;
        var location_id = request.input('location_id') ? request.input('location_id') : user.location_id;

        user.bank_information = {
            bank_name : bank_name ? bank_name : user.bank_information[0].bank_name,
            account_no : account_no ? account_no : user.bank_information[0].account_no,
            swift_code : swift_code ? swift_code : user.bank_information[0].swift_code,
        }

        user.first_name = first_name;
        user.middle_name = middle_name;
        user.last_name = last_name;
        user.gender = gender;
        user.phone_number = phone_number;
        user.address = address;
        user.location_id = location_id;
        user.dob = dob;
        user.uen_no = uen_no;
        user.business = {
            company_name : company_name,
            company_address : company_address,
            company_ph_no : company_ph_no,
            experience : experience,
            service_type : service_type,
            services : services,
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
                        message : "Already sent you password reset email. Please check your email."
                    });
                    
                } else { 

                    var secretKey = await randomstring.generate({
                        length: 16,
                        charset: 'alphanumeric'
                    });
                    var link = "http://"+request.header('Host')+"/forgot-password";
        
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
                var link = "http://"+request.header('Host')+"/forgot-password";
    
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

    async addJobIndustrty ({request, response}) {
      var add = new JobIndustry ({
        industry_name : request.input('industry_name'),
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
      var add = new JobCategory ({
        category_type : request.input('category_type'),
      });

      if(await add.save()) {
        response.json ({
          status : true, 
          code : 200, 
          message : "Added successfully."
        });
      }
    }

    async fetchJobCategoryAndIndustry ({response}) {
      var all_jobcategory = await JobCategory.find({},{status: 0, created_at: 0, updated_at: 0, __v:0 });
      var all_jobindustry = await JobIndustry.find({},{status: 0, created_at: 0, updated_at: 0, __v:0 });

      response.json ({
        status : true,
        code : 200,
        jobIndustry : all_jobindustry,
        jobCategory : all_jobcategory
      });
    }

    async addJob ({request, response, auth}) {
      var user = await auth.getUser();
      var last_job_details = await Job.find({},{ 'create_job_id' : 1, _id : 0 }).sort({_id:-1}).limit(1);

      if(user.reg_type == 2) {
        var user_id = user._id;
        var job_title = request.input('job_title');
        var service_require_at = request.input('service_require_at');
        var job_industry = request.input('job_industry');
        var job_category = request.input('job_category');
        var job_date = request.input('job_date');
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

        var user_present_address_check = request.input('check_address');

        var add_job = new Job({
          create_job_id : create_job_id,
          user_id : user_id,
          job_title : job_title,
          service_require_at : service_require_at,
          job_amount : job_amount,
          job_industry : job_industry,
          job_category : job_category,
          job_date : job_date,
          job_endDate : job_endDate,
          job_time : job_time,
          job_end_time : job_end_time,
          description : description,
          duration : duration,
          status : 2, // 1= active, 2 = inactive, 3 = complete
          job_allocated_to_vendor : job_allocated_to_vendor
        });
        var jod_id = await add_job.save();

        if(jod_id != '') {
          if(user_present_address_check == undefined) {
            user.user_address2 = service_require_at
            await user.save();
          }
          response.json({
            status : true,
            code : 200,
            data : jod_id,
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

    async jobList ({request, response, auth}) {
      var user = await auth.getUser();
      var all_jobs_list = await Job.find({user_id: user._id})
      .populate('job_industry')
      .populate('job_category');

      console.log(all_jobs_list);

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
      .populate('job_industry')
      .populate('job_category');

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
        var job_date = request.input('job_date') ? request.input('job_date') : job_update.job_date;
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
        job_update.job_date = job_date;
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
      var all_servicecategory = await ServiceCategory.find({},{status: 0, created_at: 0, updated_at: 0, __v:0 });
      var all_servicetype = await ServiceType.find({},{status: 0, created_at: 0, updated_at: 0, __v:0 });

      response.json ({
        status : true,
        code : 200,
        all_servicecategory : all_servicecategory,
        all_servicetype : all_servicetype
      });
    }

    async serviceAdd ({request, response, auth}) {
      try {
        var user = await auth.getUser();
        if(user.reg_type == 3) {
          var add_service = new Service ({
            user_id : user._id,
            service_title : request.input('service_title'),
            service_type : request.input('service_type'),
            service_category : request.input('service_category'),
            rate : request.input('rate'),
            start_date : request.input('start_date'),
            end_date : request.input('end_date'),
            description : request.input('description'),
            status : request.input('status') // 1 ='active',2='Inactive'
          });
  
          if(await add_service.save()) {
            response.json ({
              status : true,
              code : 200,
              message : "Service added successfully."
            });
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
        .populate('service_type')
        .populate('service_category');

        if(all_services) {
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

          service_details.start_date = request.input('start_date') ? request.input('start_date') : service_details.start_date;

          service_details.end_date = request.input('end_date') ? request.input('end_date') : service_details.end_date;

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
      var generate_token = await auth.generate(user);

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
        .populate('job_category');

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
          var latest_fiveServices = "NO latest services found."
        }

        var complete_job = await Job.find({'vendor_id' : user._id, status : 3}).sort({created_at : -1, _id : -1}).limit(5);
        
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
                user_job.job_amount = request.input('job_amount');
                user_job.status = 1;
                user_job.transaction_id = charge.id;

                var save_job = await user_job.save();

                if(save_job) {
                  if(save_card == 0) {
                    //stripe delete default card
                    var delete_card = await stripe.customers.deleteCard(customer_id,charge.source.id);
                  }
                  
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

    //associate vendor bank account with stripe connect
    async stripeCreateConnectAccount ({request, response, auth}) {
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
            amount: request.input('release_amount'),
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
          <style>
              #customers {
                  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
                  border-collapse: collapse;
                  width: 100%;
              }
      
                  #customers td, #customers th {
                      border: 1px solid #ddd;
                      padding: 5px;
                  }
      
                  #customers tr:nth-child(even) {
                      background-color: #f2f2f2;
                  }
      
      
                  #customers th {
                      padding-top: 12px;
                      padding-bottom: 12px;
                      text-align: left;
                      background-color: #4CAF50;
                      color: white;
                      font-weight: normal;
                  }
      
                  #customers td {
                      font-size: 12px;
                  }
      
                      #customers td img {
                          width: 50px;
                          border-radius: 50%;
                          height: 50px;
                      }
          </style>
        </head>
        <body>
          <table class="width_100 currentTable" align="center" border="0" cellpadding="0" cellspacing="0" width="800" style="border-collapse:collapse;" data-module="Account Password 1">
              <tr>
                  <td width="100%" align="center" valign="middle" background="https://w-dog.net/wallpapers/14/16/506636200709579/mood-a-bottle-a-letter-note-message-beach-sand-sea-river-water-background-wallpaper-widescreen-full-screen-hd-wallpapers.jpg" style="background-image: url('https://w-dog.net/wallpapers/14/16/506636200709579/mood-a-bottle-a-letter-note-message-beach-sand-sea-river-water-background-wallpaper-widescreen-full-screen-hd-wallpapers.jpg'); background-position: center center; background-repeat: repeat; background-size: cover;" bgcolor="#f7f8f8" data-bg="Account Password 1" data-bgcolor="Account Password 1">
                      <table align="center" border="0" cellpadding="0" width="100%" cellspacing="0" style="border-collapse: collapse;">
                          <tr>
                              <td width="100%" height="20" style="line-height:1px;"></td>
                          </tr>
                          <tr>
                              <td width="100%" align="center" valign="middle" style="line-height:1px;">
                                  <img src='http://18.179.118.55/logo.png' alt="logo_chef_final" border="0" />
                              </td>
                          </tr>
                          <tr>
                              <td width="100%" height="21" style="line-height:1px;"></td>
                          </tr>
                          <tr>
                              <td width="100%" align="center" valign="middle">
                                  <table class="width_90percent" align="center" border="0" cellpadding="0" width="600" cellspacing="0" style="border-collapse: collapse; max-width:90%; -webkit-border-radius: 10px; border-radius: 10px; background-color: #fff;" data-bgcolor="Box Color">
                                      <tr>
                                          <td width="100%" align="center" valign="middle">
                                              <table class="width_90percent" align="center" border="0" cellpadding="0" width="550" cellspacing="0" style="border-collapse: collapse; max-width:90%;">
                                                  <tr>
                                                      <td width="100%" height="53" style="line-height:1px;"></td>
                                                  </tr>
                                                  <tr>
                                                      <td width="100%" align="center" valign="middle" data-size="Main Title" data-min="20" data-max="28" data-color="Main Title" style="margin:0px; padding:0px; font-size:15px; color: #c63a39; margin-bottom: 10px; font-family: 'Open Sans', Helvetica, Arial, Verdana, sans-serif; font-weight:bold;">
                                                         <p style="color: #b3b3b3;">
                                                          Hi ${user.first_name}, 
                                                          You have successfully registered to our services.
                                                          <br>
                                                              Thank You!
                                                         </p>
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td width="100%" height="18" style="line-height:1px;"></td>
                                                  </tr>
                                                  
                                                  <tr>
                                                      <td width="100%" align="center" valign="middle">
                                                          <table class="width_90percent" align="center" border="0" cellpadding="0" cellspacing="0" width="255" style="border-collapse:collapse; max-width:100%; -webkit-border-radius:30px; border-radius:30px;">
                                                              <tr>
                                                                  <td width="100%" align="center" data-size="Button" data-color="Button" data-min="10" data-max="18">
                                                                      <a href="http://122.163.54.103:90/ChefsCorner/"><img src='http://18.179.118.55/logo.png' alt="logo_chef_final" border="0" width="80%" /></a>
                                                                  </td>
                                                              </tr>
                                                          </table>
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td class="display-block padding" width="100%" height="21" style="line-height:1px;"></td>
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
                              <td width="100%" align="center" valign="middle" data-size="Footer Description" data-min="9" data-max="16" data-color="Footer Description" style="margin:0px; padding:0px; font-size:12px; color:#000000; font-family: 'Open Sans', Helvetica, Arial, Verdana, sans-serif; font-weight:normal; line-height:24px;">
                                  © 2018 All right reserved OMC
                              </td>
                          </tr>
      
                          <tr>
                              <td width="100%" height="43" style="line-height:1px;"></td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
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
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <title>Set up a new password for OMC</title>
                    <style type="text/css" rel="stylesheet" media="all">
                    /* Base ------------------------------ */
                    
                    *:not(br):not(tr):not(html) {
                      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
                      box-sizing: border-box;
                    }
                    
                    body {
                      width: 100% !important;
                      height: 100%;
                      margin: 0;
                      line-height: 1.4;
                      background-color: #F2F4F6;
                      color: #74787E;
                      -webkit-text-size-adjust: none;
                    }
                    
                    p,
                    ul,
                    ol,
                    blockquote {
                      line-height: 1.4;
                      text-align: left;
                    }
                    
                    a {
                      color: #3869D4;
                    }
                    
                    a img {
                      border: none;
                    }
                    
                    td {
                      word-break: break-word;
                    }
                    /* Layout ------------------------------ */
                    
                    .email-wrapper {
                      width: 100%;
                      margin: 0;
                      padding: 0;
                      -premailer-width: 100%;
                      -premailer-cellpadding: 0;
                      -premailer-cellspacing: 0;
                      background-color: #F2F4F6;
                    }
                    
                    .email-content {
                      width: 100%;
                      margin: 0;
                      padding: 0;
                      -premailer-width: 100%;
                      -premailer-cellpadding: 0;
                      -premailer-cellspacing: 0;
                    }
                    /* Masthead ----------------------- */
                    
                    .email-masthead {
                      padding: 25px 0;
                      text-align: center;
                    }
                    
                    .email-masthead_logo {
                      width: 94px;
                    }
                    
                    .email-masthead_name {
                      font-size: 16px;
                      font-weight: bold;
                      color: #bbbfc3;
                      text-decoration: none;
                      text-shadow: 0 1px 0 white;
                    }
                    /* Body ------------------------------ */
                    
                    .email-body {
                      width: 100%;
                      margin: 0;
                      padding: 0;
                      -premailer-width: 100%;
                      -premailer-cellpadding: 0;
                      -premailer-cellspacing: 0;
                      border-top: 1px solid #EDEFF2;
                      border-bottom: 1px solid #EDEFF2;
                      background-color: #FFFFFF;
                    }
                    
                    .email-body_inner {
                      width: 570px;
                      margin: 0 auto;
                      padding: 0;
                      -premailer-width: 570px;
                      -premailer-cellpadding: 0;
                      -premailer-cellspacing: 0;
                      background-color: #FFFFFF;
                    }
                    
                    .email-footer {
                      width: 570px;
                      margin: 0 auto;
                      padding: 0;
                      -premailer-width: 570px;
                      -premailer-cellpadding: 0;
                      -premailer-cellspacing: 0;
                      text-align: center;
                    }
                    
                    .email-footer p {
                      color: #AEAEAE;
                    }
                    
                    .body-action {
                      width: 100%;
                      margin: 30px auto;
                      padding: 0;
                      -premailer-width: 100%;
                      -premailer-cellpadding: 0;
                      -premailer-cellspacing: 0;
                      text-align: center;
                    }
                    
                    .body-sub {
                      margin-top: 25px;
                      padding-top: 25px;
                      border-top: 1px solid #EDEFF2;
                    }
                    
                    .content-cell {
                      padding: 35px;
                    }
                    
                    .preheader {
                      display: none !important;
                      visibility: hidden;
                      mso-hide: all;
                      font-size: 1px;
                      line-height: 1px;
                      max-height: 0;
                      max-width: 0;
                      opacity: 0;
                      overflow: hidden;
                    }
                    /* Attribute list ------------------------------ */
                    
                    .attributes {
                      margin: 0 0 21px;
                    }
                    
                    .attributes_content {
                      background-color: #EDEFF2;
                      padding: 16px;
                    }
                    
                    .attributes_item {
                      padding: 0;
                    }
                    /* Related Items ------------------------------ */
                    
                    .related {
                      width: 100%;
                      margin: 0;
                      padding: 25px 0 0 0;
                      -premailer-width: 100%;
                      -premailer-cellpadding: 0;
                      -premailer-cellspacing: 0;
                    }
                    
                    .related_item {
                      padding: 10px 0;
                      color: #74787E;
                      font-size: 15px;
                      line-height: 18px;
                    }
                    
                    .related_item-title {
                      display: block;
                      margin: .5em 0 0;
                    }
                    
                    .related_item-thumb {
                      display: block;
                      padding-bottom: 10px;
                    }
                    
                    .related_heading {
                      border-top: 1px solid #EDEFF2;
                      text-align: center;
                      padding: 25px 0 10px;
                    }
                    /* Discount Code ------------------------------ */
                    
                    .discount {
                      width: 100%;
                      margin: 0;
                      padding: 24px;
                      -premailer-width: 100%;
                      -premailer-cellpadding: 0;
                      -premailer-cellspacing: 0;
                      background-color: #EDEFF2;
                      border: 2px dashed #9BA2AB;
                    }
                    
                    .discount_heading {
                      text-align: center;
                    }
                    
                    .discount_body {
                      text-align: center;
                      font-size: 15px;
                    }
                    /* Social Icons ------------------------------ */
                    
                    .social {
                      width: auto;
                    }
                    
                    .social td {
                      padding: 0;
                      width: auto;
                    }
                    
                    .social_icon {
                      height: 20px;
                      margin: 0 8px 10px 8px;
                      padding: 0;
                    }
                    /* Data table ------------------------------ */
                    
                    .purchase {
                      width: 100%;
                      margin: 0;
                      padding: 35px 0;
                      -premailer-width: 100%;
                      -premailer-cellpadding: 0;
                      -premailer-cellspacing: 0;
                    }
                    
                    .purchase_content {
                      width: 100%;
                      margin: 0;
                      padding: 25px 0 0 0;
                      -premailer-width: 100%;
                      -premailer-cellpadding: 0;
                      -premailer-cellspacing: 0;
                    }
                    
                    .purchase_item {
                      padding: 10px 0;
                      color: #74787E;
                      font-size: 15px;
                      line-height: 18px;
                    }
                    
                    .purchase_heading {
                      padding-bottom: 8px;
                      border-bottom: 1px solid #EDEFF2;
                    }
                    
                    .purchase_heading p {
                      margin: 0;
                      color: #9BA2AB;
                      font-size: 12px;
                    }
                    
                    .purchase_footer {
                      padding-top: 15px;
                      border-top: 1px solid #EDEFF2;
                    }
                    
                    .purchase_total {
                      margin: 0;
                      text-align: right;
                      font-weight: bold;
                      color: #2F3133;
                    }
                    
                    .purchase_total--label {
                      padding: 0 15px 0 0;
                    }
                    /* Utilities ------------------------------ */
                    
                    .align-right {
                      text-align: right;
                    }
                    
                    .align-left {
                      text-align: left;
                    }
                    
                    .align-center {
                      text-align: center;
                    }
                    /*Media Queries ------------------------------ */
                    
                    @media only screen and (max-width: 600px) {
                      .email-body_inner,
                      .email-footer {
                        width: 100% !important;
                      }
                    }
                    
                    @media only screen and (max-width: 500px) {
                      .button {
                        width: 100% !important;
                      }
                    }
                    /* Buttons ------------------------------ */
                    
                    .button {
                      background-color: #3869D4;
                      border-top: 10px solid #3869D4;
                      border-right: 18px solid #3869D4;
                      border-bottom: 10px solid #3869D4;
                      border-left: 18px solid #3869D4;
                      display: inline-block;
                      color: #FFF;
                      text-decoration: none;
                      border-radius: 3px;
                      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
                      -webkit-text-size-adjust: none;
                    }
                    
                    .button--green {
                      background-color: #22BC66;
                      border-top: 10px solid #22BC66;
                      border-right: 18px solid #22BC66;
                      border-bottom: 10px solid #22BC66;
                      border-left: 18px solid #22BC66;
                    }
                    
                    .button--red {
                      background-color: #FF6136;
                      border-top: 10px solid #FF6136;
                      border-right: 18px solid #FF6136;
                      border-bottom: 10px solid #FF6136;
                      border-left: 18px solid #FF6136;
                    }
                    /* Type ------------------------------ */
                    
                    h1 {
                      margin-top: 0;
                      color: #2F3133;
                      font-size: 19px;
                      font-weight: bold;
                      text-align: left;
                    }
                    
                    h2 {
                      margin-top: 0;
                      color: #2F3133;
                      font-size: 16px;
                      font-weight: bold;
                      text-align: left;
                    }
                    
                    h3 {
                      margin-top: 0;
                      color: #2F3133;
                      font-size: 14px;
                      font-weight: bold;
                      text-align: left;
                    }
                    
                    p {
                      margin-top: 0;
                      color: #74787E;
                      font-size: 16px;
                      line-height: 1.5em;
                      text-align: left;
                    }
                    
                    p.sub {
                      font-size: 12px;
                    }
                    
                    p.center {
                      text-align: center;
                    }
                    </style>
                  </head>
                  <body>
                    <span class="preheader">Use this link to reset your password. The link is only valid for 24 hours.</span>
                    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <table class="email-content" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td class="email-masthead">
                                <a href="https://example.com" class="email-masthead_name">
                        Oh! My Concierge
                      </a>
                              </td>
                            </tr>
                            <!-- Email Body -->
                            <tr>
                              <td class="email-body" width="100%" cellpadding="0" cellspacing="0">
                                <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0">
                                  <!-- Body content -->
                                  <tr>
                                    <td class="content-cell">
                                      <h1>Hi ${user.first_name},</h1>
                                      <p>You recently requested to reset your password for your OMC account. Use the button below to reset it. <strong>This password reset is only valid for the next 48 hours.</strong></p>
                                      <!-- Action -->
                                      <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                          <td align="center">
                                            <!-- Border based button
                                       https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                              <tr>
                                                <td align="center">
                                                  <table border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                      <td>
                                                        <a href="${link}" class="button button--green" target="_blank">Reset your password</a>
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                      <p> If you did not request a password reset, please ignore this email or contact support</a> if you have questions.</p>
                                      <p>Thanks,
                                        <br>The OMC Team</p>
                                      <!-- Sub copy -->
                                      <table class="body-sub">
                                        <tr>
                                          <td>
                                            <p class="sub">If you’re having trouble with the button above, copy and paste the URL below into your web browser.</p>
                                            <p class="sub">${link}</p>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
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


}

module.exports = ApiController
