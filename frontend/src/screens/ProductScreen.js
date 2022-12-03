import { useContext, useEffect, useReducer } from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Rating from "../components/Rating";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Store } from "../Store";

const reducer = (state, action) => {
    switch(action.type){
        case "FETCH_REQUEST":
            return {...state, loading: true};
        case "FETCH_SUCCESS":
            return {...state, product: action.payload, loading: false};
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
}


function ProductScreen(){
    const navigate = useNavigate();
    const params = useParams();
    const {slug} = params;
    console.log(slug);
    const [{loading, error, product}, dispatch] = useReducer((reducer), {
        product: [], loading: true, error: ""
    });

    useEffect(()=>{
        const fetchData = async () => {
            dispatch({type: "FETCH_REQUEST"});
            try{
                const result = await axios.get(`/api/v1/products/${slug}`);
                dispatch({type: "FETCH_SUCCESS", payload: result.data})
            }catch(err){
                dispatch({type: "FETCH_FAIL", payload: getError(err)});
            }
        };
        fetchData();
    }, [slug]);
    const {state, dispatch: ctxDispatch} = useContext(Store);
    
    const addToCartHandler = () => {
        ctxDispatch({type:"CART_ADD_ITEM", payload: {...product, quantity: 1}});
        navigate("/cart");
    }
    return (
        loading ? (<LoadingBox/>)
        :
        error ? (<MessageBox variant="danger">{error}</MessageBox>)
        :
        <div>
            <Row>
                <Col md={6}>
                    <img className="img-large" src={product.art} alt={product.title}></img>
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Helmet>
                                <title>{product.title}</title>
                            </Helmet>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating
                            rating={product.rating}
                            reviewedNumber={product.reviewedNumber}>
                            </Rating>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Price : ${product.title}</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <p>{product.description}</p>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>${product.price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>{product.available > 0 ?(<p className="available">Available</p>)
                                        :
                                        (<p className="unavailable">Unavailable</p>)
                                        }</Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.available > 0 && (
                                    <ListGroup.Item>
                                        <div className="d-grid">
                                            <Button onClick={addToCartHandler}variant="primary">
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ProductScreen;