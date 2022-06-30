/*
  cloudStorage.js - this is like asyncStorage 
  but requires an email address and stores key/value data in the cloud.
  This version does not have any authentication or validation of the email address.
*/
const express = require('express');
const router = express.Router();
const CloudData = require('../models/CloudData');

/* store key/value pair in the collection for the user with specified email */
router.post('/cloud/store', 
    async (req, res, next)  => {
        const {userId} = res.locals.user._id;
        const {dish,ingredient} = req.body;
        console.log('in /cloud/store');
        console.dir({userId,dish,ingredient});
        const cloudData = new CloudData({userId,dish,ingredient})
        await cloudData.save()
        res.json({id:cloudData.id})
});

/* get the list of all values associated with the particular email and key */
router.post('/cloud/get',
    async (req, res, next)  => {
        console.log('in /cloud/get');
        console.dir(req.body);
        const {dish} = req.body;
        const userId = res.locals.user._id
        const cloudData = await CloudData.find({userId,dish})
        res.json(cloudData);
});

/* remove all key/values pairs for the specified email */
router.post('/cloud/deleteDish',
    async (req, res, next)  => {
        const {dish} = req.body;
        const cloudData = await CloudData.deleteMany({dish})
        res.json(cloudData);
})

router.get('/cloud/showAll',
    async (req, res, next)  => {
        const cloudData = await CloudData.find({})
        res.json(cloudData);
})


module.exports = router;