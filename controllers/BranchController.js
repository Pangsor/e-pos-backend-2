import Branch from "../models/BranchModel.js";

export const getBranchs = async(req, res) =>{
    try {
        const response = await Branch.findAll();
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
 
export const getBranchById = async(req, res) =>{
    try {
        const response = await Branch.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!response){
            return res.status(400).json({
                statusCode:"200",
                message:"Branch Not Found",
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
 
export const createBranch = async(req, res) =>{
    try {
        const {branchName, address} = req.body;
        // Validate Request
        if(!branchName){
            return res.status(400).json({
                statusCode:"200",
                message:"branchName is required",
                data:[]
            });
        }
        if(!address){
            return res.status(400).json({
                statusCode:"200",
                message:"Address is required",
                data:[]
            });
        }
        // Validate Request

        let branch = await Branch.create({
            branchName : branchName,
            address : address
        });
        return res.status(201).json({
            statusCode:"200",
            message:"Branch Created",
            data:branch
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
 
export const updateBranch = async(req, res) =>{
    try {
        const {branchName, address} = req.body;
        // Validate Request
        if(!branchName){
            return res.status(400).json({
                statusCode:"200",
                message:"branchName is required",
                data:[]
            });
        }
        if(!address){
            return res.status(400).json({
                statusCode:"200",
                message:"Address is required",
                data:[]
            });
        }
        // Validate Request

        const response = await Branch.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!response){
            return res.status(400).json({
                statusCode:"200",
                message:"Branch not found",
                data:[]
            });
        }
        
        let branch = await Branch.update({
            branchName : branchName,
            address : address
        },{
            where:{
                id: req.params.id
            }
        });
        return res.status(200).json({
            statusCode:"200",
            message:"Branch Updated",
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
 
export const deleteBranch = async(req, res) =>{
    try {
        const response = await Branch.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!response)
        return res.status(400).json({
            statusCode:"200",
            message:"Branch not found",
            data:[]
        });
        let branch = await Branch.destroy({
            where:{
                id: req.params.id
            }
        });
        return res.status(200).json({
            statusCode:"200",
            message:"Branch Deleted",
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
