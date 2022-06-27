'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var dishSchema = Schema( {
  dishId: String,
  title: String,
  sourceName: String,
  ingredients: Array,
  time: String,
  nutrition: Array,
} );

module.exports = mongoose.model( 'DishItem', dishSchema );