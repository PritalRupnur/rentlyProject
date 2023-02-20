const jwt = require('jsonwebtoken');
// const userModel = require("../models/userModel")
// const mongoose = require("mongoose")
// const { isValidObjectId } = require("mongoose");

const db = require('../models/index');


const authentication = function(req, res, next) {

    try {
       const bearerHeader = req.headers['authorization'];
        if (!bearerHeader) return res.status(400).send({status: false, message: 'NO token in bearer'});
{
             const bearer = bearerHeader.split(' ');
            
            const bearerToken = bearer[1];


            req.token = bearerToken;
           
            const decodedToken = jwt.verify(req.token, 'trainingProject');

            if (Date.now() > decodedToken.exp * 1000) {
                return res.status(401).send({status: false, message: 'Session Expired'});
            }
            
            req.decodedToken = decodedToken;
            req['tokenUserId'] = decodedToken.userId;
            req.decodedToken = decodedToken;


            next();
        }
    } catch {
        return res.status(401).send({status: false, message: 'authentication failed'});
    }


};
const authorization = async function(req, res, next) {
    try {

      
       
        const userId = req.userId;
        if (req.params.userId) {
            req.userIdFromParam = req.params.userId;
        } else {
            req.userIdFromParam=req.body.userId;

        }
        const id = req.userIdFromParam;
        
        if (req['tokenUserId'] != req.userIdFromParam) return res.status(403).send({message: 'Sorry!! You are not AUTHORISED'});


        req.userByUserId = await db.sequelize.models.user.findOne({where: {id}});
        if (!req.userByUserId) {
            return res.status(404).send({status: false, message: ' User not found!!!'});
        }


        next();
    } catch (err) {
        return res.status(500).send({message: ' Congrats!!, You messesd Up', err: err.message});
    }
};

module.exports = {authentication, authorization};
