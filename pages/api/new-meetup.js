import { MongoClient } from "mongodb";
// URL: /api/new-meetup

// The request data stores data about the request and the response
// object will be needed for sending back a response.
async function handler(request, response) {
  if (request.method === "POST") {
    const data = request.body;

    const client = await MongoClient.connect(
      "mongodb+srv://jakedwillson:MyFirstCluster132!@cluster0.enmv7.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    const db = client.db();

    // You have collections in the database which hold multiple documents, and a single meetup would be a single document.
    // The collection can have any name of your choice (if it does not exist yet it will be generated on the fly).
    const meetup_collection = db.collection("meetups");

    // Inserts one item into the collection.
    // The great thing about MongoDB is that a document is just a JS object.
    const result = await meetup_collection.insertOne({ data });

    console.log(result);

    // Closes the DB connection.
    client.close();

    // Sets an HTTP status code on the response which will be returned,
    // as well as a JSON object.
    response.status(201).json({
      message: "Meetup inserted",
    });
  }
}

export default handler;
