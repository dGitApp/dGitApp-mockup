import React from "react";
import { Button, Container, Image} from "react-bootstrap";

// ASSETS
import logo from "../assets/icons/dGitIconGreen.png"

export default function authMM() {

    async function connect(onConnected) {
        if (!window.ethereum) {
          alert("Get MetaMask!");
          return;
        }
      
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      
        onConnected(accounts[0]);
    }

    return (
        <Container>
            <div className="page.container">
                <div style={{ flex: 1, marginBottom: 130, textAlign: "center" }}>
                    <Image fluid src={logo} width={200} height={200}></Image>
                </div>
                <div style={{ flex: 1, margin: 0, textAlign: "center" }}>
                    <Button variant="light" onClick={() => alert("connect")}>
                        Connect Wallet
                    </Button>
                </div>
            </div>
        </Container>
    )
}