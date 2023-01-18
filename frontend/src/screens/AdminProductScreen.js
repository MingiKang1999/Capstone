import axios from "axios";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import { useEffect, useReducer, useState } from "react";
import { getError } from "../utils";

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

export default function AdminProductScreen(){
    const [id, setId] = useState("");
    const [dispatch] = useReducer((reducer), {
        product: [], loading: true, error: ""
    });
    
    useEffect(()=>{
        const fetchData = async () => {
            dispatch({type: "FETCH_REQUEST"});
            try{
                const result = await axios.delete(`/api/v1/products/${id}`);
                dispatch({type: "FETCH_SUCCESS", payload: result.data})
            }catch(err){
                dispatch({type: "FETCH_FAIL", payload: getError(err)});
            }
        };
        fetchData();
    }, [dispatch, id]);

    const submitHandler = async (e) => {
        e.preventDefault();
    };

    return (
        <Container className="small-container">
            <Helmet>
                <title>Delete Product</title>
            </Helmet>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="id">
                    <Form.Label>
                        Product ID
                    </Form.Label>
                    <Form.Control type="id" required onChange={(e) => setId(e.target.value)}/>
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Delete Product</Button>
                </div>
            </Form>
        </Container>
    )
}