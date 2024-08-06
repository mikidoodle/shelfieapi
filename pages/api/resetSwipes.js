// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
const sql = postgres(process.env.PG_CONNECT);
export default async function handler(req, res) {
  /**
   * @param {string} token
   */
  const { token } = req.query;
  if (token !== process.env.RESET_TOKEN) {
    return res.status(401).json({ message: "Unauthorized", error: true });
  } else {
    const resetAllSwipeQuotas =
      await sql`UPDATE users SET swipequota = false WHERE verified = true`;
    return res
      .status(200)
      .json({ message: "All swipe quotas reset", error: false });
  }
}
