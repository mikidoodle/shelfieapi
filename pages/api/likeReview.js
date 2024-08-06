// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
import * as JsSearch from 'js-search';
import { v4 as uuidv4 } from "uuid";
const sql = postgres(process.env.PG_CONNECT);
const saltRounds = 10;
import bcrypt from "bcrypt";
export default async function handler(req, res) {
  /**
   * @param {string} uuid
   * @param {string} reviewId
   */

  const { uuid, reviewId } = req.body;
  let getReviewFromId = await sql`SELECT liked from reviews where uuid=${reviewId}`;
  let likedUsers = getReviewFromId[0].liked;
  if(likedUsers.includes(uuid)) {
    likedUsers = likedUsers.filter((user) => user !== uuid);
    let updateLiked = await sql`UPDATE reviews SET liked=${likedUsers} WHERE uuid=${reviewId}`;
    return res.status(200).json({ message: "Successfully unliked review!", error: false, liked: false });
  } else {
    likedUsers.push(uuid);
    let updateLiked = await sql`UPDATE reviews SET liked=${likedUsers} WHERE uuid=${reviewId}`;
    return res.status(200).json({ message: "Successfully liked review!", error: false, liked: true});
  }
}
