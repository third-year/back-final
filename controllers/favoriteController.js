const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Favorite = require("./../models/favoriteModel");

//// GET ALL FAVORITE
exports.getAllFavorite = catchAsync(async (req, res, next) => {
  let filter = {};
if(req.params.userId) filter = {user:req.params.userId};
  const favorites = await Favorite.find(filter);

  res.status(200).json({
    satuts: "success",
    results: favorites.length,
    data: {
      favorites,
    },
  });
});

/////ADD FAVORITE
exports.createFavorite = catchAsync(async (req, res, next) => {
  const newFavorite = await Favorite.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      favorites: newFavorite,
    },
  });
});

////////////////////////// DELETE FAVORITE
exports.deleteFavorite = catchAsync(async (req, res, next) => {
  const favorite =await Favorite.findByIdAndDelete(req.params.id);
  if(!favorite){
    return new AppError('The Review not exists',404);
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
