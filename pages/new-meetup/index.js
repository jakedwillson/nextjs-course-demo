// our-domain.com/new-meetup
import Head from "next/head";
import { useRouter } from "next/router";
import NewMeetupForm from "../../components/meetups/NewMeetupForm";
import { Fragment } from "react";

const NewMeetupPage = () => {
  const router = useRouter();

  const add_meetup_handler = async (entered_meetup_data) => {
    // Sends a request to the server hosted by this application.
    const response = await fetch("api/new-meetup", {
      method: "POST",
      body: JSON.stringify(entered_meetup_data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log(data);

    router.push("/");
  };

  return (
    <Fragment>
      <Head>
        <title>Add a New Meetup</title>
        {/* This is how you create meta tags that will be picked up by Google */}
        <meta
          name="description"
          content="Create amazing networking opportunities!"
        ></meta>
      </Head>
      <NewMeetupForm onAddMeetup={add_meetup_handler}></NewMeetupForm>
    </Fragment>
  );
};

export default NewMeetupPage;
