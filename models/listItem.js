'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var ListSchema = Schema( {
  userId: {type:Schema.Types.ObjectId, ref:'User'},
  item: String,
} );

module.exports = mongoose.model( 'listItem', ListSchema );