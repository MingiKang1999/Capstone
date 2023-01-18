import axios from "axios";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import { useState } from "react";

export default function AdminProductScreen(){
    const [id, setId] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();
        try{
            const result = await axios.delete(`/api/v1/products/${id}`);
            console.log(result);
        }catch(err){
            alert("Product Doesn't Exist")
        }
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