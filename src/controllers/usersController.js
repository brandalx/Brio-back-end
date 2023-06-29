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
} from "../validation/userClientValidation.js";

import { createToken } from "../services/token.js";
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
    // let idParams = req.params.id;
    const tokenDataId = req.tokenData._id;

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
    const id = req.params.id;

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

  async postUserCard(req, res) {
    const id = req.params.id;

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
    const id = req.params.id;

    try {
      let user = await UserClientModel.findOne({ _id: id });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }

      // todo: pass auth middleware

      let validBody = validateUserClientCart(req.body);
      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
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
        return res.status(201).json({ msg: true });
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
  // Функция для создания нового админа
  async postNewAdmin(req, res) {
    const { adminData } = req.body;

    // Проверка данных
    if (!adminData) {
      return res.status(400).json({ error: "Missing admin data" });
    }

    // Проверка совпадения пароля
    if (adminData.password !== adminData.confirmpassword) {
      return res
        .status(400)
        .json({ error: "password not the same as confirmed password" });
    }

    // Назначение роли
    const role = "ADMIN";

    try {
      // Инициализация базового объекта со значениями по умолчанию
      let baseAdmin = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        phone: "",
        restaurantId: "",
        role: role,
      };

      // Объединение базового объекта с данными запроса
      let adminBody = { ...baseAdmin, ...adminData };

      let admin = new UserClientModel(adminBody);

      admin.password = await bcrypt.hash(admin.password, 10);
      const savedAdmin = await admin.save();

      // Проверка успешности сохранения админа
      if (!savedAdmin._id) {
        return res.status(500).json({ error: "Could not create admin" });
      }

      savedAdmin.password = "****"; // Замена пароля на звездочки перед отправкой в ответ

      // Возвращение идентификатора нового админа
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
