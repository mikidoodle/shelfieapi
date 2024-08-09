// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
import * as JsSearch from "js-search";
import { v4 as uuidv4 } from "uuid";
const sql = postgres(process.env.PG_CONNECT);
const saltRounds = 10;
import bcrypt from "bcrypt";
export default async function handler(req, res) {
  /**
   * @param {string} uuid
   * @param {string} query
   */
  const { uuid, query } = req.body;
  console.log(query);
  let getUsers =
    await sql`SELECT username, uuid, reviews from users LIMIT 20`;
  var search = new JsSearch.Search("uuid");
  search.addIndex("username");
  search.addDocuments(getUsers);
  let unformattedSearch = search.search(query);
  let formattedSearch = unformattedSearch.map((user) => {
    return {
      username: user.username,
      uuid: user.uuid,
      reviewCount: user.reviews.length,
    };
  });
  return res.status(200).json({ users: formattedSearch });
}
