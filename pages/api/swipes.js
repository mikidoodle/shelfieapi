// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
const sql = postgres(
  "postgresql://pidgon:pIwwe7-ryfwor-myzmim@cloud.pidgon.com/pidgon"
);
export default async function handler(req, res) {
  /**
   * @param {string} uuid
   */
  const { uuid } = req.body
  let getUserSwipes = await sql`SELECT swipes from users where uuid=${uuid}`
  return res
        .status(200)
        .json({ swipes: JSON.stringify(getUserSwipes[0].swipes) })
        
}