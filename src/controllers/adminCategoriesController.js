import {categoriesModel} from "../models/categories.js";
const adminCategoriesController = {
    async getAllCategories(req, res) {
        try {
            let data = await categoriesModel.find({});
            res.json(data);
        } catch (err) {
            console.log(err);
            return res.status(502).json({ err });
        }
    },
    async getCategoryById(req, res) {
        let idParams = req.params.id;

        try {
            let data = await categoriesModel.findById({ _id: idParams });
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({ error: "Category not found" });
            }
        } catch (err) {
            console.log(err);
            res.status(502).json({ error: err });
        }
    },
    async createCategory(req, res) {
        const { categoryName, itemsId } = req.body;

        try {
            const newCategory = await categoriesModel.create({
                categoryName,
                itemsId,
            });
            res.json(newCategory);
        } catch (err) {
            console.error(err);
            res.status(502).json({ error: err });
        }
    },
};

export default adminCategoriesController;
