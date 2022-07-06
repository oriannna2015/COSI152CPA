var express = require('express');
var router = express.Router();

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
    res.render('addNewDish');
});

router.post('/newDish',
  isLoggedIn,
  async (req,res,next) => {
    try{
        var {dish, desc,url,image,ingre} = req.body;
        if (url == ""){
          url = "NA"
        }
        if (image == ""){
          image = "https://i.pinimg.com/564x/dd/9d/c9/dd9dc9d83423bc037b511d73b29e6b80.jpg"
        }
        const userId = res.locals.user._id;
        const ingredients = ingre.split(",")
        const newDish = 
          new Dish(
            {userId, dish, url, image,desc, ingredients});
        await newDish.save();
        res.redirect('/myDish')

    } catch(e){
        next(e)
    }
  })

  router.get('/myDish',
  isLoggedIn,
  async (req,res,next) => {
    try{
      const dishes = 
         await Dish.find({userId:res.locals.user._id})
      res.locals.dishes = dishes;
      //res.json(dishes);
      res.render('showDish')
    }catch(e){
      next(e);
    }
  }
)

router.get('/deletedish/:itemId',
    isLoggedIn,
    async (req,res,next) => {
      try {
        const itemId = req.params.itemId;
        await Dish.deleteOne({dishId:itemId});
        res.redirect('/myDish');
      } catch(e){
        next(e);
      }
    }
)


module.exports = router;