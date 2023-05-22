const Order = require('./../models/orderModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Product = require('../models/productModel');


//// GET ALL ORDER
exports.getAllOrder = catchAsync(async(req,res,next)=>{

    const orders = await Order.find();
    
    res.status(200).json({
    satuts:"success",
    results:orders.length,
    data:{
        orders
    }
    });
    });

////create order
exports.createOrders = catchAsync(async(req,res,next)=>{

const newOrder = await Order.create(req.body);
//const quantity = await Product.populate('quantity',quantity-1);
        
        res.status(201).json({
            status:"success",
            data:{
                orders: newOrder
            }
        });
        });
    
////////////////////////// UPDATE PRODUCT
exports.updataOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({
      status: "success",
      data: order,
    });
  });
  
////////////////////////// DELETE ORDER
exports.deleteOrder = catchAsync(async (req, res, next) => {

    await  Order.findByIdAndDelete(req.params.id);
      
        res.status(204).json({
          status: "success",
          data: null,
        });
    });
    