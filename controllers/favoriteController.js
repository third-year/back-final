const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Favorite = require("./../models/favoriteModel");

//// GET ALL FAVORITE
exports.getAllFavorite = catchAsync(async (req, res, next) => {
  const favorites = await Favorite.find({ user: req.user.id }).populate('product');

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
  const favorite = await Favorite.findOne({
    product: req.params.productId,
    user: req.user.id,
  });

  if (favorite) {
    return next(
      new AppError("This product is already in your favorite list", 404)
    );
  }

  const newFavorite = await Favorite.create({
    product: req.params.productId,
    user: req.user.id,
  });
  res.status(201).json({
    status: "success",
    data: {
      favorite: newFavorite,
    },
  });
});

////////////////////////// DELETE FAVORITE
exports.deleteFavorite = catchAsync(async (req, res, next) => {
  const favorite = await Favorite.findOneAndDelete({
    product: req.params.productId,
    user: req.user.id,
  });
  if (!favorite) {
    return next(new AppError("The favorite not exists", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
