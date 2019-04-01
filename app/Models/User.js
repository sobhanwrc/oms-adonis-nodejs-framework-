'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class User
 */
class User extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'UserHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * User's schema
   */
  static get schema () {
    return {
      first_name: { type: String, default: '' },
      middle_name: { type: String, default: ''},
      last_name: { type: String, default: '' },
      profile_image : { type : String,  default: '' },
      profile_image_type : { type: String, default : ''},
      email: { type: String, unique: true ,  default: '' },
      gender : { type : String,  default: '' },
      phone_number : {type: String,  default: '' },
      password: { type: String,  default: ''  },
      address: {type: String, default : ''},
      location_id : {type: String, default : ''},
      user_address2 : {type : String},
      city: { type : String,  default: '' },
      dob: { type: String,  default: '' },
      business : [
        {
          company_name: { type : String,  default: '' },
          company_address : { type : String,  default: '' },
          company_ph_no : { type: String,  default: '' },
          experience : { type : String,  default: '' },
          service_type : { type : String,  default: '' },
          services: { type : String,  default: '' }
        }
      ],
      bank_information: [
        {
          bank_name:  { type : String, default: '' },
          account_no : { type : String,default: '' },
          swift_code :  { type : String, default: '' },
        }
      ],
      stripe_details : [{
        customer_id : { type : String, unique : true, default: ''},
        account_balance : { type : Number, default: ''},
        invoice_prefix : { type : String, default: ''},
        customer_created : {type : String, default: ''}
      }],
      uen_no : { type: String, unique: true,  default: '' },

      geoLocation : {
        type : { type : String, default : "Point"},
        coordinates : { type: [Number], default: [0, 0] } //lat,long
        // index: '2dsphere'
      },

      // latitude: {type : String,  default: '' },
      // longitude : { type: String,  default: '' },
      status: { type: Number, default: 0}, //1 = 'active', 0='Inactive'
      reg_type: { type: String,  default: ''  }, //1=Admin,2=User,3=Vendor
      login_type: { type: String,  default: ''  }, //F=Facebook,G=Google,N=Normal
      social_id: { type: String,  default: ''  },
      forgot_pw_key : { type: String, default: ''},
      forgot_pw_email_sent_date : { type: Date, default: ''},
      device_id : { type :  String},
      created_at : { type: Date, default : Date.now()}
    }
  }
}

module.exports = User.buildModel('User')
