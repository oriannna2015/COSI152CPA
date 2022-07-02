var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.use((req, res, next) => {
    console.log("in the index router");
    next();
  }
);

router.get('/bio', 
  (req, res, next) => {
    res.render('bio', { title: 'Bio' });
  }
);

module.exports = router;
