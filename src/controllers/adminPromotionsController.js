import promotionsModel from "../models/promotions.js";

const promotionsController = {
  async getAllPromotions(req, res) {
    try {
      let data = await promotionsModel.find({});
      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },
  async createPromotion(req, res) {
    console.log("Received:", req.body); // log received data here
    const {
      discountDetails,
      startDate,
      endDate,
      image,
      discountPercent,
      discountProducts,
      restaurantName,
      restaurantRef,
      discountDays,
    } = req.body;

    try {
      const newPromotion = await promotionsModel.create({
        discountDetails,
        startDate,
        endDate,
        image,
        discountPercent,
        discountProducts,
        restaurantName,
        restaurantRef,
        discountDays,
      });
      res.json(newPromotion);
    } catch (err) {
      console.error(err);
      res.status(502).json({ error: err });
    }
  },
};

export default promotionsController;
