'use strict';

const serverless = require('serverless-http');
const AWS = require('aws-sdk');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hi from ExpressJS :)');
});

app.post('/users', (req, res) => {
    const { userId, name } = req.body;

    const params = {
        TableName: USERS_TABLE,
        Item: {
            userId,
            name,
        },
    };

    dynamoDB.put(params, (error) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Cannot create user' });
        } else {
            console.log('User inserted');
            res.json({ userId, name });
        }
    });
});

app.get('/users', (req, res) => {
    const params = {
        TableName: USERS_TABLE,
    };

    dynamoDB.scan(params, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Cannot read users' });
        } else {
            const { Items } = result;
            res.json({
                success: true,
                message: 'Users loaded',
                result: Items,
            });
        }
    });
});

app.get('/users/:userId', (req, res) => {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            // Esta key (userId) la hemos definido en el esquema (KeySchema)
            // de la plantilla de .yml y hay que respetarla
            userId: req.params.userId,
        },
    };

    dynamoDB.get(params, (error, result) => {
        if (error) {
            console.log(error);
            return res
                .status(400)
                .json({ error: 'Cannot execute the query to found a single user' });
        }

        if (result.Item) {
            const { userId, name } = result.Item;
            return res.json({ userId, name });
        } else {
            return res.status(404).json({ error: `User not found` });
        }
    });
});

module.exports.generic = serverless(app);
