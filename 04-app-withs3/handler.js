'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const multer = require('multer');
const multerS3 = require('multer-s3');

// Tenemos que instalar la version de multer que concuerde
// con la version de AWS-SDK. MUY IMPORTANTE!!!!!!

// Tambien darles todos los permisos de escritura en el bucket en AWS

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.bucket,
        key: (req, file, cb) => {
            const fileExtension = file.originalname.split('.')[1];
            cb(null, `${Date.now().toString()}.${fileExtension}`);
        },
    }),
}).single('photo');

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log('Error:', err);
            res.status(500).json({ error: err });
        } else {
            console.log('File upload succesfully');
            res.status(200).json({ message: 'File upload succesfully' });
        }
    });
});

module.exports.app = serverless(app);
