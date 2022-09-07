var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require('util');
var path = require('path');

router.post('/get', async function (req, res) {
    let category = req.body.category;
    let file = req.body.file;
    fs.readFile(`public/img/icons/${category}/${file}`, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send({ status: "SUCCESS", svg: data.toString() });
        }
    })
})

router.post('/list', async function (req, res) {
    let skip = 0;
    if (req.body.skip) {
        skip = parseInt(req.body.skip);
    }
    let files = [];
    let allFiles = [];
    let total_count = 0;
    try {
        fs.readdirSync(`public/img/icons`).filter(function (category) {
            let filenames = []
            fs.readdirSync(`public/img/icons/${category}`).filter(function (filename) {
                allFiles.push(filename + '+' + category);
                filenames.push(filename);
            });
            total_count += filenames.length;
            files.push({ filenames: filenames, category: category })
        });
        files = files.sort((a, b) => {
            if (a.category < b.category)
                return -1;
            if (a.category > b.category)
                return 1;
            return 0;
        });
        res.send({ status: 'SUCCESS', files, allFiles: allFiles.slice(skip, 200 + skip), total_count })
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;