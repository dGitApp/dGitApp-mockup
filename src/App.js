// React dependences
import React, {useEffect, useState} from "react";

// SCSS files
import "./scss/page.scss"

async function checkIfWalletIsConnected(onConnected) {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
  
      if (accounts.length > 0) {
        const account = accounts[0];
        onConnected(account);
        return;
      }
    }
}

export default function App({onAddressChanged}) {
    const [userAddress, setUserAddress] = useState("");

    useEffect(() => {
        checkIfWalletIsConnected(setUserAddress);
    }, []);

    useEffect(() => {
        onAddressChanged(userAddress);
    }, [userAddress]);

    return userAddress ? 
    ( <chatPage /> ) : (<authMM setUserAddress={setUserAddress}> </authMM>)
}