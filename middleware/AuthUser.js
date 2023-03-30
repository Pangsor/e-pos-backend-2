import User from "../models/UserModel.js";
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.email = decoded.email;
        next();
    })
}

export const verifyToken2 = async (req, res, next) => {
    const auhorizationHeader = req.headers.authorization;
    let result;

    if (!auhorizationHeader) {
        return res.status(401).json({
            statusCode:"200",
            message:"Access token is missing",
            data:[]
        });
    }
    
    const token = req.headers.authorization.split(" ")[1];
    
    const options = {
        expiresIn: "1d",
    };

    try {
        result = jwt.verify(token, process.env.SECRET, options);
        req.decoded = result;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({
                statusCode:"200",
                message:"Token expired",
                data:[]
            });
        }

        return res.status(403).json({
            statusCode:"200",
            message:"Authentication error",
            data:[]
        });
    }
};
  
export const verifyUser = async (req, res, next) =>{
    const user = await User.findOne({
        where: {
            username: req.decoded.username
        }
    });
    if(!user) 
    return res.status(400).json({
        statusCode:"200",
        message:"User Not Found",
        data:[]
    });
    next();
};

export const adminOnly = async (req, res, next) =>{
    const user = await User.findOne({
        where: {
            username: req.decoded.username
        }
    });
    if(!user)
    return res.status(400).json({
        statusCode:"200",
        message:"User Not Found",
        data:[]
    });
    if(user.role.toLowerCase() !== "mgr" && user.role.toLowerCase() !== "own") 
    return res.status(403).json({
        statusCode:"200",
        message:"Forbidden Access",
        data:[]
    });
    next();
};