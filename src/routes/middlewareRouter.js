const express = require('express')
const router = express.Router()
const fileMulter = require('../middleware')

router.post('/upload-book', 
    fileMulter.single('book'),
    (req, res) => {
        if(req.file){
            const {path} = req.file
            res.json({path})
        }
        res.json()
    })
module.exports = router