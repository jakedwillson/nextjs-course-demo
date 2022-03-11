import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { Fragment } from "react";
import Head from "next/head";

// props
// -meetupData
const MeetupDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        {/* This is how you create meta tags that will be picked up by Google */}
        <meta name="description" content={props.meetupData.description}></meta>
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      ></MeetupDetail>
    </Fragment>
  );
};

// getStaticPaths is a function that you need to export in a page component file if it's a dynamic page
// and if you are using getStaticProps. Not if you are using getServerSideProps and not if you are using neither.
// In this function, we must return an object where we describe all the dynamic segment values (all the meetup ids
// in this case) for which this page should be pre-generated.
// For this, the object needs to have a `paths` key, which is an array, and in that array, you must have one object
// per version of this dynamic page, where the object has a `params` key, which itself is an object which has key/value
// pairs that might lead to your dynamic page.
// You would realistically fetch this data from a database or an API.
export async function getStaticPaths() {
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
  // We will only extract the meetup with ID equal to the parameter value.
  const meetups = await meetup_collection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    // The fallback key indicates whether your paths parameter contains all supported path values or just some of them.
    // If you set it to false, that means that paths contains all supported meetup IDs (and a 404 error will result if
    // the user enters a value that is not in that array).
    // If you set it to true, NextJS will try to generate a page dynamically on the server for this request.
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // We use [meetupId] on params because it is the directory name.
  const meetup_id = context.params.meetupId;

  // Fetch data from an API
  // You must return an object.
  const client = await MongoClient.connect(
    "mongodb+srv://jakedwillson:MyFirstCluster132!@cluster0.enmv7.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  // You have collections in the database which hold multiple documents, and a single meetup would be a single document.
  // The collection can have any name of your choice (if it does not exist yet it will be generated on the fly).
  const meetup_collection = db.collection("meetups");

  // We will only extract the meetup with ID equal to the parameter value.
  const selected_meetup = await meetup_collection.findOne({
    _id: ObjectId(meetup_id),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selected_meetup._id.toString(),
        title: selected_meetup.data.title,
        address: selected_meetup.data.address,
        image: selected_meetup.data.image,
        description: selected_meetup.data.description,
      },
    },
  };
}

export default MeetupDetails;
