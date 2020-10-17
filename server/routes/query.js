// https://medium.com/swlh/run-python-script-from-node-js-and-send-data-to-browser-15677fcf199f
const express = require('express');
const router = express.Router();
let {PythonShell} = require('python-shell');

/* Query satellite */
router.get('/', function (req, res, next) {
    let options = {
        pythonPath: 'python',
        args: ["2014", "6", "7", "2014", "6", "8"]
    };
    PythonShell.run('server/query_engine/script.py', options, function (err, results) {
        if (err) throw err;
        console.log('results: %j', results);
        res.json(results);
    })
});

module.exports = router;

