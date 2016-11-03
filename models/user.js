const Bcrypt = require('bcrypt');
const Mongoose = require('mongoose');
const FIELDS = require('../utils/constants').ALLOWED_FIELDS;

const subscription = {
  user: {type: Mongoose.Schema.ObjectId, ref: 'users', required: true},
  fields: [{type : String, trim : true,enum : FIELDS }]
};

const userSchema = new Mongoose.Schema({
  email: { type: String, unique: true, trim: true, index : true},
  phoneNo : {type : String, unique: true, trim : true, index : true},
  password: String,
  firstName : {type : String, required : true},
  lastName : {type : String, required : true},
  accessToken : {type : String, unique : true},
  favColor : {type : String},
  favPlace : {type : String},
  subscriptions : [subscription],
  subscribers : [subscription]
}, { timestamps: true });

const User = Mongoose.model('User', userSchema);

module.exports = User;
