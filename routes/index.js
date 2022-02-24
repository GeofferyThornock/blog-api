const express = require('express');
const router = express.Router();
const passport = require("passport");
const jwtStrategry  = require("../middleware/passport")
passport.use(jwtStrategry);

const maincontroller = require('../controllers/mainController');

router.get('/', maincontroller.index_get);
//Viewer Website
router.get('/blog', maincontroller.blog_get);

router.get('/blog/:id', maincontroller.blog_id_get);

router.post('/blog/:id', maincontroller.blog_id_comment_post);

//Blog Owner Website
router.post('/blog_create', passport.authenticate('jwt', {session: false}), maincontroller.blog_create);

router.post('/blog/:id/update', passport.authenticate('jwt', {session: false}), maincontroller.blog_update);

router.post('/blog/:id/delete',passport.authenticate('jwt', {session: false}), maincontroller.blog_delete);


router.post('/', maincontroller.index_test);

module.exports = router;