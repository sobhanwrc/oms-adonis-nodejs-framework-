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
      profile_image : { type : String},
      email: { type: String,unique: true },
      phone_number : {type: Number},
      password: { type: String },
      address: {type : String},
      city: { type : String},
      dob: { type: String},
      company_name: { type : String},
      company_address : { type : String},
      uen_no : { type: String, unique: true},
      latitude: {type : Number},
      longitude : { type: Number},
      status: { type: Number, default: 0},
      reg_type: { type: String }, //1=Admin,2=User,3=Vendor
      social_id: { type: String },
      created_at : { type: Date, default : Date.now()}
    }
  }
}

module.exports = User.buildModel('User')
