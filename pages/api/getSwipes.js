// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";
const sql = postgres(process.env.PG_CONNECT);
export default async function handler(req, res) {
  /**
   * @param {string} uuid
   * @param {string} swipes
   */
  const { uuid } = req.body
  let getUserSwipes = await sql`SELECT swipes from users where uuid=${uuid}`
  let getUserLibrary = await sql`SELECT isbn from users where uuid=${uuid}`
  let library = getUserLibrary[0].isbn
  for (var i = 0; i < library.length; i++) {
    library[i] = JSON.parse(decodeURIComponent(library[i])).title
  }
  let swipes = getUserSwipes[0].swipes
  console.log(`Get 15 bestselling or trending book recommendations based on this user's liked books: ${swipes}. This is their library: ${JSON.stringify(library.reverse())}. Return the list of book titles in a JS array. Do not type any other text.`)
  var getSuggestions = await fetch('https://jamsapi.hackclub.dev/openai/chat/completions', {
    method: 'POST', //GET, POST, PUT, DELETE
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI}`
    },
    //NOT needed with GET request
    body: JSON.stringify(
      {
        'model': 'gpt-3.5-turbo',
        'messages': [
          {
            'role': 'system',
            'content': `Get 15 bestselling or trending book recommendations based on this user's liked books: ${swipes}. This is their library: ${library}. Return the list of book titles in a JS array. Do not type any other text.`
          }
        ],
      }
    )})

    var response = await getSuggestions.json()
    return res
      .status(200)
      .json({ message: response.choices[0].message.content })
  /*return res
    .status(200)
    .json({ message: JSON.stringify(["Little Fires Everywhere", "Where the Crawdads Sing", "The Nightingale", "Eleanor Oliphant Is Completely Fine", "The Silent Patient", "Educated", "Circe", "The Great Alone", "The Alice Network", "Big Little Lies", "The Woman in the Window", "Before We Were Strangers", "The Seven Husbands of Evelyn Hugo", "The Light We Lost", "The Tattooist of Auschwitz"]) })
*/
}