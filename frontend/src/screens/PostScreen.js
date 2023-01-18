import { useEffect, useReducer } from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import Button from "react-bootstrap/Button";

const reducer = (state, action) => {
    switch(action.type){
        case "FETCH_REQUEST":
            return {...state, loading: true};
        case "FETCH_SUCCESS":
            return {...state, discussion: action.payload, loading: false};
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
}


function PostScreen(){
    const navigate = useNavigate();
    const params = useParams();
    const {slug} = params;
    console.log(slug);
    const [{loading, error, discussion}, dispatch] = useReducer((reducer), {
        discussion: [], loading: true, error: ""
    });
    const addToCartHandler = () => {
        navigate("/discussion");
    }

    useEffect(()=>{
        const fetchData = async () => {
            dispatch({type: "FETCH_REQUEST"});
            try{
                const result = await axios.get(`/api/v1/discussions/${slug}`);
                dispatch({type: "FETCH_SUCCESS", payload: result.data})
            }catch(err){
                dispatch({type: "FETCH_FAIL", payload: getError(err)});
            }
        };
        fetchData();
    }, [slug]);

    return (
        loading ? (<LoadingBox/>)
        :
        error ? (<MessageBox variant="danger">{error}</MessageBox>)
        :
        <div>
            <h1>{discussion.title}</h1>
            <h4>{discussion.comment}</h4>
            <Button onClick={addToCartHandler}>Back to Discussion Page</Button>
        </div>
    )
}

export default PostScreen;