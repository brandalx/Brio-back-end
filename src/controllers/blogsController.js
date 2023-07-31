import { blogsModel } from "../models/blogs.js";
import { UserClientModel } from "../models/userClient.js";
import { validateBlogPost } from "../validation/blogsValidation.js";
const blogsController = {
  async getAllBlogs(req, res) {
    try {
      let data = await blogsModel.find({});
      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },

  async getLimitedBlogs(req, res) {
    let perPage = 5;

    let page = req.query.page - 1 || 0;

    let sort = req.query.sort || "_id";

    let desc = req.query.desc == "yes" ? 1 : -1;
    try {
      let data = await blogsModel
        .find({})
        .limit(perPage)
        .skip(page * perPage)
        .sort({ [sort]: desc });
      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },

  async getSearchBlogs(req, res) {
    let querySearch = req.query.s;
    let searchExpression = new RegExp(querySearch, "i");
    try {
      let data = await blogsModel
        .find({
          $or: [{ title: searchExpression }, { description: searchExpression }],
        })
        .limit(20);

      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },

  async getBlogsById(req, res) {
    let idParams = req.params.id;

    try {
      let data = await blogsModel.findById({ _id: idParams });
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ error: "Blog not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },
  async postUserBlog(req, res) {
    try {
      const id = req.tokenData._id;
      if (!id) {
        res.status(200).json({ error: "token id required" });
      }

      let user = await UserClientModel.findOne({ _id: id });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }

      let validBody = validateBlogPost(req.body);
      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
      }

      let newPost = new blogsModel(req.body);
      newPost.userRef = id;

      await newOrder.save();
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
};

export default blogsController;
