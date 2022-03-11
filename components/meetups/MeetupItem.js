import { useRouter } from "next/router";
import Card from "../ui/Card";
import classes from "./MeetupItem.module.css";

// props
// -id
function MeetupItem(props) {
  const router = useRouter();
  const show_details_handler = () => {
    // The push component pushes a page onto the stack of pages and it is the equivalent to the Link component.
    router.push('/' + props.id);
  };

  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
          <h3>{props.title}</h3>
          <address>{props.address}</address>
        </div>
        <div className={classes.actions}>
          <button onClick={show_details_handler}>Show Details</button>
        </div>
      </Card>
    </li>
  );
}

export default MeetupItem;
