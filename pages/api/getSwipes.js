// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
const sql = postgres(process.env.PG_CONNECT);
export default async function handler(req, res) {
  /**
   * @param {string} uuid
   * @param {string} swipes
   */
  const { uuid } = req.body;
  let getUserSwipes = await sql`SELECT swipes from users where uuid=${uuid}`;
  let getUserLibrary = await sql`SELECT isbn from users where uuid=${uuid}`;
  let library =
    getUserLibrary[0].isbn.length > 15
      ? getUserLibrary[0].isbn.slice(0, 15)
      : getUserLibrary[0].isbn;
  for (var i = 0; i < library.length; i++) {
    library[i] = JSON.parse(decodeURIComponent(library[i])).title;
  }
  let swipes =
    getUserSwipes[0].swipes.length > 10
      ? getUserSwipes[0].swipes.slice(0, 10)
      : getUserSwipes[0].swipes;
  console.log(swipes);
  //JSON stringiyf the swipes array
  let prompt = `Get 10 bestselling/trending book recommendations based on user's past 10 books: ${JSON.stringify(
    swipes.reverse()
  )}. 15 library books: ${JSON.stringify(
    library.reverse()
  )}. If empty return 15 all time top books. Return only book titles in a JS array. Recommend equally from liked genres. No obscure books. Bestsellers/trending only. Library books have lesser weight than past 10 books. No additional text.
`;
  console.log(prompt);
  var getSuggestions = await fetch(
    "https://jamsapi.hackclub.dev/openai/chat/completions",
    {
      method: "POST", //GET, POST, PUT, DELETE
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI}`,
      },
      //NOT needed with GET request
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
      }),
    }
  );

  var response = await getSuggestions.json();
  return res.status(200).json({ message: response.choices[0].message.content });
 /* return res
    .status(200)
    .json({
      message: JSON.stringify([
        "Little Fires Everywhere",
        "Where the Crawdads Sing",
        "The Nightingale",
        "Eleanor Oliphant Is Completely Fine",
        "The Silent Patient",
        "Educated",
        "Circe",
        "The Great Alone",
        "The Alice Network",
        "Big Little Lies",
        "The Woman in the Window",
        "Before We Were Strangers",
        "The Seven Husbands of Evelyn Hugo",
        "The Light We Lost",
        "The Tattooist of Auschwitz",
      ]),
    });*/
}
