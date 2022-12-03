import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import {LinkContainer} from "react-router-bootstrap";
import { Store } from "./Store";
import {Link} from "react-router-dom";
import { useContext} from "react";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import AboutScreen from "./screens/AboutScreen";
import SignupScreen from "./screens/SignupScreen";

function App() {
  const {state } = useContext(Store);
  const { cart } = state;

  return (
    <BrowserRouter>
    <div className="d-flex flex-column site-container">
      <header>
        <Navbar bg="dark" variant="dark">
          <Container>
            <LinkContainer to="/">
            <Navbar.Brand>Artsolid</Navbar.Brand>
            </LinkContainer>
            <Nav className="me-auto">
              <Link to="/cart" className="nav-link">
                Cart Items:
                {cart.cartItems.length > 0 && (cart.cartItems.length)}
              </Link>
            </Nav>
            <Nav className="me-auto">
              <Link to="/signin" className="nav-link">
                Singin
              </Link>
            </Nav>
            <Nav className="me-auto">
              <Link to="/signup" className="nav-link">
                Register
              </Link>
            </Nav>
            <Nav className="me-auto">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </Nav>
          </Container>
        </Navbar>
      </header>
      <main>
        <Container className="mt-3">
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen/>}/>
            <Route path="/cart" element={<CartScreen/>}/>
            <Route path="/signin" element={<SigninScreen/>}/>
            <Route path="/signup" element={<SignupScreen/>}/>
            <Route path="/about" element={<AboutScreen/>}/>
            <Route path="/" element={<HomeScreen/>}/>
          </Routes>
        </Container>
      </main>
      <footer>
        <div className="text-center">
          Mohawk College Capstone Project
        </div>
      </footer>
    </div>
    </BrowserRouter>
  );
}

export default App;
