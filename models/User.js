'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var userSchema = Schema( {
  username: String,
  profilename:String,
  passphrase: String,
  age: String,
  avatar:String,
} );

module.exports = mongoose.model( 'User', userSchema );