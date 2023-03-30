import Supplier from "../models/SupplierModel.js";

export const getSuppliers = async(req, res) =>{
    try {
        const response = await Supplier.findAll();
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
 
export const getSupplierById = async(req, res) =>{
    try {
        const response = await Supplier.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!response){
            return res.status(400).json({
                statusCode:"200",
                message:"Supplier Not Found",
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
 
export const createSupplier = async(req, res) =>{
    try {
        const {supplierName, address} = req.body;
        // Validate Request
        if(!supplierName){
            return res.status(400).json({
                statusCode:"200",
                message:"Supplier name is required",
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

        let supplier = await Supplier.create({
            supplierName : supplierName,
            address : address
        });
        return res.status(201).json({
            statusCode:"200",
            message:"Supplier Created",
            data:supplier
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
 
export const updateSupplier = async(req, res) =>{
    try {
        const {supplierName, address} = req.body;
        // Validate Request
        if(!supplierName){
            return res.status(400).json({
                statusCode:"200",
                message:"Supplier name is required",
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

        const response = await Supplier.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!response){
            return res.status(400).json({
                statusCode:"200",
                message:"Supplier not found",
                data:[]
            });
        }
        
        let supplier = await Supplier.update({
            supplierName : supplierName,
            address : address
        },{
            where:{
                id: req.params.id
            }
        });
        return res.status(200).json({
            statusCode:"200",
            message:"Supplier Updated",
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
 
export const deleteSupplier = async(req, res) =>{
    try {
        const response = await Supplier.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!response)
        return res.status(400).json({
            statusCode:"200",
            message:"Supplier not found",
            data:[]
        });
        let supplier = await Supplier.destroy({
            where:{
                id: req.params.id
            }
        });
        return res.status(200).json({
            statusCode:"200",
            message:"Supplier Deleted",
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
