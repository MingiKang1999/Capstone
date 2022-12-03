import Axios from "axios";
import { Link, useLocation, useNavigate} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import { useContext, useState } from "react";
import { Store } from "../Store";

export default function SignupScreen(){
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get("redirect");
    const redirect = redirectInUrl ? redirectInUrl : "/";
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { state, dispatch: ctxDispatch } = useContext(Store);
    
    const submitHandler = async (e) => {
        e.preventDefualt();
        try {
            const { data } = await Axios.post("/api/v1/users/register", {
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
                <title>Sign Up</title>
            </Helmet>
            <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>
                        First Name
                    </Form.Label>
                    <Form.Control required onChange={(e) => setFirstName(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label>
                        Last Name
                    </Form.Label>
                    <Form.Control required onChange={(e) => setLastName(e.target.value)}/>
                </Form.Group>
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
                <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>
                        Confirm Password
                    </Form.Label>
                    <Form.Control type="password" required onChange={(e) => setConfirmPassword(e.target.value)}/>
                </Form.Group>
                <div class="mb-3">
                    <Button type="submit">Sign Up</Button>
                </div>
            </Form>
        </Container>
    )
}