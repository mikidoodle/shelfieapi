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
   */
  const { uuid, query } = req.body;
  console.log(query);
  let getAllReviews = await sql`SELECT * from reviews LIMIT 20`;
  var search;
if(query !== "") {
  search = new JsSearch.Search('uuid');
search.addIndex('title');
search.addIndex('content');
search.addIndex(['meta', 'authors']);
search.addIndex(['meta', 'description']);

search.addDocuments(getAllReviews)
}
  console.log(getAllReviews);
  return res.status(200).json({ reviews: query !== "" ? search.search(query) : getAllReviews });
}
