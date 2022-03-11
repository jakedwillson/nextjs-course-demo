// Allows you to add Head elements to the <head> section of your page.
import Head from "next/head";
// When you import something that is only used in getServerSideProps, that import will not be part of the client bundle.
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from "react";

// https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        {/* This is how you create meta tags that will be picked up by Google */}
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups and create new ones!"
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups}></MeetupList>
    </Fragment>
  );
};

// // The code you run in here will execute once per request, and
// // always on the server (NEVER ON THE CLIENT). You can also execute
// // operations with credentials that should not be exposed to your users.
// // With the `context` parameter, you get access to the request object with the `req` key,
// // and the response object with the `res` key.
// // If you do NOT have data that changes multiple times every second, and you do NOT
// // need access to the request, getStatic props is actually better.
// export async function getServerSideProps(context) {
//   const request = context.req;
//   const response = context.res;

//   // fetch data from an API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

// Needs to be called getStaticProps
// This is for Static Generation (pre-rendering)
// NextJS will execute this function during pre-rendering (before
// calling the component function)
// The function can be asynchronous and NextJS will wait for it to terminate
// before loading the component.
// Hence, you can load data before the component function is executed.
// THE CODE YOU WRITE IN HERE WILL NEVER END UP ON THE CLIENT SIDE AND WILL
// NEVER EXECUTE ON THE CLIENT SIDE (because this code is executed during the
// build process, not on the client side, or even on the server).
// YOU ALWAYS NEED TO RETURN AN OBJECT FROM THIS METHOD.
// You typically set a props property in the returned object, and that will
// be the props object that is passed into the component function
export async function getStaticProps() {
  // Fetch data from an API
  // You must return an object.
  const client = await MongoClient.connect(
    "mongodb+srv://jakedwillson:MyFirstCluster132!@cluster0.enmv7.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  // You have collections in the database which hold multiple documents, and a single meetup would be a single document.
  // The collection can have any name of your choice (if it does not exist yet it will be generated on the fly).
  const meetup_collection = db.collection("meetups");

  // Find will by default find all of the documents in that collection.
  const meetups = await meetup_collection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.data.title,
        address: meetup.data.address,
        image: meetup.data.image,
        id: meetup._id.toString(),
      })),
    },
    // When we add the `revalidate` property to the object returned by `getStaticProps`, we unlock
    // a feature called Incremental Static Generation.
    // Revalidate wants a number, and that number is the number of seconds that NextJS will wait until it
    // re-generates this page for an incoming request!!!!
    revalidate: 10,
  };
}

export default HomePage;
