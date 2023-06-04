const Product = require("./../models/productModel");

class APIFeatures {
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["sort", "limit", "fields", 'page'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("_createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    } else {
      this.query.select("-__v");
    }
    return this;
  }

  paginate(modelName) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;

    this.query = modelName.paginate(
      {},
      { page: page, limit: limit },
      (err, result) => {
        if (err) {
          return res.status(500);
        }
      }
    );
    return this;
  }
}

module.exports = APIFeatures;
