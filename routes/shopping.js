var express = require('express');
var router = express.Router();

const listitem = require('../models/listItem')

const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/login')
}

router.get('/addlist/:item',
isLoggedIn,
async (req,res,next) => {
 try {
   const {item} = req.params.item;
   const coll = 
     new listitem(
       {
         userId:res.locals.user._id,
         item:item,
       })
       await coll.save();
 }catch(e) {
   next(e)
 }
})

router.post('/addlist',
async (req,res,next) => {
 try {
   const {item} = req.body;
   const coll = 
     new listitem(
       {
         userId:res.locals.user._id,
         item:item,
       })
       await coll.save();
  res.redirect('/shopping');
 }catch(e) {
   next(e)
 }
})

router.get('/shopping',
isLoggedIn,
async (req,res,next) => {
  try{
    const lists = 
       await listitem.find({userId:res.locals.user._id})
    res.locals.lists = lists;
    //res.json(dishes);
    res.render('shoppingList')
  }catch(e){
    next(e);
  }
}
)

router.get('/deletelist/:item',
  isLoggedIn,
  async (req,res,next) => {
    try {
      const item = req.params.item;
      await Dish.deleteOne({item:item});
      res.redirect('/shopping');
    } catch(e){
      next(e);
    }
  }
)

module.exports = router;