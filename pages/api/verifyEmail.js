// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
const sql = postgres(process.env.PG_CONNECT);
export default async function handler(req, res) {
  /**
   * @param {string} uuid
   */
    const { e } = req.query;
    console.log(e)
    let uuid = e
    let user = await sql`UPDATE users SET verified = true WHERE uuid = ${uuid}`
    console.log(user)
    if(user.length === 0){
      return res.status(400).json({message: "Email not found", error: true})
    } else {
      return res.status(200).json({
        message: "Email found",
        error: false
      })
    }
}