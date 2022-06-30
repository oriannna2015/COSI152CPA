var express = require('express');
var router = express.Router();

const Ingre = require('../models/Ingre')
const Dish = require('../models/MyDish')

const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/login')
}

router.get('/newDish', 
  isLoggedIn,
  async (req, res, next)  => {
    const userId = res.locals.user._id;
    res.locals.Ingredients= await Ingre.find({userId});
    res.render('addNewDish');
});

router.post('/newDish',
  isLoggedIn,
  async (req,res,next) => {
    try{
        const {dish, desc,url} = req.body;
        const userId = res.locals.user._id;
        const newDish = 
          new Dish(
            {dish,desc,url,userId});
        await newDish.save();
        res.redirect('/addIngre')

    } catch(e){
        next(e)
    }
  })
  //Here i want to collect from the user the name, description, reference ... informations about the recepie that they want to save.
  //Those information are designed to be saved as one Scheme, and after filling in those they'll be redirected to a new page for entering the ingredients they need.

router.get('/addIngre', 
  isLoggedIn,
  async (req, res, next)  => {
    const userId = res.locals.user._id;
    res.locals.Ingredients= await Ingre.find({userId});
    res.render('chooseIngre');
});

router.post('/addIngre',
  isLoggedIn,
  async (req,res,next) => {
    try{
        const {ingre,dish} = req.body;
        const userId = res.locals.user._id;
        const IG = 
          new Ingre(
            {userId,dish,ingre});
        await IG.save();
        res.redirect('/addIngre')

    } catch(e){
        next(e)
    }
  })

  //Those two requests handel with users entering ingredients. Each ingredients are designed to save as one independent Scheme object
  //The object is proposed to have three fields: the user ID, the name of the ingredient and the name of the recepie that it belongs to.
  //I'm wondering is it possible that i can save the 'dish' field in previous /newDish page and use it here as the dish field for ingredients so that user do not have to repeately enter it.

  //Also as alternative i've also throught of stroing all ingredients as a list together as a field in the recepie. However i do not know if i can collect an array from the user.
  //I think this is a better alternative if can be achieved. Do you have any suggestion on that?
module.exports = router;