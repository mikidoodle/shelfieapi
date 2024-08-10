// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
import { v4 as uuidv4 } from "uuid";
const sql = postgres(process.env.PG_CONNECT);
var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "iCloud",
  auth: {
    user: "mihirmaroju@icloud.com",
    pass: process.env,
  },
});
const saltRounds = 10;
import bcrypt from "bcrypt";
export default async function handler(req, res) {
  /**
   * @param {string} email
   * @param {string} username
   * @param {string} password
   * @param {string} passwordConfirm
   */
  console.log("signup");
  const { email, username, password, passwordConfirm } = req.body;
  if (!email || !username || !password || !passwordConfirm) {
    return res.status(400).json({
      message: `Missing ${
        !email
          ? "email"
          : !username
          ? "username"
          : !password
          ? "password"
          : "password confirmation"
      }
        `,
      error: true,
    });
  } else if (password !== passwordConfirm) {
    return res
      .status(400)
      .json({ message: "Passwords do not match", error: true });
  }
  const user =
    await sql`SELECT username FROM users WHERE username = ${username}`;
  if (user.length > 0) {
    return res
      .status(400)
      .json({ message: "Username already taken", error: true });
  } else {
    const emailCheck =
      await sql`SELECT username FROM users WHERE email = ${email}`;
    if (emailCheck.length > 0) {
      return res
        .status(400)
        .json({ message: "Email already in use", error: true });
    } else {
      bcrypt.hash(password, saltRounds, async function (err, hash) {
        const newUser =
          await sql`INSERT INTO users (email, username, password, uuid, reviews, swipes, swipequota, verified) VALUES (${email}, ${username}, ${hash}, ${uuidv4()}, '{}', '{}', false, false) RETURNING uuid, username`;
        if (err) {
          return res
            .status(400)
            .json({ message: "Signup failed", error: true });
        } else {
          var message = {
            from: {
              name: `Mihir Maroju`,
              address: "mihir@pidgon.com",
            },
            to: email,
            subject: `shelfie email verification!`,
            html: `<h1>Thank you for signing up for shelfie!</h1><p>Click <a href="http://localhost:3000/api/verifyEmail?e=${newUser[0].uuid}">here</a> to verify your email!</p>`,
          };

          transporter.sendMail(message, function (error, info) {
            console.log(error, info);
            res.status(200).json({ status: "success", data: data.uuid });
          });
          return res.status(200).json({
            message: "Signup successful!",
            uuid: newUser[0].uuid,
            username: newUser[0].username,
            error: false,
          });
        }
      });
    }
  }
}
