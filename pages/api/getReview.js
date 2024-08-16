// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
const sql = postgres(process.env.PG_CONNECT);
export default async function handler(req, res) {
  /**
   * @param {string} reviewid
   */
  const { reviewid } = req.body;
  const review = await sql`SELECT * FROM reviews WHERE uuid = ${reviewid}`;
  if (review.length === 0) {
    return res.status(400).json({ message: "Review not found", error: true });
  } else {
    return res.status(200).json({ review: review[0], error: false });
  }
}
