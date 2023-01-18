import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import Rating from "./Rating";
import { useContext } from "react";
import { Store } from "../Store";


function Product(props) {
    const {product} = props;
    const {dispatch: ctxDispatch} = useContext(Store);
    const addToCartHandler = () => {
        ctxDispatch({type:"CART_ADD_ITEM", payload: {...product, quantity: 1}})
        localStorage.setItem("cartItems", JSON.stringify(product));
        document.getElementById(product.title).disabled = true;
    }
    return (
        <Card>
        <Link to={`/product/${product._id}`}>
        <img src={product.art} className="card-img-top" alt={product.title}/>
        </Link>
        <Card.Body>
            <Link to={`/product/${product._id}`}>
            <Card.Title>
                {product.title}
            </Card.Title>
            </Link>
            <Rating rating={product.rating} numReviews={product.reviewedNumber}/>
            <Card.Text>${product.price}</Card.Text>
            <Button id={`${product.title}`} onClick={addToCartHandler}variant="primary">Add to Cart</Button>
        </Card.Body>
    </Card>
    );
}
export default Product;