'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var mydishSchema = Schema( {
  userId: {type:Schema.Types.ObjectId, ref:'User'},
  dish: String,
  referenceUrl: String,
  desc: String,
} );

module.exports = mongoose.model( 'MyDishItem', mydishSchema );