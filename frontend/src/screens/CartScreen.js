import { useContext } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MessageBox from "../components/MessageBox";
import {Link, useNavigate} from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function CartScreen() {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch} = useContext(Store);
    const {
        cart: { cartItems },
    } = state;

    const removeItemHandler = (item) => {
        ctxDispatch({type: "CART_REMOVE_ITEM", payload: item});
    }

    const checkoutHandler = (item) => {
        navigate("/signin?redirect=/shipping");
    }
    return (
        <div>
            <Helmet>
                <title>Shopping Cart</title>
            </Helmet>
            <h1>Shopping cartItems</h1>
            <Row>
                <Col md={8}>
                    {cartItems.length === 0 ? (
                        <MessageBox>
                            Cart is empty <Link to="/">Back to Arts</Link>
                        </MessageBox>
                    ):
                    (
                        <ListGroup>
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className="align-items-center">
                                        <Col md={4}>
                                            <img src={item.art} alt={item.title} className="img-fluid rounded img-thumbnail"></img>{" "}
                                            <Link to={`/product/${item.title}`}>{item.title}</Link>
                                        </Col>
                                        <Col md={3}>
                                            <span>This item is Available</span>{" "}
                                        </Col>
                                        <Col md={3}>${item.price}</Col>
                                        <Col md={2}>
                                            <Button 
                                            onClick={() => removeItemHandler(item)}
                                            variant="light">
                                                <i className="fas fa-trash"></i>
                                            </Button>{" "}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )
                    }
                </Col>
                <Col md={4}></Col>
                <Card>
                    <Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>
                                    Subtotal ({cartItems.reduce((a,c) => a + c.available, 0)}{" "}
                                    items) : $
                                    {cartItems.reduce((a, c) => a + c.price, 0)}
                                </h3>
                            </ListGroup.Item>
                        </ListGroup>
                        <ListGroup.Item>
                            <div>
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={checkoutHandler}
                                    disabled={cartItems.length === 0}>
                                    Proceed to Checkout
                                    </Button>
                            </div>
                        </ListGroup.Item>
                    </Card.Body>
                </Card>
            </Row>
        </div>
    )
}