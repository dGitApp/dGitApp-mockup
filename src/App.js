// React dependences
import React from "react";
import { Button, Container, Image} from "react-bootstrap";

// SCSS files
import "./scss/page.scss"

// ASSETS
import logo from "./assets/icons/dGitIconGreen.png"

export default function App() {
    return (
        <Container>
            <div className="page.container">
                <div style={{flex: 1, marginBottom: 130, textAlign: "center"}}>
                    <Image fluid src={logo} width={200} height={200}></Image>
                </div>
                <div style={{flex: 1, margin: 0, textAlign: "center"}}>
                    <Button variant = "light" onClick={() => alert("connect")}>
                        Connect Wallet
                    </Button>
                </div>
            </div>
        </Container>
    )
}