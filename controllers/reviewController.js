const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Review = require("./../models/reviewModel");


//filter function
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };


exports.getAllReview= catchAsync(async(req,res,next)=>{
let filter = {};
if(req.params.productId) filter = {product:req.params.productId};
const reviews = await Review.find(filter);

res.status(200).json({
satuts:"success",
results:reviews.length,
data:{
    reviews
}
});
});


exports.createReview = catchAsync(async(req,res,next)=>{

const newReview = await Review.create(req.body);

res.status(201).json({
    status:"success",
    data:{
        review: newReview
    }
});
});

exports.updataReview = catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(req.body, 'review');

 const updataReview = await User.findByIdAndUpdate(req.review.id, filteredBody, {
  new: true,
  runValidators: true
});

    res.status(200).json({
      status: "success",
      data: review,
    });
  });
  

exports.deleteReview = catchAsync(async (req, res, next) => {
    await Review.findByIdAndDelete(req.params.id);
  
    res.status(204).json({
      status: "success",
      data: null,
    });
});