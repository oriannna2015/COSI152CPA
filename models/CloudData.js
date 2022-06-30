/*
  CloudData is used to store key/value pairs for a particular email
*/
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var IngreSchema = Schema( {
  userId: {type:Schema.Types.ObjectId, ref:'User'},
  dish: String,
  Ingredient: String,
} );

module.exports = mongoose.model( 'IngreData', IngreSchema );