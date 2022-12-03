import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";

export default function AboutScreen() {
    return (
    <Container className="small-container">
        <Helmet>
            <title>About the website</title>
        </Helmet>
        <h1>About</h1>
        <p>People often have creative thoughts about crafting their own drawings
            and the desire to share those artworks. The problem is there aren't many websites that allow
            you to accomplish this in a quick and simple manner. This web application is meant to
            provide a platform for users to publish sell, and buy artworks without being
            too time-consuming. The website can also be used to display portfolios for up-and-coming
            artists who simply wants to display their talent 
        </p>
        <h2>Contact Information</h2>
        <p>Email: sampleAdmin@mohawkcollege.ca</p>
        <p>Contact Info: 000-123-4567</p>
    </Container>
    )
}