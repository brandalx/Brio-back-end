import { UserClientModel } from "../models/userClient.js";
import bcrypt from "bcrypt";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import sgMail from "@sendgrid/mail";
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
  validateUserRecoveryBody,
  validateUserResetBody,
} from "../validation/userClientValidation.js";

import { createToken } from "../services/token.js";
import { productsModel } from "../models/products.js";
import fs from "fs";
import path from "path";
import Admin from "../models/userSeller.js";
import mongoose from "mongoose";
import Restaurants from "../models/restaurants.js";
import jwt from "jsonwebtoken";
import { tokenSecret1, tokenSendGrid } from "../configs/config.js";

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
      let user = req.user;
      if (!user.cart) {
        return res.status(404).json({ error: "Cart data not found" });
      }

      let products = [];
      for (let item of user.cart) {
        console.log(item.productId);
        let product = await productsModel.findById(item.productId);
        if (product) {
          console.log("Product price:", product.price);
          console.log("Product amount:", item.productAmount);
          let prices = product.price * item.productAmount;
          console.log("Total price:", prices);
          product.price = prices;
          console.log(product);
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

  async handleUserSendRecoverChange(req, res) {
    try {
      let validBody = validateUserResetBody(req.body);
      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
      }

      if (req.body.password != req.body.confirmpassword) {
        return res.status(400).json({ error: "password does not match" });
      }

      let isTokenCorrect = jwt.verify(req.body.token, tokenSecret1);

      if (!isTokenCorrect) {
        return res.status(400).json({ error: "time expired" });
      }

      let user = await UserClientModel.findOne({
        uuidToRecover: isTokenCorrect._id,
      });

      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }
      let hashedPassword = await bcrypt.hash(req.body.password, 10);
      await UserClientModel.updateOne(
        { uuidToRecover: isTokenCorrect._id },
        {
          password: hashedPassword,
          uuidToRecover: "",
        }
      );

      let newToken = createToken(user._id, user.role);

      res.status(201).json({ msg: true, token: newToken });
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },

  async handleUserRecoverRequest(req, res) {
    try {
      console.log(req.body);
      let validBody = validateUserRecoveryBody(req.body);
      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
      }
      let user = await UserClientModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }

      if (user.phone != req.body.phone) {
        return res.status(401).json({ err: "User not found" });
      }

      const uuid = uuidv4();
      user.uuidToRecover = uuid;
      await user.save();

      let newToken = createToken(uuid, "recovery", "5min");

      res.status(201).json({ msg: true, token: newToken });
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
    console.log(req.body.password);
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
        uuidToRecover: "",
      };

      // Merge base object with request body
      let userBody = { ...baseUser, ...req.body };

      let user = new UserClientModel(userBody);

      user.password = await bcrypt.hash(user.password, 10);
      console.log(req.body.password);
      console.log(user.password);
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

      // console.log(`Entered password: ${req.body.password}`);
      // console.log(`Hashed password in DB: ${user.password}`);

      let validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      // console.log(`Result of password comparison: ${validPassword}`);

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

  async clearUserCart(req, res) {
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

      user.cart = [];

      await user.save();
      res.json({ msg: true });
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

  async sendVerificationEmail(email, verificationCode) {
    sgMail.setApiKey(tokenSendGrid);

    const msg = {
      to: email,
      from: "briofooddelivery@gmail.com",
      subject: "Email Verification",
      text: `Your verification code is: ${verificationCode}`,
      html: ` 
      
      
      
      <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=Edge">
      <!--<![endif]-->
      <!--[if (gte mso 9)|(IE)]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <!--[if (gte mso 9)|(IE)]>
  <style type="text/css">
    body {width: 700px;margin: 0 auto;}
    table {border-collapse: collapse;}
    table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
    img {-ms-interpolation-mode: bicubic;}
  </style>
<![endif]-->
      <style type="text/css">
    body, p, div {
      font-family: arial,helvetica,sans-serif;
      font-size: 14px;
    }
    body {
      color: #000000;
    }
    body a {
      color: #1188E6;
      text-decoration: none;
    }
    p { margin: 0; padding: 0; }
    table.wrapper {
      width:100% !important;
      table-layout: fixed;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    img.max-width {
      max-width: 100% !important;
    }
    .column.of-2 {
      width: 50%;
    }
    .column.of-3 {
      width: 33.333%;
    }
    .column.of-4 {
      width: 25%;
    }
    ul ul ul ul  {
      list-style-type: disc !important;
    }
    ol ol {
      list-style-type: lower-roman !important;
    }
    ol ol ol {
      list-style-type: lower-latin !important;
    }
    ol ol ol ol {
      list-style-type: decimal !important;
    }
    @media screen and (max-width:480px) {
      .preheader .rightColumnContent,
      .footer .rightColumnContent {
        text-align: left !important;
      }
      .preheader .rightColumnContent div,
      .preheader .rightColumnContent span,
      .footer .rightColumnContent div,
      .footer .rightColumnContent span {
        text-align: left !important;
      }
      .preheader .rightColumnContent,
      .preheader .leftColumnContent {
        font-size: 80% !important;
        padding: 5px 0;
      }
      table.wrapper-mobile {
        width: 100% !important;
        table-layout: fixed;
      }
      img.max-width {
        height: auto !important;
        max-width: 100% !important;
      }
      a.bulletproof-button {
        display: block !important;
        width: auto !important;
        font-size: 80%;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .columns {
        width: 100% !important;
      }
      .column {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      .social-icon-column {
        display: inline-block !important;
      }
    }
  </style>
      <!--user entered Head Start--><!--End Head user entered-->
    </head>
    <body>
      <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#5349ff;">
        <div class="webkit">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#5349ff">
            <tbody><tr>
              <td valign="top" bgcolor="#5349ff" width="100%">
                <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tbody><tr>
                    <td width="100%">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tbody><tr>
                          <td>
                            <!--[if mso]>
    <center>
    <table><tr><td width="700">
  <![endif]-->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:700px;" align="center">
                                      <tbody><tr>
                                        <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#F3F6FF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
    <tbody><tr>
      <td role="module-content">
        <p>Follow this step to recover your account</p>
      </td>
    </tr>
  </tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="17761d99-860c-4f1f-aeb0-be55796d7adf" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:15px 60px 10px 60px; line-height:12px; text-align:inherit; background-color:#4967ff;" height="100%" valign="top" bgcolor="#4967ff" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-family: &quot;lucida sans unicode&quot;, &quot;lucida grande&quot;, sans-serif; color: #f3f6ff; font-size: 10px">Email not displaying correctly? </span><span style="font-family: &quot;lucida sans unicode&quot;, &quot;lucida grande&quot;, sans-serif; color: #1c2c7b; font-size: 10px"><u>View it</u></span><span style="font-family: &quot;lucida sans unicode&quot;, &quot;lucida grande&quot;, sans-serif; color: #f3f6ff; font-size: 10px"> in your browser.</span></div><div></div></div></td>
      </tr>
    </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 30px 20px 30px;" bgcolor="#ffffff" data-distribution="1">
    <tbody>
      <tr role="module-content">
        <td height="100%" valign="top"><table width="280" style="width:280px; border-spacing:0; border-collapse:collapse; margin:0px 180px 0px 180px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
      <tbody>
        <tr>
          <td style="padding:0px;margin:0px;border-spacing:0;"><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="8710905a-e942-4b46-a460-0799e4faf5c2">
    <tbody>
      <tr>
        <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" width="280" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/27548861a3bba7f7/61a4e97a-be71-46b4-8f5a-054a2a57179b/1052x439.png">
        </td>
      </tr>
    </tbody>
  </table></td>
        </tr>
      </tbody>
    </table></td>
      </tr>
    </tbody>
  </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="6e0d4f99-4ac1-47a7-8681-b39ea8ee64e3">
    <tbody>
      <tr>
        <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" width="700" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/27548861a3bba7f7/7a90bd88-1f04-448b-b2af-19f94a862f29/1920x1146.jpg">
        </td>
      </tr>
    </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:0px 5px 15px 5px;" bgcolor="" data-distribution="1">
    <tbody>
      <tr role="module-content">
        <td height="100%" valign="top"><table width="690" style="width:690px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
      <tbody>
        <tr>
          <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a5ee1b9d-aacf-476c-ad72-fa1f2d816f12" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:30px 0px 0px 0px; line-height:50px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><h1 style="text-align: center; font-family: inherit"><span style="font-family: &quot;lucida sans unicode&quot;, &quot;lucida grande&quot;, sans-serif; font-size: 60px; color: #4e60ff"><strong>Thank you!</strong></span></h1><div></div></div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a5ee1b9d-aacf-476c-ad72-fa1f2d816f12.2" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:0px 0px 0px 0px; line-height:24px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-family: &quot;lucida sans unicode&quot;, &quot;lucida grande&quot;, sans-serif; font-size: 20px; color: #000000">Please, follow those steps for recovering your password</span></div><div></div></div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a5ee1b9d-aacf-476c-ad72-fa1f2d816f12.2.1" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:0px 0px 0px 0px; line-height:24px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-family: &quot;lucida sans unicode&quot;, &quot;lucida grande&quot;, sans-serif; font-size: 20px; color: #000000"><strong>Your verification code is: <span style="text-decoration: underline" > ${verificationCode} </span></strong></span></div><div></div></div></td>
      </tr>
    </tbody>
  </table></td>
        </tr>
      </tbody>
    </table></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="9fad6950-fb2c-4904-8bf1-426398c84a27">
    <tbody>
      <tr>
        <td style="padding:0px 0px 15px 0px;" role="module-content" bgcolor="">
        </td>
      </tr>
    </tbody>
  </table></td>
                                      </tr>
                                    </tbody></table>
                                    <!--[if mso]>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <![endif]-->
                          </td>
                        </tr>
                      </tbody></table>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
          </tbody></table>
        </div>
      </center>
    
  </body></html>`,
    };

    // Send the email
    try {
      await sgMail.send(msg);
      console.log("Email sent");
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  },
};

export default usersController;
