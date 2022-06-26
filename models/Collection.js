
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var dishSchema = Schema( {
  userId: {type:Schema.Types.ObjectId, ref:'User'},
  dishId: String,
  title: String,
  sourceName: String,
  ingredients: Array,
  time: String,
  nutrition: Array,
} );

module.exports = mongoose.model( 'DishItem', dishSchema );