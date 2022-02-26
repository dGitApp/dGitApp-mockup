import React, {useState, useEffect, useReducer} from "react";

import { Container, Button} from "react-bootstrap";

import avatarRed from "../assets/icons/dGitIconGreen.png"
import avatarBlue from "../assets/icons/dGitIconGreen.png"

import "../scss/chatbox.scss"

// import TransactionForm from "../modals/transactionForm"


// External Library
import Gun from 'gun'

// Server GunDB - Initialising
// initialize gun locally
const gun = Gun({
    peers: [
      'http://localhost:3030/gun'
    ]
  })


  // create the initial state to hold the messages
const initialState = {
    messages: []
}
  
// Create a reducer that will update the messages array
function reducer(state, message) {
    return {
      messages: [...state.messages, message]
    }
}


export default function Chatbox(props) {
    
    const Addr1 = "0xNerd"
    const Addr2 = "0xDuckie"

    // the form state manages the form input for creating a new message
    const [formState, setForm] = useState({
        name: '',
        message: ''
    })

    // date and time format function

    function formatted_date()
    {
        var result="";
        var d = new Date();
        result += d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + 
             " "+ d.getHours()+":"+d.getMinutes();
        return result;
    }

    // initialize the reducer & state for holding the messages array
    const [state, dispatch] = useReducer(reducer, initialState)

    // when the app loads, fetch the current messages and load them into the state
    // this also subscribes to new data as it changes and updates the local state
    useEffect(() => {
          const messages = gun.get('messages')
          messages.map().on(m => {
              dispatch({
                  name: m.name,
                  message: m.message,
                  note: m.note,
                  createdAt: m.createdAt
                })
            })
    }, [])


    // set a new message in gun, update the local state to reset the form field
    function saveMessage() {
        const messages = gun.get('messages')
        messages.set({
            name: formState.name,
            message: formState.message,
            createdAt: formatted_date()
        })
        setForm({
            name: '',
            message: ''
        })
    }

    // update the form state as the user types
    function onChange(e) {
        if(props.name === "Stefan") { 
            setForm({...formState, name: "Stefan", [e.target.name]: e.target.value})
        }
        else {
            setForm({...formState, name: "Bruno", [e.target.name]: e.target.value})
        }
    }

    return (    
    
    <Container className = "chatbox">
        <div className="chatbox-title">
            <h1> {props.name} </h1>
            <h2> {(props.name === "Stefan" && Addr1) || Addr2} </h2>
            <figure class="avatar">
               {props.name === "Stefan" ? <img src= {avatarRed} /> : <img src= {avatarBlue} />}
            </figure>
        </div>

        <div className = "chatbox-content">
            {
            state.messages.map(message => (
                <div className = {message.name === "Stefan" ? 'message-red' : 'message-blue'} key={message.createdAt}>
                    <h2> {message.message} </h2>
                    <p className = "note"> {message.note} </p>
                    <p className = "timestamp"> {message.createdAt}</p>
                </div>
             ))
            }
        </div>

        <input
                onChange = {onChange}
                placeholder = "Type message..."
                name = "message"
                className = "chatbox-input"
                value = {formState.message}
                autoComplete="off" 
        />
        <Button disabled={formState.message.length<1} className = "chatbox-submit"  onClick={saveMessage}>Send</Button>
    </Container>
  );
}