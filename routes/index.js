var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require('util');
var path = require('path');
var serviceCall = require('./serviceCall');

router.get('/icons', async function (req, res) {
    let errors = [];
    let result;
    try {
        let svgListRespnse = await serviceCall.doServicePostCall(`${process.env.hostname}api/svg/list`);
        if (svgListRespnse.statusCode == 200) {
            result = svgListRespnse.body
        } else {
            errors.push("cant't get the files");
        }
    } catch (err) {
        errors.push(err)
    }
    if (errors.length == 0) {
        res.render('index', { files: result.files, allFiles: result.allFiles, total_count: result.total_count })
    } else {
        res.send({ status: 'ERROR', error: errors })
    }
})

router.get('/',function (req,res) {
    res.render('home');
})



router.post('/:category', async function (req, res) {
    let errors = [];
    let category = {}
    try {
        fs.readdir(path.join(__dirname, `../public/img/icons/${req.params.category}`), (err, data) => {
            if (err) {
                res.send({ status: "ERROR", error: err });
            } else {
                category = {
                    fileNames: data,
                    category: req.params.category
                }
                res.send({ status: "SUCCESS", category });
            }
        })
    } catch (error) {
        errors.push(error);
    }

})


router.get('/svg', async function (req, res) {
    let category = req.query.category;
    let file = req.query.file;
    try {
        let svgResponse = await serviceCall.doServicePostCall(`${process.env.hostname}api/svg/get`, { category: category, file: file });
        if (svgResponse.statusCode == 200) {
            res.send({ status: "SUCCESS", svg: svgResponse.body.svg });
        }
    } catch (error) {
        res.send({ status: "ERROR", error: err });
    }
})



// router.get('/edit', async function (req, res) {

// })

router.get('/loadmore', async  function (req, res) {
    let files;
    let errors = [];
    try {
        let svgListRespnse = await serviceCall.doServicePostCall(`${process.env.hostname}api/svg/list`, { skip: req.query.skip });
        if (svgListRespnse.statusCode == 200) {
            files = svgListRespnse.body.allFiles;
        } else {
            errors.push("cant't get the files");
        }
    } catch (err) {
        errors.push(err)
    }
    if (errors.length == 0) {
        res.send({ status: 'SUCCESS', allFiles: files })
    } else {
        res.send({ status: 'ERROR', 'error': errors });
    }
})


router.get('/editroom', async function (req, res) {
    let category = req.query.category;
    let file = req.query.file;
    let errors = [];
    let svg = '';
    try {
        if (req.query.category) {
            let svgResponse = await serviceCall.doServicePostCall(`${process.env.hostname}api/svg/get`, { category: category, file: file });
            if (svgResponse.statusCode == 200) {
                svg = svgResponse.body.svg
            }
        }
    } catch (error) {
        errors.push(error)
    }
    if (errors.length == 0) {
        res.render('edit-room', { svg: svg });

    } else {
        res.send({ status: "ERROR", error: err });
    }
})



module.exports = router