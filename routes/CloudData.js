/*
  cloudStorage.js - this is like asyncStorage 
  but requires an email address and stores key/value data in the cloud.
  This version does not have any authentication or validation of the email address.
*/
const express = require('express');
const router = express.Router();
const CloudData = require('../models/CloudData');
const User = require('../models/User')


router.post('cloud/addlist',
async (req,res,next) => {
 try {
   const {item,id} = req.body;
   const coll = 
     new listitem(
       {
         userId:id,
         item:item,
       })
       await coll.save();
       res.json(coll);
 }catch(e) {
   next(e)
 }
})

router.get('cloud/shopping',
async (req,res,next) => {
  try{
    const {id} = req.body;
    const lists = 
       await listitem.find({userId:id})
    res.json(lists);
  }catch(e){
    next(e);
  }
}
)

router.get('cloud/myDish',
async (req,res,next) => {
  try{
    const {id} = req.body;
    const dishes = 
       await Dish.find({userId:id})
    res.json(dishes);
  }catch(e){
    next(e);
  }
}
)

router.get('/cloud/login/:username',
    async (req, res, next)  => {
        const username = req.params.username;
        console.log('in /cloud/getregistration');
        console.dir({username});
        const user = await User.findOne({username:username})
        res.json(user);
});


module.exports = router;