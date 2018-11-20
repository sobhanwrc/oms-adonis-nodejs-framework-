'use strict'

const Hash = use('Hash')
const User = use('App/Models/User')
const Mailjet = use('node-mailjet').connect('ce9c25078a4f1474dc6d3ce5524a711c', 'd9ca8c7b9944f10a34eb42118277e6f5');
const gravatar = use('gravatar');
const base64_to_image = use ('base64-to-image');
const randomstring = use("randomstring");
const datetime = use('node-datetime');
const moment = use('moment');

class ApiController {
    //common api for all 

    async registration ({request, response, auth}) {
        var first_name = request.input('first_name');
        var last_name = request.input('last_name');
        var middle_name = request.input('middle_name');
        var email = request.input('email');
        var phone_number = request.input('phone_number');
        var password = await Hash.make(request.input('password'));
        var address = request.input('address');
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
        }

        var checkExistingUser = await User.findOne ({
            email : email
        });
        
        if(checkExistingUser) {
            response.json ({
                status : false,
                code : 400,
                messages : "User is already registered with us."
            });
        } else {
            var add = new User({  
                first_name : first_name,
                middle_name : middle_name,
                last_name : last_name,
                profile_image : "http:" + avatar, 
                email : email,
                phone_number : phone_number,
                address : address,
                city : city,
                dob : dob,
                business : business,
                bank_information : bank,
                uen_no : uen_no,
                status : 1, //active
                reg_type : reg_type,
                password: password
            });

            var email_body = `
        <!DOCTYPE html>
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
                                    <img src='/logo.png' alt="logo_chef_final" border="0" />
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
                                                            Hi ${first_name}, 
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
                                                                        <a href="http://122.163.54.103:90/ChefsCorner/"><img src='/logo.png' alt="logo_chef_final" border="0" width="80%" /></a>
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
            try{
                if(await add.save()) {
                    const user = await User.findOne({email : email});
                    var generate_token = await auth.generate(user);

                    var sendEmail = Mailjet.post('send');
                    var emailData = {
                        'FromEmail': 'sobhan.das@intersoftkk.com',
                        'FromName': 'Oh! My Concierge',
                        'Subject': 'Registration confirmation',
                        'Html-part': email_body,
                        'Recipients': [{'Email': email}]
                    };
                    if(sendEmail.request(emailData)) {
                        return response.json({
                            success: true, 
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
        // validate the user credentials and generate a JWT token
        // const token = await auth.attempt(
        //     request.input('email'),
        //     request.input('password')
        // ) 

        const user = await User.findOne({
            email : request.input('email'),
        });
        const isSame = await Hash.verify(request.input('password'), user.password);

        if(user && isSame && user.status === 1) {
            var generate_token = await auth.generate(user);

            return response.json({
                status: 'success',
                token: 'Bearer ' + generate_token.token,
                message : "Login successfully."
            })
        }else if (user.status == 0) {
            return response.json ({
                status: false,
                code: 400,
                message : "Your account is deactivated. Because you have recently requested for forgot password. So, check your email or contact with admin."
            });
        }else { 
            return response.json ({
                status: false,
                code: 400,
                message : "Wrong username or password."
            });
        }
    }

    async userDetails ({ request, response, auth}) {
        try {
            return await auth.getUser()
        } catch (error) {
            response.send('Missing or invalid jwt token')
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
        var city = request.input('city') ? request.input('city') : user.city;
        var dob = request.input('dob') ? request.input('dob') : user.dob;

        var company_name = request.input('company_name') ? request.input('company_name') : user.business[0].company_name;
        var company_address = request.input('company_address') ? request.input('company_address') : user.business[0].company_address;
        var company_ph_no = request.input('company_ph_no') ? request.input('company_ph_no') : user.business[0].company_ph_no;
        var experience = request.input('experience') ? request.input('experience') : user.business[0].experience;
        var service_type = request.input('service_type') ? request.input('service_type') : user.business[0].service_type;
        var services = request.input('services') ? request.input('services') : user.business[0].services;

        var uen_no = request.input('uen_no') ? request.input('uen_no') : user.uen_no;

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
        user.city = city;
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
            response.json ({
                status : true,
                code : 200,
                message : "Profile updated successfully."
            });
        }else { 
            response.json ({
                status : false,
                code : 400,
                message : "Profile updated failed."
            });
        }

    }

    async uploadProfileImage ({ request, response, auth}) {
        try{
            var user = await auth.getUser();

            var base64Str = request.input('profile_image');
    
            // var base64Str = req.body.profile_image.replace(/^data:image\/jpeg+;base64,/, "");
            var base64Str1 = base64Str.replace(/ /g, '+');

            let base64ImageMimeType = base64Str1.split(';base64,');
            var type = base64ImageMimeType[0].split(':image/');

            var path ='public/profile_image/';

            var imageFileName = user.id + '-' + Date.now();
            var optionalObj = {'fileName': imageFileName, 'type': type[1]};
            var uploadImage = base64_to_image(base64Str1,path,optionalObj);

            var full_image_path = request.header('Host') + '/profile_image/' + uploadImage.fileName;

            user.profile_image = 'http://'+full_image_path;

            if(await user.save()){
                response.json({
                success: true,
                code:200,
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
        
                    var email_body = `
                    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
        
                    if(await user.save()) {
                        var sendEmail = Mailjet.post('send');
                        var emailData = {
                            'FromEmail': 'sobhan.das@intersoftkk.com',
                            'FromName': 'Oh! My Concierge',
                            'Subject': 'Forgot Password Link',
                            'Html-part': email_body,
                            'Recipients': [{'Email': email}]
                        };
                        if(sendEmail.request(emailData)) {
                            return response.json({
                                success: true, 
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
    
                var email_body = `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
    
                if(await user.save()) {
                    var sendEmail = Mailjet.post('send');
                    var emailData = {
                        'FromEmail': 'sobhan.das@intersoftkk.com',
                        'FromName': 'Oh! My Concierge',
                        'Subject': 'Forgot Password Link',
                        'Html-part': email_body,
                        'Recipients': [{'Email': email}]
                    };
                    if(sendEmail.request(emailData)) {
                        return response.json({
                            success: true, 
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

    async userLogout ({ auth, response }) {
        // const user =  await auth.current.user 
        // console.log(user);
        // const token = auth.getAuthHeader()
        // await user
        //         .tokens()
        //         .where('type', 'api_token')
        //         .where('is_revoked', false)
        //         .where('token', Encryption.decrypt(token))
        //         .update({ is_revoked: true })

        await auth.logout();

        return response.json({
            status: true,
            msg : "Logout successfully."
        });
    }
}

module.exports = ApiController
