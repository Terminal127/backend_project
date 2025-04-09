// BookStore/routes/api/users.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");

const User = require("../../models/User");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         name: "John Doe"
 *         email: "john.doe@example.com"
 *         password: "password1234"
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully registered
 *       400:
 *         description: User already exists
 *       401:
 *         description: Invalid input
 */
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 8 or more characters",
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ message: "User already exists" }] });
      }

      const salt = await bcrypt.genSalt(10);

      let hashedPassword = await bcrypt.hash(password, salt);
      let role = 0; // for normal users, role is 0

      // check if it is a Admin signup
      if (req.header("admin-signup-key")) {
        // check adminSignupKey
        if (req.header("admin-signup-key") === config.get("admin-signup-key")) {
          role = 1; // for admin, role is 1
        }
      }

      user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      });

      await user.save();
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *             example:
 *               email: "john.doe@example.com"
 *               password: "password1234"
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *       400:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid credentials" }] });
      }

      const passwordMatched = await bcrypt.compare(password, user.password);

      if (!passwordMatched) {
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid credentials" }] });
      }
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
);

module.exports = router;
