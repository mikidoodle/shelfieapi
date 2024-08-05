// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
import { v4 as uuidv4 } from "uuid";
const sql = postgres(
  "postgresql://pidgon:pIwwe7-ryfwor-myzmim@cloud.pidgon.com/pidgon"
);
const saltRounds = 10;
import bcrypt from "bcrypt";
export default async function handler(req, res) {
  /**
   * @param {string} uuid
   */
  const { uuid, query } = req.body
  console.log(query)
  let getAllReviews =query === "" ? await sql`SELECT * from reviews` : await sql`SELECT * from reviews where title, content LIKE '%${query}%'`
  let getUserISBNs = await sql`SELECT isbn from users where uuid=${uuid}`
  let userISBNCompleteArray = JSON.parse(`[${decodeURIComponent(getUserISBNs[0].isbn)}]`)

  let userOnlyISBNs = []
  for(var i = 0; i < userISBNCompleteArray.length; i++) {
    userOnlyISBNs.push(userISBNCompleteArray[i].etag)
  }
  console.log(userOnlyISBNs)
  console.log(getAllReviews)
  return res
        .status(200)
        .json({ reviews: getAllReviews, isbns: userOnlyISBNs})
}