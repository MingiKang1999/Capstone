import Axios from "axios";
import { Link, useLocation, useNavigate} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import { useContext, useState } from "react";
import { Store } from "../Store";

export default function SigninScreen(){
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get("redirect");
    const redirect = redirectInUrl ? redirectInUrl : "/";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { state, dispatch: ctxDispatch } = useContext(Store);
    
    const submitHandler = async (e) => {
        e.preventDefualt();
        try {
            const { data } = await Axios.post("/api/v1/users/login", {
                email,
                password,
            });
            ctxDispatch({type: "USER_SIGNIN", payload: data})
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate(redirect || "/");
        }catch (err){
            alert("Invalid Email or Password")
        }
    }
    
    return (
        <Container className="small-container">
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>
                        Email
                    </Form.Label>
                    <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>
                        Password
                    </Form.Label>
                    <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>
                <div class="mb-3">
                    <Button type="submit">Sign In</Button>
                </div>
                <div class="mb-3">
                    New User?{" "}
                    <Link to={`signup?redirect=${redirect}`}>Create New Account</Link>
                </div>
            </Form>
        </Container>
    )
}