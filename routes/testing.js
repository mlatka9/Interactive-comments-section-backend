const router = require('express').Router();

const {clearAll} = require('../controllers/testing');

router.post('/reset', clearAll);

module.exports = router;