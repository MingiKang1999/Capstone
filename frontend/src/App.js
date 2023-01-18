import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductScreen from "./screens/ProductScreen";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import {LinkContainer} from "react-router-bootstrap";
import { Store } from "./Store";
import {Link} from "react-router-dom";
import { useContext, useEffect, useState} from "react";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import AboutScreen from "./screens/AboutScreen";
import SignupScreen from "./screens/SignupScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AdminProductScreen from "./screens/AdminProductScreen";
import Button from "react-bootstrap/Button";
import { getError } from "./utils";
import axios from "axios";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import DiscussionScreen from "./screens/DiscussionScreen";
import PostScreen from "./screens/PostScreen";

function App() {
  const {state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
  }
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories,setCategories] = useState([]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/v1/categories`);
      setCategories(data);
    } catch(err) {
      toast.error(getError(err));
    }
  }
  fetchCategories();
}, [])
  return (
    <BrowserRouter>
    <div className={
      sidebarIsOpen
      ? "d-flex flex-column site-container active-cont"
      : "d-flex flex-column site-container"}>
      <ToastContainer position="top-center" limit={1} />
      <header>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Button variant="dark" onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
              <i className="fas fa-bars"></i>
            </Button>
            <LinkContainer to="/">
            <Navbar.Brand>Artsolid</Navbar.Brand>
            </LinkContainer>
            <Nav className="me-auto">
              <Link to="/cart" className="nav-link">
                Cart Items:
                {cart.cartItems.length > 0 && (cart.cartItems.length)}
              </Link>
              <Link to="/discussion" className="nav-link">
                Discussion
              </Link>
              <SearchBox/>
              {userInfo ? (
                <NavDropdown title={userInfo.user} id="basic-nav-dropdown">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>User Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orderhistory">
                    <NavDropdown.Item>Order History</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider/>
                  <Link className="dropdown-item" to="../#signout" onClick={signoutHandler}>
                    Sign Out
                  </Link>
                </NavDropdown>
              ):(
                <Link className="nav-link" to="/signin">
                Sign In
                </Link>
              )}
              {userInfo && userInfo.adminCheck && (
                <NavDropdown title="Admin" id="admin-nav-dropdown">
                  <LinkContainer to="/dashboard">
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin_product">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
            <Nav className="me-auto">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </Nav>
          </Container>
        </Navbar>
      </header>
      <div className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }>
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            <Nav.Item>
              <strong>Drawing</strong>
            </Nav.Item>
            <Nav.Item>
              <strong>Graphic</strong>
            </Nav.Item>
            <Nav.Item>
              <strong>Photos</strong>
            </Nav.Item>
          </Nav>
      </div>
      <main>
        <Container className="mt-3">
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen/>}/>
            <Route path="/discussion/:slug" element={<PostScreen/>}/>
            <Route path="/cart" element={<CartScreen/>}/>
            <Route path="/search" element={<SearchScreen/>}/>
            <Route path="/signin" element={<SigninScreen/>}/>
            <Route path="/shipping" element={<ShippingScreen/>}/>
            <Route path="/payment" element={<PaymentMethodScreen/>}/>
            <Route path="/placeorder" element={<PlaceOrderScreen/>}/>
            <Route path="/signup" element={<SignupScreen/>}/>
            <Route path="/profile" element={<ProfileScreen/>}/>
            <Route path="/admin_product" element={<AdminProductScreen/>}/>
            <Route path="/about" element={<AboutScreen/>}/>
            <Route path="/discussion" element={<DiscussionScreen/>}/>
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
