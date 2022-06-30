'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var IngreSchema = Schema( {
  userId: {type:Schema.Types.ObjectId, ref:'User'},
  dish: String,
  ingre: String,
} );

module.exports = mongoose.model( 'IngreItem', IngreSchema );