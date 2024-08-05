// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
const sql = postgres(process.env.PG_CONNECT);
import bcrypt from "bcrypt"
export default async function handler(req, res) {
  /**
   * @param {string} uuid
    */
  console.log('library')
  const { uuid } = req.body;
  if (!uuid) {
    return res.status(400).json({ message: "Missing UUID", error: true });
  }
  let currentISBNListRequest = await sql`SELECT isbn FROM users WHERE uuid = ${uuid}`;
  let ISBNlist = currentISBNListRequest[0].isbn;
  let ISBNFormatted = [];
  for(var i = 0; i < ISBNlist.length; i++){
    ISBNFormatted.push(JSON.parse(decodeURIComponent(ISBNlist[i])));
  }
  return res.status(200).json({message: "ISBN list retrieved", books: ISBNFormatted, error: false})
}

