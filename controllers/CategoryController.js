import Joi from "joi";
import Category from "../models/CategoryModel.js";

export const getCategories = async(req, res) =>{
    try {
        const response = await Category.findAll();
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
 
export const getCategoryById = async(req, res) =>{
    try {
        const response = await Category.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!response){
            return res.status(400).json({
                statusCode:"200",
                message:"Category Not Found",
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
 
export const createCategory = async(req, res) =>{
    try {
        const schema = Joi.object().keys({
            categoryName: Joi.string().required()
        }).required();
        if (schema.validate(req.body).error) {
            return res.status(400).json({
                statusCode:"200",
                message:schema.validate(req.body).error.message,
                data:[]
            });
        }
        const {categoryName} = req.body;

        let category = await Category.create({
            categoryName : categoryName
        });
        return res.status(201).json({
            statusCode:"200",
            message:"Category Created",
            data:category
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
 
export const updateCategory = async(req, res) =>{
    try {
        const schema = Joi.object().keys({
            categoryName: Joi.string().required()
        }).required();
        if (schema.validate(req.body).error) {
            return res.status(400).json({
                statusCode:"200",
                message:schema.validate(req.body).error.message,
                data:[]
            });
        }
        const {categoryName} = req.body;

        const response = await Category.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!response){
            return res.status(400).json({
                statusCode:"200",
                message:"Category not found",
                data:[]
            });
        }
        
        let category = await Category.update({
            categoryName : categoryName
        },{
            where:{
                id: req.params.id
            }
        });
        return res.status(200).json({
            statusCode:"200",
            message:"Category Updated",
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
 
export const deleteCategory = async(req, res) =>{
    try {
        const response = await Category.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!response)
        return res.status(400).json({
            statusCode:"200",
            message:"Category not found",
            data:[]
        });
        await Category.destroy({
            where:{
                id: req.params.id
            }
        });
        return res.status(200).json({
            statusCode:"200",
            message:"Category Deleted",
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
