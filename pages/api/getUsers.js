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
    await sql`SELECT username, uuid, reviews, isbn from users LIMIT 20`;
    console.log(getUsers[0].reviews.length, getUsers[0].isbn.length);
  var search = new JsSearch.Search("uuid");
  search.addIndex("username");
  search.addDocuments(getUsers);
  let unformattedSearch = search.search(query);
  let formattedSearch = unformattedSearch.map((user) => {
    console.log(user.reviews.length,user.isbn.length);
    return {
      username: user.username,
      uuid: user.uuid,
      reviewCount: user.reviews.length,
      libraryCount: user.isbn.length,
    };
  });
  return res.status(200).json({ users: formattedSearch });
}
