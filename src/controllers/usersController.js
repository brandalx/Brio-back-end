import { UserClientModel } from "../models/userClient.js";
import bcrypt from "bcrypt";
import express from "express";

import {
  validateUserClientAddress,
  validateUserClientCard,
  validateUserClientData,
  validateUserClientCart,
  validateUserPost,
  validateUserLogin,
  validateUserSecurity,
  validateUserClientAddressToDelete,
  validateUserClientAddressPut,
  validateUserClientCardPut,
  validateUserClientCardToDelete,
  validateUserClientCartItemToDelete,
} from "../validation/userClientValidation.js";

import { createToken } from "../services/token.js";
import { productsModel } from "../models/products.js";
import fs from "fs";
import path from "path";
import Admin from "../models/userSeller.js";
import mongoose from "mongoose";
import Restaurants from "../models/restaurants.js";
import jwt from "jsonwebtoken";

const usersController = {
  randomStars() {
    let numOfStars = Math.floor(Math.random() * 4) + 6;
    return "*".repeat(numOfStars);
  },
  getUsers(req, res) {
    try {
      res.json({ message: "Users endpoint" });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },

  async GetPreSummary(req, res) {
    try {
      const id = req.tokenData._id;
      if (!id) {
        return res.status(400).json({ error: "token id required" });
      }

      let user = await UserClientModel.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.cart) {
        return res.status(404).json({ error: "Cart data not found" });
      }

      let products = [];
      for (let item of user.cart) {
        console.log(item.productId);
        let product = await productsModel.findById(item.productId);
        if (product) {
          product.price = product.price * item.productAmount;

          products.push(product);
        } else {
          products.push(null);
        }
      }

      let presummary = products.reduce((total, item) => {
        return (total += item ? item.price : 0);
      }, 0);
      let shipping = 5;
      res.json({
        subtotal: presummary.toFixed(2),
        shipping: presummary > 0 ? shipping.toFixed(2) : 0, //will be replaced by restaurant later
        totalAmount: (shipping + presummary).toFixed(2),
      });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err: err.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      let data = await UserClientModel.find({});
      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },

  async getUserById(req, res) {
    const id = req.tokenData._id;
    if (!id) {
      res.status(200).json({ error: "token id required" });
    }
    const currentUserId = req.tokenData._id;
    const requestedUserId = req.params.id;
    const token = req.headers["x-api-key"];

    jwt.verify(token, process.env.TOKENSECRET1, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token." });
      } else {
        console.log(decoded);
      }
    });

    try {
      if (currentUserId !== requestedUserId && req.tokenData.role !== "ADMIN") {
        return res.status(403).json({
          message: "You do not have permission to view this profile.",
        });
      }
      let data = await UserClientModel.findById({ _id: requestedUserId });
      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },

  async getUserCart(req, res) {
    let idParams = req.params.id;

    try {
      let user = await UserClientModel.findById(idParams);
      if (user) {
        let data = user.cart;
        res.json({ cart: data });
      } else {
        res.status(404).json({ error: "Cart data not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },
  async getUserAddress(req, res) {
    let idParams = req.params.id;

    try {
      let user = await UserClientModel.findById(idParams);
      if (user) {
        let data = user.address;
        res.json({ cart: data });
      } else {
        res.status(404).json({ error: "Address data not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },
  async getUserCreditData(req, res) {
    let idParams = req.params.id;
    if (idParams != req.tokenData._id) {
      res.status(200).json({ error: "token id does not matches" });
    }
    try {
      let user = await UserClientModel.findById(idParams);
      if (user) {
        let data = user.creditdata;
        res.json({ creditdata: data });
      } else {
        res.status(404).json({ error: "Address data not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },
  async getUserOrders(req, res) {
    const id = req.tokenData._id;
    if (!id) {
      res.status(200).json({ error: "token id required" });
    }

    try {
      let user = await UserClientModel.findById(tokenDataId);
      if (user) {
        let data = user.orders;
        res.json({ orders: data });
      } else {
        res.status(404).json({ error: "Orders data not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },

  async putUserData(req, res) {
    const id = req.tokenData._id;
    if (!id) {
      res.status(200).json({ error: "token id required" });
    }

    try {
      let user = await UserClientModel.findOne({ _id: id });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }

      // todo: pass auth middleware

      let validBody = validateUserClientData(req.body);
      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
      }

      let data = await UserClientModel.updateOne({ _id: id }, req.body);

      return res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },
  async postUserAddress(req, res) {
    // const id = req.params.id;

    const id = req.tokenData._id;
    if (!id) {
      res.status(200).json({ error: "token id required" });
    }

    try {
      let user = await UserClientModel.findOne({ _id: id });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }

      // todo: pass auth middleware

      let validBody = validateUserClientAddress(req.body);
      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
      }

      // Check if the same address exists in the array
      const existingAddress = user.address.find((address) => {
        // Compare the individual address fields
        return (
          address.country === req.body.country &&
          address.state === req.body.state &&
          address.city === req.body.city &&
          address.address1 === req.body.address1 &&
          address.address2 === req.body.address2
        );
      });

      if (existingAddress) {
        return res.status(400).json({ err: "Address already exists" });
      }

      user.address.push(req.body);
      await user.save();

      console.log(user.address);
      res.status(201).json({ msg: true });
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },

  async putUserAddress(req, res) {
    const id = req.tokenData._id;
    if (!id) {
      res.status(200).json({ error: "token id required" });
    }

    try {
      let user = await UserClientModel.findOne({ _id: id });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }

      let validBody = validateUserClientAddressPut(req.body);
      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
      }
      const addressId = req.body._id; // keep it as string
      const addressIndex = user.address.findIndex((item) => {
        return item._id.toString() === addressId; // convert ObjectId to string for comparison
      });

      if (addressIndex === -1) {
        return res.status(502).json({ err: "Address not found" });
      }

      user.address[addressIndex] = req.body;
      await user.save();
      return res.status(201).json({ msg: true });
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },

  async deleteUserAddress(req, res) {
    const id = req.tokenData._id;
    if (!id) {
      res.status(200).json({ error: "token id required" });
    }

    try {
      const addressId = req.body.addressToDelete;
      let user = await UserClientModel.findOne({ _id: id });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }

      let validBody = validateUserClientAddressToDelete(req.body);
      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
      }
      console.log(user.address);

      const existingAddress = user.address.find((item) => {
        return item._id.toString() === addressId.toString();
      });

      if (!existingAddress) {
        return res.status(400).json({ err: "Address does not exist" });
      }

      const addressIndex = user.address.indexOf(existingAddress);
      user.address.splice(addressIndex, 1);

      await user.save();

      res.status(200).json({ msg: true });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },

  async deleteUserCard(req, res) {
    const id = req.tokenData._id;
    if (!id) {
      res.status(200).json({ error: "token id required" });
    }

    try {
      const cardId = req.body.cardToDelete;
      let user = await UserClientModel.findOne({ _id: id });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }

      let validBody = validateUserClientCardToDelete(req.body);
      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
      }

      const existingCard = user.creditdata.find((item) => {
        return item._id.toString() === cardId.toString();
      });

      if (!existingCard) {
        return res.status(400).json({ err: "Card does not exist" });
      }

      const cardIndex = user.creditdata.indexOf(existingCard);
      user.creditdata.splice(cardIndex, 1);

      await user.save();

      res.status(200).json({ msg: true });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  //todo: add bcrypt

  async deleteItemCart(req, res) {
    try {
      const itemId = req.body.itemToDelete;

      const id = req.tokenData._id;
      if (!id) {
        res.status(200).json({ error: "token id required" });
      }

      let user = await UserClientModel.findOne({ _id: id });

      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }

      let validBody = validateUserClientCartItemToDelete(req.body);
      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
      }

      console.log(itemId);
      const existingItem = user.cart.find((item) => {
        return item._id.toString() === itemId.toString();
      });

      if (!existingItem) {
        return res.status(400).json({ err: "Item does not exist" });
      }

      const itemIndex = user.cart.indexOf(existingItem);
      user.cart.splice(itemIndex, 1);

      await user.save();

      res.status(200).json({ msg: true });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },

  async putUserCard(req, res) {
    const id = req.tokenData._id;
    if (!id) {
      res.status(200).json({ error: "token id required" });
    }

    try {
      let user = await UserClientModel.findOne({ _id: id });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }

      let validBody = validateUserClientCardPut(req.body);
      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
      }
      const cardId = req.body._id;
      const cardIndex = user.creditdata.findIndex((item) => {
        return item._id.toString() === cardId;
      });

      if (cardIndex === -1) {
        return res.status(502).json({ err: "Address not found" });
      }

      user.creditdata[cardIndex] = req.body;
      await user.save();
      return res.status(201).json({ msg: true });
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },
  //todo: add bcrypt
  async postUserCard(req, res) {
    const id = req.tokenData._id;
    if (!id) {
      res.status(200).json({ error: "token id required" });
    }

    try {
      let user = await UserClientModel.findOne({ _id: id });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }

      // todo: pass auth middleware

      let validBody = validateUserClientCard(req.body);
      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
      }

      // Check if the same card exists in the array
      const existingCard = user.creditdata.find((card) => {
        // Compare the individual card fields
        return card.cardNumber === req.body.cardNumber;
      });

      if (existingCard) {
        return res
          .status(400)
          .json({ err: "Such payment method already exists" });
      }

      user.creditdata.push(req.body);
      await user.save();

      console.log(user.creditdata);
      res.status(201).json({ msg: true });
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },
  async postToCart(req, res) {
    const idParams = req.params.id;
    const id = req.tokenData._id;

    try {
      if (id != idParams) {
        return res.status(401).json({ err: "User does not match" });
      }
      let user = await UserClientModel.findOne({ _id: idParams });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }

      // todo: pass auth middleware

      let validBody = validateUserClientCart(req.body);
      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
      }

      if (req.body.productAmount <= 0) {
        return res.status(400).json({ error: "amount is cannot be 0 or less" });
      }

      // is if the same product id exists
      const existingProductIndex = user.cart.findIndex((cart) => {
        // finding product
        return cart.productId === req.body.productId;
      });

      if (existingProductIndex !== -1) {
        // Update the existing product object in the cart array
        user.cart[existingProductIndex] = req.body;
        await user.save();

        let user2 = await UserClientModel.findOne({ _id: idParams });

        return res
          .status(201)
          .json({ msg: true, _id: user2.cart[existingProductIndex]._id });
      }
      //if not keeping going

      user.cart.push(req.body);
      await user.save();

      console.log(user.cart);
      res.status(201).json({ msg: true });
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },

  async postUser(req, res) {
    let validBody = validateUserPost(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    if (req.body.password != req.body.confirmpassword) {
      return res
        .status(400)
        .json({ err: "password not the same as confirmed password" });
    }
    let desfineType;
    if (req.body.type === "personal") {
      desfineType = "USER";
    } else if (req.body.type === "restaurant") {
      desfineType = "ADMIN";
    } else {
      return res.status(502).json({ err: "account type error" });
    }

    try {
      // Initialize a base object with default values
      let baseUser = {
        firstname: "",
        lastname: "",
        email: "",
        birthdate: null,
        nickname: req.body.email,
        avatar: "",
        password: "",
        cart: [],
        comments: [],
        rate: [],
        address: [],
        creditdata: [],
        orders: [],
        role: desfineType,
        favorites: [],
        phone: "",
        emailnotifications: false,
      };

      // Merge base object with request body
      let userBody = { ...baseUser, ...req.body };

      let user = new UserClientModel(userBody);

      user.password = await bcrypt.hash(user.password, 10);
      user = await user.save();
      user.password = usersController.randomStars();
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
      if (err.code == 11000) {
        return res.status(400).json({
          msg: "This email is already exist in our system, please try log in again ",
          code: 11000,
        });
      }
      console.log(err);
      return res.status(502).json({ err });
    }
  },
  async getUserInfo(req, res) {
    try {
      let user = await UserClientModel.findOne(
        { _id: req.tokenData._id },
        //deletes password from resposnse
        { password: 0 }
      );
      let excludedCardsArr = [];
      user.creditdata.map((item) => {
        let num = item.cardNumber.length - 4;
        let star = "*".repeat(num) + item.cardNumber.slice(-4);

        item.cardNumber = star;
      });

      res.json(user);
    } catch (err) {
      console.log(err);

      return res.status(502).json({ err });
    }
  },

  async getUserPublicInfo(req, res) {
    const id = req.params.id;
    try {
      let user = await UserClientModel.findOne(
        { _id: id },
        //deletes password from resposnse
        {
          password: 0,
          cart: 0,
          orders: 0,
          birthdate: 0,
          nickname: 0,

          address: 0,
          creditdata: 0,
          role: 0,
          favorites: 0,
          phone: 0,
          emailnotifications: 0,
          date_created: 0,
          notes: 0,
        }
      );

      res.json(user);
    } catch (err) {
      console.log(err);

      return res.status(502).json({ err });
    }
  },
  async postLogin(req, res) {
    let validBody = validateUserLogin(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let user = await UserClientModel.findOne({ email: req.body.email });

      if (!user) {
        return res
          .status(401)
          .json({ err: "Email not found / user dont exist" });
      }

      console.log(`Entered password: ${req.body.password}`);
      console.log(`Hashed password in DB: ${user.password}`);

      let validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      console.log(`Result of password comparison: ${validPassword}`);

      if (!validPassword) {
        return res
          .status(401)
          .json({ err: "Password you're entered is wrong" });
      }

      let newToken = createToken(user._id, user.role);

      res.json({ token: newToken });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },

  async putUserSecurity(req, res) {
    // Validate user input using Joi schema
    const validBody = validateUserSecurity(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    // const id = req.params.id;

    const tokenDataId = req.tokenData._id;

    // Find the user by ID from token
    let user = await UserClientModel.findOne({ _id: req.tokenData._id });
    if (!user) {
      return res.status(401).json({ err: "Email not found / user dont exist" });
    }

    if (req.body.password != req.body.confirmpassword) {
      return res
        .status(400)
        .json({ err: "password not the same as confirmed password" });
    }

    let validPassword = await bcrypt.compare(
      req.body.previouspassword,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        err: "Password you're provided does not matches with previous password",
      });
    }

    try {
      // Hash the users new password before updating
      const passwordHash = await bcrypt.hash(req.body.password, 10);
      req.body.password = passwordHash;

      // Update the user details
      const data = await UserClientModel.updateOne(
        { _id: tokenDataId },
        req.body
      );
      user.password = usersController.randomStars();
      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },

  async postUserNotes(req, res) {
    const id = req.params.id;

    try {
      let user = await UserClientModel.findOne({ _id: id });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }

      // todo: pass auth middleware

      // Assuming req.body has a notes field that we want to update
      if (!req.body.notes) {
        return res.status(400).json({ err: "Missing notes in request body" });
      }

      user.notes = req.body.notes;
      await user.save();

      res.status(201).json({ msg: true });
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },

  async postUserAvatar(req, res) {
    const id = req.tokenData._id;
    if (!id) {
      res.status(200).json({ error: "token id required" });
    }

    try {
      let user = await UserClientModel.findOne({ _id: id });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }
      console.log(req.files.myFile);
      const file = req.files.myFile;
      console.log(file);
      if (!file) {
        return res
          .status(400)
          .json({ err: "You need to send file to this endpoint" });
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
        "avatars"
      );
      const fileUrl = path.join(dirPath, `avatar${fileExtension}`);

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

          user.avatar = excludedPath;
          console.log(excludedPath);
          user.save();
          res.json({ msg: "File uploaded", excludedPath });
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

  async postNewAdmin(req, res) {
    const { adminData } = req.body;

    if (!adminData) {
      return res.status(400).json({ error: "Missing admin data" });
    }

    if (adminData.password !== adminData.confirmpassword) {
      return res
        .status(400)
        .json({ error: "password not the same as confirmed password" });
    }

    const role = "ADMIN";

    try {
      let baseAdmin = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        phone: "",
        restaurantId: "",
        role: role,
      };

      let adminBody = { ...baseAdmin, ...adminData };

      let admin = new UserClientModel(adminBody);

      admin.password = await bcrypt.hash(admin.password, 10);
      const savedAdmin = await admin.save();

      if (!savedAdmin._id) {
        return res.status(500).json({ error: "Could not create admin" });
      }

      savedAdmin.password = "****";

      return res.status(201).json({
        message: "Admin successfully created",
        admin: savedAdmin,
      });
    } catch (err) {
      console.log(err);
      if (err.code == 11000) {
        return res.status(400).json({
          msg: "This email is already exist in our system, please try log in again ",
          code: 11000,
        });
      }
      console.log(err);
      return res.status(502).json({ err });
    }
  },
};

export default usersController;
