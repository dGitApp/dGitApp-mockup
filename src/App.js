// React dependences
import React, {StyleSheet} from "react";
import { Container} from "react-bootstrap";
import Chatbox from "./components/chatbox";

// SCSS files
import "./scss/page.scss"

export default function App() {
    return (
        <Container>
            <Chatbox></Chatbox>
        </Container>
    )
}