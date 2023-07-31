import { blogsModel } from "../models/blogs.js";
import { UserClientModel } from "../models/userClient.js";
import { validateBlogPost } from "../validation/blogsValidation.js";
import fs from "fs";
import path from "path";
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
      console.log(req.body);
      let validBody = validateBlogPost(req.body);

      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
      }

      const file = req.files.myFile;

      if (!file) {
        // check for req.file separately
        return res
          .status(400)
          .json({ err: "You need to send cover for this post" });
      }

      let newPost = new blogsModel(req.body);
      newPost.userRef = id;

      await newPost.save();

      let postId = newPost._id;

      if (!postId) {
        return res.status(400).json("Post not created");
      }

      // Check that the file size is not greater than 5MB
      if (file.size >= 1024 * 1024 * 5) {
        return res.status(400).json({ err: "File too large: max 5 MB" });
      }
      console.log(file);
      // Check that only certain image file extensions are allowed (e.g., .jpg, .png, .jpeg)
      const allowedExtensions = [".jpg", ".jpeg", ".png"];
      // Get the file extension
      const fileExtension = path.extname(file.name);
      // console.log(!allowedExtensions.includes(fileExtension), file.name);
      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({
          err: "You can only upload image files in format of .jpg, .png, .jpeg",
        });
      }
      // Upload the file
      // To make the file unique, use the user's ID and the current date in the filename
      const dirPath = path.join(
        "public",
        "images",
        "users",
        id.toString(),
        "posts"
      );
      const fileUrl = path.join(dirPath, `${postId + fileExtension}`);

      // Check if directory exists, if not, create it
      fs.promises
        .mkdir(dirPath, { recursive: true })
        .then(() => {
          file.mv(fileUrl, (err) => {
            if (err) {
              return res.status(400).json({ err });
            }
          });
        })
        .then(() => {
          const excludedPath = fileUrl.replace(
            new RegExp(`^public\\${path.sep}`),
            ""
          );

          newPost.cover = excludedPath;
          console.log(excludedPath);
          newPost.save();
          let idToSend = newPost._id;
          res.json({ msg: "Post created", idToSend, excludedPath });
        })

        .catch((err) => {
          console.log(err);
          res.status(502).json({ err });
        });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
};

export default blogsController;
