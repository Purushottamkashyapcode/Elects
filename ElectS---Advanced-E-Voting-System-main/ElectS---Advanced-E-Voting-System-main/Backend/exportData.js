//Export Data From Base Database
const { MongoClient } = require("mongodb");

const sourceURI = "mongodb+srv://purushottamkashyap77:Kajaljha%40123@cluster0.8gbav2f.mongodb.net/";
const sourceDBName = "test";
const collectionName = "people";

async function exportData() {
  const sourceClient = new MongoClient(sourceURI);
  try {
    await sourceClient.connect();
    const db = sourceClient.db(sourceDBName);
    const collection = db.collection(collectionName);
    const data = await collection.find().toArray();

    //console.log("Exported Data:", data);
    return data;
  } catch (error) {
    console.error("Error exporting data:", error);
  } finally {
    await sourceClient.close();
  }
}

module.exports = exportData;
