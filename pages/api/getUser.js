import postgres from "postgres";
const sql = postgres(process.env.PG_CONNECT);
export default async function handler(req, res) {
  /**
   * @param {string} uuid
   */
  const { uuid } = req.body;
  let user =
    await sql`SELECT username, uuid, verified from users WHERE uuid = ${uuid}`;
  if (user.length === 0) {
    return res.status(400).json({ message: "User not found", error: true });
  } else {
    return res.status(200).json({
      message: "User found",
      username: user[0].username,
      uuid: user[0].uuid,
      verified: user[0].verified,
      error: false,
    });
  }
}
