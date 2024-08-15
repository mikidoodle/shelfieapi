import postgres from "postgres";
const sql = postgres(process.env.PG_CONNECT);
export default async function handler(req, res) {
  /**
   * @param {string} username
   */
  const { username } = req.body;
  let user =
    await sql`SELECT username, uuid, verified from users WHERE username = ${username}`;
  if (user.length === 0) {
    return res.status(400).json({ message: "User not found", error: true });
  } else {
    let getAllUserReviews = await sql`SELECT * from reviews WHERE username = ${username}`;
    console.log('user profile update')
    return res.status(200).json({
      message: "User found",
      username: user[0].username,
      verified: user[0].verified,
      reviews: getAllUserReviews,
      error: false, 
    });
  }
}
