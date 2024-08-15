// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
import { v4 as uuidv4 } from "uuid";
const sql = postgres(process.env.PG_CONNECT);
const saltRounds = 10;
import bcrypt from "bcrypt";
export default async function handler(req, res) {
  /**
   * @param {string} content
   * @param {string} book: {etag: string, title: string,author: string,description: string,category: string} //do not store last two fields
   * @param {string} uuid
   * @param {number} username
   * @param {string} emotions
   */

  const { title, content, book, uuid, username, emotions } = req.body;
  const postUUID = uuidv4();
  if (!content || !book || !uuid || !username || !emotions) {
    console.log(req.body)
    return res
      .status(400)
      .json({ message: `Missing ${
        !content ? "content" : !book ? "book" : !uuid ? "uuid" : !username ? "username" : "emotions"
      }`, error: true });
  }
  const user = await sql`SELECT username FROM users WHERE uuid = ${uuid}`; 
  if (user.length === 0) {
    return res.status(400).json({ message: "User not found", error: true });
  } else {
    let meta = book;
    delete meta.description;
    delete meta.category;
    const newReview =
      await sql`INSERT INTO reviews (content, meta, username, uuid, liked, emotions) VALUES (${content}, ${meta}, ${username}, ${postUUID}, '{}', ${emotions}) RETURNING uuid`;
    if (newReview.length === 0) {
      return res.status(400).json({ message: "Review failed", error: true });
    } else {
      const updateUserReviewRecords = await sql`UPDATE users SET reviews = array_append(reviews, ${postUUID}) WHERE uuid = ${uuid}`;
      return res
        .status(200)
        .json({ message: "Review successful!", postuuid: newReview[0].uuid, error: false });
    } 
  }
}
