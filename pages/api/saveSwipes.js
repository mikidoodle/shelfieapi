// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
const sql = postgres(process.env.PG_CONNECT);
export default async function handler(req, res) {
  /**
   * @param {string} uuid
   * @param {string} swipes
   */
  const { uuid } = req.body
  //save swipes to the database
  //swipes is an array. push the new swipes to the existing swipes array
  let getUserSwipes = await sql`SELECT swipes from users where uuid=${uuid}`
  let swipes = getUserSwipes[0].swipes
  let newSwipes = JSON.parse(req.body.swipes)
  let updatedSwipes = swipes.concat(newSwipes)
  console.log(updatedSwipes)
  await sql`UPDATE users SET swipes=${updatedSwipes} WHERE uuid=${uuid}`
  await sql`UPDATE users SET swipequota=true WHERE uuid=${uuid}`
  return res.status(200).json({ error: false })
}