import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";


function Product(props) {
    const {discussion} = props;
    return (
        <Card>
        <Card.Body>
            <Link to={`/discussion/${discussion._id}`}>
            <Card.Title>
                {discussion.title}
            </Card.Title>
            </Link>
            <Card.Text>{discussion.comment}</Card.Text>
        </Card.Body>
    </Card>
    );
}
export default Product;