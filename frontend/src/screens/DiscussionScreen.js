import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import logger from "use-reducer-logger";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Discussion from "../components/Discussion";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
    switch(action.type){
        case "FETCH_REQUEST":
            return {...state, loading: true};
        case "FETCH_SUCCESS":
            return {...state, discussions: action.payload, loading: false};
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
}

function DiscussionScreen(){
    const [{loading, error, discussions}, dispatch] = useReducer(logger(reducer), {
        discussions: [], loading: true, error: ""
    });
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    useEffect(()=>{
        const fetchData = async () => {
            dispatch({type: "FETCH_REQUEST"});
            try{
                const result = await axios.get("/api/v1/discussions");
                dispatch({type: "FETCH_SUCCESS", payload: result.data})
            }catch(err){
                dispatch({type: "FETCH_FAIL", payload: err.message});
            }
        };
        fetchData();
    }, []);
    const submitHandler = async (e) => {
        try {
            const { data } = await axios.post("/api/v1/discussions/", {
                title,
                comment,
            });
        }catch (err){
            alert("Invalid Email or Password")
        }
    };
    return <div>
        <Helmet>
            <title>Artsolid</title>
        </Helmet>
        <h1>Discussion</h1>
    <div className="discussions">
      {
        loading ? (<LoadingBox/>)
        :
        error ? (<MessageBox variant="danger">{error}</MessageBox>)
        : (
            <Row>{
                discussions.map(discussion =>(
                <Col key={discussion.title} sm={6} md={4} lg={3} className="mb-3">
                    <Discussion discussion={discussion}></Discussion>
                </Col>
                ))}
                </Row>
        )}
    </div>
    <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="comment">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
            </Form.Group>
            <div className="mb-3">
                <Button variant="primary" type="submit">
                    Continue
                </Button>
            </div>
        </Form>
    </div>;
}

export default DiscussionScreen;