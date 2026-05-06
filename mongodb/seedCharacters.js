// seedcharacters
const { MongoClient } = require("mongodb");
const fs = require("fs");

// Read the MongoDB connection string from env
const uri = process.env.DB_CONNECTION_STRING;
if (!uri) {
  throw new Error("Missing DB_CONNECTION_STRING environment variable.");
}

/**
 * Reads "characters" array from a JSON file.
 */
function readcharactersFromFile(filePath) {
  const data = fs.readFileSync(filePath, "utf-8");
  // Expecting a structure like { "characters": [ {...}, ... ] }
  const jsonData = JSON.parse(data);

  if (!jsonData.characters || !Array.isArray(jsonData.characters)) {
    throw new Error("Invalid JSON format. Expected { characters: [...] }");
  }

  return jsonData.characters;
}

/**
 * Inserts characters into the "characters" collection in "myDatabase".
 */
async function insertcharacters(client, characters) {
  const db = client.db("cannell001DB");
  const collection = db.collection("superheroCharacters");

  const result = await collection.insertMany(characters);
  console.log(`[INSERT] ${result.insertedCount} characters inserted successfully.`);
}

/**
 * Deletes characters from the "characters" collection by matching their "id" field.
 */
async function deletecharacters(client, characters) {
  const db = client.db("cannell001DB");
  const collection = db.collection("superheroCharacters");

  const productIds = characters.map((p) => p.id);

  const result = await collection.deleteMany({ id: { $in: productIds } });
  console.log(`[DELETE] ${result.deletedCount} characters deleted successfully.`);
}

/**
 * Main function that takes in an action and a file path.
 * @param {string} action - "insert" or "delete"
 * @param {string} filePath - path to the JSON file
 */
async function main(action, filePath) {
  // Validate inputs
  if (!action || !filePath) {
    console.log("Usage: node seedcharacters.js  ");
    process.exit(1);
  }

  // Read data from the specified JSON file
  let characters;
  try {
    characters = readcharactersFromFile(filePath);
  } catch (error) {
    console.error("Error reading characters file:", error.message);
    process.exit(1);
  }

  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();

    if (action === "insert") {
      await insertcharacters(client, characters);
    } else if (action === "delete") {
      await deletecharacters(client, characters);
    } else {
      console.error(`Unknown action: "${action}".`);
      console.log("Usage: node seedcharacters.js  ");
    }
  } catch (error) {
    console.error("Error during MongoDB operation:", error);
  } finally {
    await client.close();
  }
}

// ---------------------
// Parse CLI arguments
// ---------------------
const [action, filePath] = process.argv.slice(2);

// Call the main function with CLI arguments
main(action, filePath);