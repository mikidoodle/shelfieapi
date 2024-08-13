// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
const sql = postgres(process.env.PG_CONNECT);
import bcrypt from "bcrypt";
export default async function handler(req, res) {
  /**
   * @param {string} username
   * @param {string} password
   */

  const { username, password } = req.body;
  console.log(
    `login ${
      username.includes("@") && username.includes(".") ? "email" : "username"
    }`
  );
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Missing username or password", error: true });
  }
  let user = [];
  if (username.includes("@") && username.includes(".")) {
    user =
      await sql`SELECT password, uuid, username FROM users WHERE email = ${username}`;
  } else {
    user =
      await sql`SELECT password, uuid, username FROM users WHERE username = ${username}`;
  }
  console.log(user);
  if (user.length === 0) {
    return res.status(400).json({ message: "User not found", error: true });
  } else {
    var match = await bcrypt.compare(password, user[0].password);
    if (match) {
      return res.status(200).json({
        message: "Login successful",
        uuid: user[0].uuid,
        username: user[0].username,
        error: false,
      });
    } else {
      return res.status(400).json({ message: "Invalid password", error: true });
    }
  }
}
