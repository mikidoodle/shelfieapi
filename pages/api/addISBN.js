// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
const sql = postgres(process.env.PG_CONNECT);
import bcrypt from "bcrypt"
export default async function handler(req, res) {
  /**
   * @param {string} isbn
   * @param {string} uuid
    */
  console.log('addISBN')
  const { isbn, uuid } = req.body;
  console.log(isbn)
  if (!isbn) {
    return res.status(400).json({ message: "Missing ISBN", error: true });
  } else {
    //let currentISBNListRequest = await sql`SELECT * FROM users WHERE uuid = ${uuid}`;
    //console.log(currentISBNListRequest)
    //let ISBNlist = currentISBNListRequest[0].isbn;
    //ISBNlist.push(isbn);
    //let update = await sql`UPDATE users SET isbn = ${ISBNlist} WHERE uuid = ${uuid} RETURNING isbn`;
    let update = await sql`UPDATE users SET isbn = array_append(isbn, ${isbn}) WHERE uuid = ${uuid} RETURNING isbn`;
    console.log(update)
    return res.status(200).json({message: "ISBN added", error: false})
  }
}