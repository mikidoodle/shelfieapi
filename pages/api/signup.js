// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
import { v4 as uuidv4 } from "uuid";
const sql = postgres(process.env.PG_CONNECT);
const saltRounds = 10;
import bcrypt from "bcrypt";
export default async function handler(req, res) {
  /**
   * @param {string} email
   * @param {string} username
   * @param {string} password
   */
  console.log("signup");
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ message: "Missing email, username, or password", error: true });
  }
  const user = await sql`SELECT * FROM users WHERE username = ${username}`;
  if (user.length > 0) {
    return res.status(400).json({ message: "Username already taken", error: true });
  } else {
    const emailCheck = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (emailCheck.length > 0) {
      return res.status(400).json({ message: "Email already in use", error: true });
    } else {
      bcrypt.hash(password, saltRounds, async function (err, hash) {
        const newUser =
          await sql`INSERT INTO users (email, username, password, uuid, isbn, reviews) VALUES (${email}, ${username}, ${hash}, ${uuidv4()}, '{}', '{}') RETURNING uuid, username`;
        if (err) {
          return res.status(400).json({ message: "Signup failed", error: true });
        } else {
          return res
            .status(200)
            .json({ message: "Signup successful!", uuid: newUser[0].uuid, username: newUser[0].username, error: false });
        }
      });
    }
  }
}
