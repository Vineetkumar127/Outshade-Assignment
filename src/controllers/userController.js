const UserModel = require("../models/userModel");
const validator = require("../validation/validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//----------------------------------------------------------------------------------

const createUser = async (req, res) => {
    try {
      if (!validator.isValidRequestBody(req.body))
        return res.status(400).send({ status: false, message: " please provide user data",});
  
      let { firstName, lastName, email, password } = req.body;
  
      if (!validator.isValid(firstName))
        return res.status(400).send({ status: false, message: "first name is required" });
  
      if (!validator.isValidFname(firstName))
        return res.status(400).send({ status: false, message: "first name should be Mr or Mrs" });
  
      if (!validator.isValid(lastName))
        return res.status(400).send({ status: false, message: "last name is required" });
  
    
      if (!validator.isValid(email))
        return res.status(400).send({ status: false, message: "email is required" });
  
      let isEmailUsed = await UserModel.findOne({ email });
  
      if (isEmailUsed)
        return res.status(400).send({ status: false, message: `Email already exists` });
  
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        return res.status(400).send({ status: false, message: "Invalid Email id." });
  
      if (!validator.isValid(password))
        return res.status(400).send({ status: false, message: "password is required" });
  
      if (password.length < 8 || password.length > 15)
        return res.status(400).send({ status: false, message: "password length be between 8-15" });
  
      let encryptPassword = await bcrypt.hash(password, saltRounds);
  
      const newUser = {
        firstName,
        lastName,
        email,
        password: encryptPassword,
      };
  
      let createUser = await UserModel.create(newUser);
      return res.status(201).send({ status: true, message: "User created successfully", data: createUser });
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };
  
  //-------------------------------------------------------------

  const login = async (req, res) => {
    try {
      if (!validator.isValidRequestBody(req.body))
        return res.status(400).send({status: false, message: "Invalid parameters ,please provide email and password", });
  
      let { email, password } = req.body;
  
      if (!validator.isValid(email))
        return res.status(400).send({ status: false, message: "email is required", });
  
      if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))
        return res.status(400).send({ status: false, message: `Email should be a valid email address`,  });
  
      if (!validator.isValid(password))
        return res.status(400).send({ status: false, message: "password is required" });
  
      if (password.length < 8 || password.length > 15)
        return res.status(400).send({ status: false, message: "password length be btw 8-15" });
  
      if (email && password) {
        let User = await UserModel.findOne({ email: email });
        if (!User)
          return res.status(400).send({ status: false, message: "email does not exist" });
  
        let decryppasss = await bcrypt.compare(password, User.password);
  
        if (decryppasss) {
          const Token = jwt.sign(
            {
              userId: User._id
            },
            `eventManagement`
          );
  
          return res.cookie("access_token", Token, { httpOnly: true,})
            .status(200).send({message: "Logged in successfully",data: { userId: User._id, token: Token },});
        } else
          return res.status(400).send({ status: false, message: "Invalid password" });
      }
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };
  
  
  //---------------------------------------------------------------------------

  const logout = (req, res) => {
    return res.clearCookie("access_token").status(200).send({ message: "Successfully logged out" });
  };
  
  
  //-------------------------------------------------------------------------------
  const changePassword = async (req, res) => {
    try {
      if (!validator.isValidObjectId(req.params.userId))
        return res.status(400).send({ status: false, message: `${userId} is invalid` });
  
      const userFound = await UserModel.findOne({ _id: req.params.userId });
  
      if (!userFound)
        return res.status(404).send({ status: false, message: `User do not exists` });
  
       if (req.params.userId.toString() !== req.userId)
       return res.status(401).send({status: false,message: `UnAuthorized access to user` });
  
      if (!validator.isValidRequestBody(req.body))
        return res.status(400).send({ status: false, message: "Please provide details to update" });
  
      let { password } = req.body;
  
      let updateUserData = {};
  
      if (password.length < 8 || password.length > 15)
      return res.status(400).send({ status: false, message: "password length be btw 8-15" });
  
      if (validator.isValid(password)) {
        const encryptPass = await bcrypt.hash(password, saltRounds);
        updateUserData["password"] = encryptPass;
      }
  
      const updatedUserData = await UserModel.findOneAndUpdate(
        { _id: req.params.userId }, updateUserData,{ new: true });
  
      return res.status(201).send({ status: true,message: "password changed successfully",data: updatedUserData,});
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };
  
  
  
  module.exports.createUser = createUser
  module.exports.login = login
  module.exports.logout = logout
  module.exports.changePassword = changePassword
  
  