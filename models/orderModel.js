const mongoose = require("mongoose");
const { lookUpRaw } = require("geojson-places");

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "An order must belong to a product."],
    },
    productOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    orderOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A order must have a User Id."],
    },
    quantitySell: {
      type: Number,
      require: [true, "You must have define qunatity"],
    },
    destinationAddress: {
      type: [Number],
      require: [true, "Must put address"],
    },
    distance: {
      type: Number,
    },
    toBeDelivered: {
      type: Boolean,
      default: false,
    },
    deliveryPrice: {
      type: Number,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual propreties
orderSchema.virtual("destinationAddressInWords").get(function () {
  // latitude/longitude
  const result = lookUpRaw(
    this.destinationAddress[0],
    this.destinationAddress[1]
  );

  if (result) {
    delete result["features"][0]["geometry"];

    const country = result["features"][0]["properties"]["geonunit"];
    const city = result["features"][0]["properties"]["name_en"];
    return { country, city };
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
