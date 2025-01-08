const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateUser } = require("../middleware/authMiddleware");

router.post("/signup", async (req, res) => {
    const { email, password, username, phone_number, state, gender } = req.body;
  
    if (!email || !password || !username || !phone_number || !state || !gender) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        email,
        password: hashedPassword,
        username,
        phone_number,
        state,
        gender,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      console.error("Error during signup:", err);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  });
  

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
      res.status(200).json({ message: "Login successful", email: user.email });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  });
  
  router.get("/user/profile", async (req, res) => {
    const { email } = req.query;  
  
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json({
        email: user.email,
        username: user.username,
        phone_number: user.phone_number,
        state: user.state,
        gender: user.gender,
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  });
  
router.put("/user/update", async (req, res) => {
    const { email, username, phone_number, state, gender } = req.body;
  
    if (!email || !username || !phone_number || !state || !gender) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    try {
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { username, phone_number, state, gender },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }
  
      res.status(200).json({
        message: "Profile updated successfully",
        updatedUser,
      });
    } catch (err) {
      console.error("Error updating user profile:", err);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  });
  
  router.delete("/delete", async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
  
    try {
      const deletedUser = await User.findOneAndDelete({ email }); // Use findOneAndDelete instead
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "User successfully deleted" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  router.get('/checkReceiver', async (req, res) => {
    const { receiver } = req.query;
    
    try {
      const user = await User.findOne({ username: receiver });
      if (user) {
        return res.status(200).json({ exists: true });
      } else {
        return res.status(404).json({ exists: false });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error checking receiver' });
    }
  });

  router.get('/users', async (req, res) => {
    try {
      const users = await User.find({}, 'username'); 
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });
  
module.exports = router;