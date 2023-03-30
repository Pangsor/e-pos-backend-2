import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();
export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll();
        return res.status(200).json({
            statusCode:"200",
            message:"OK",
            data:response
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
 
export const getUserById = async(req, res) =>{
    try {
        const response = await User.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!response){
            return res.status(400).json({
                statusCode:"200",
                message:"User Not Found",
                data:[]
            });
        }
        return res.status(200).json({
            statusCode:"200",
            message:"OK",
            data:response
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
 
export const createUser = async(req, res) =>{
    try {
        const {nama_user, username, password, retrypePassword, role} = req.body;
        // Validate Request
        if(!nama_user){
            return res.status(400).json({
                statusCode:"200",
                message:"Nama user is required",
                data:[]
            });
        }
        if(!username){
            return res.status(400).json({
                statusCode:"200",
                message:"Username is required",
                data:[]
            });
        }
        if(!password){
            return res.status(400).json({
                statusCode:"200",
                message:"Password is required",
                data:[]
            });
        }
        if(!retrypePassword){
            return res.status(400).json({
                statusCode:"200",
                message:"Retrype password is required",
                data:[]
            });
        }
        if(!role){
            return res.status(400).json({
                statusCode:"200",
                message:"Role is required",
                data:[]
            });
        }
        if(role.toLowerCase() != "admin" && role.toLowerCase() != "own"){
            return res.status(400).json({
                statusCode:"200",
                message:"Invalid role",
                data:[]
            });
        }
        let roleUser = role.toLowerCase()
        console.log("ROLE AS " + role)
        // Validate Request

        const response = await User.findOne({
            where:{
                username: username
            }
        });
        if(response){
            return res.status(400).json({
                statusCode:"200",
                message:"User Already Exist",
                data:[]
            });
        }
        if(password !== retrypePassword)
        return res.status(400).json({
            statusCode:"200",
            message:"Password and retrype password does not match",
            data:[]
        })
        
        const hashPassword = bcrypt.hashSync(password, 10);
        let user = await User.create({
            nama_user : nama_user,
            username : username,
            password : hashPassword,
            role : roleUser
        });
        return res.status(201).json({
            statusCode:"200",
            message:"User Created",
            data:user
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
 
export const updateUser = async(req, res) =>{
    try {
        const {nama_user, password, role} = req.body;
        let hashPassword;
        // Validate Request
        if(!nama_user){
            return res.status(400).json({
                statusCode:"200",
                message:"Nama user is required",
                data:[]
            });
        }
        if(!role){
            return res.status(400).json({
                statusCode:"200",
                message:"Role is required",
                data:[]
            });
        }
        // Validate Request

        const response = await User.findOne({
            where:{
                username: req.params.id
            }
        });
        if(!response){
            return res.status(400).json({
                statusCode:"200",
                message:"User not found",
                data:[]
            });
        }
        hashPassword = response.password;
        if(password){
            hashPassword = bcrypt.hashSync(password, 10);
        }
        let user = await User.update({
            nama_user : nama_user,
            role : role,
            password : hashPassword
        },{
            where:{
                username: req.params.id
            }
        });
        return res.status(200).json({
            statusCode:"200",
            message:"User Updated",
            data:[]
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
 
export const deleteUser = async(req, res) =>{
    try {
        const response = await User.findOne({
            where: {
                username: req.params.id
            }
        });
        if(!response)
        return res.status(400).json({
            statusCode:"200",
            message:"User not found",
            data:[]
        });
        let user = await User.destroy({
            where:{
                username: req.params.id
            }
        });
        return res.status(200).json({
            statusCode:"200",
            message:"User Deleted",
            data:[]
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}

export const Login = async (req, res) =>{
    const secret = process.env.SECRET;
    const { username, password } = req.body;
    if(!username){
        return res.status(400).json({
            statusCode:"200",
            message:"Username is required",
            data:[]
        });
    }
    if(!password){
        return res.status(400).json({
            statusCode:"200",
            message:"Password is required",
            data:[]
        });
    }
    const user = await User.findOne({
        where: {
            username: username
        }
    });
    if(!user) 
    return res.status(400).json({
        statusCode:"200",
        message:"Invalid username or password",
        data:[]
    });
    
    if(user && bcrypt.compareSync(password, user.password)){
        const token = jwt.sign(
            {
                nama_user: user.nama_user,
                username: user.username,
                role: user.role
            },
            secret,
            {expiresIn : process.env.EXPIREIN_TIME}
        )
        
        res.status(200).json({
            statusCode:"200",
            message:"OK",
            data:[
                {
                    username: user.username,
                    nama_user:user.nama_user,
                    role:user.role,
                    token: token
                }
            ]
        })
    }else{
        return res.status(400).json({
            statusCode:"200",
            message:"Invalid username or password",
            data:[]
        });
    }
}