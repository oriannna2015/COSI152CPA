/*
  cloudStorage.js - this is like asyncStorage 
  but requires an email address and stores key/value data in the cloud.
  This version does not have any authentication or validation of the email address.
*/
const express = require('express');
const router = express.Router();
const User = require('../models/User')
const listitem = require('../models/listItem')


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

router.post('cloud/shopping',
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

router.post('cloud/myDish',
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

router.post('/cloud/login',
    async (req, res, next)  => {
        console.log('in /cloud/getregistration');
        console.dir (req.body)
        const username = req.body;
        const userdata = await User.find({username})
        console.log('data found');
        res.json(userdata);
});

router.get('/cloud/login/:user',
    async (req, res, next)  => {
        console.log('in /cloud/getregistration');
        console.dir (req.params.user)
        const username = req.params.user;
        const userdata = await User.find({username})
        console.log('data found');
        res.json(userdata);
});


module.exports = router;