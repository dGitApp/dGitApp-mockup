import { 
  Button, 
  Box,
  Text,
  Image,
  Input,
  InputLeftElement, 
  InputRightElement, 
  InputGroup, 
  Icon,
  useDisclosure
} from "@chakra-ui/react";

import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from "@ethersproject/units";
import AccountModalNFT from "./AccountModalNFT";

import {useReducer, useEffect, useState, useRef} from "react"

import Layout from "../components/Layout";

import { BsFillArrowRightCircleFill } from 'react-icons/bs'

import pfp1 from "../assets/pfp/810.png"
import pfp2 from "../assets/pfp/164.png"

import logo from "../assets/icons/dGitIconGreen.png"
import "../scss/chat.scss"

// External Library
import Gun from 'gun'
import { BigNumber, providers } from "ethers";

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
function reducer(state: any, message: any) {
    return {
      messages: [...state.messages, message]
    }
}

type Props = {
  handleOpenModal: any;
};


export default function ConnectButton({ handleOpenModal }: Props) {
  // const { activateBrowserWallet, account, library} = useEthers();
  // const chainId = 1
  const [account, setAccount] = useState<string>()
  const [etherBalance, setEtherBalance] = useState<BigNumber>()
  const [providerAccount, setProviderAccount] = useState<providers.Web3Provider | undefined>()
  const { isOpen, onOpen, onClose } = useDisclosure();


  // connect wallet function
  async function connectMetaMask() {
    const provider = new Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    let userAddress = await signer.getAddress()
    let balance = await provider.getBalance(userAddress)
    setProviderAccount(provider)
    setAccount(userAddress)
    setEtherBalance(balance)
  }

  // GUN DATABASE VARIABLEs
  // -------------------------------------------------------------------------
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState<any>(
    {
      name: '',
      message: '',
      createdAt: ''
    })

  // date and time format function

  function formatted_date() {
    var result = "";
    var d = new Date();
    result += d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() +
      " " + d.getHours() + ":" + d.getMinutes();
    return result;
  }

  // initialize the reducer & state for holding the messages array
  const [state, dispatch] = useReducer(reducer, initialState)

  // when the app loads, fetch the current messages and load them into the state
  // this also subscribes to new data as it changes and updates the local state
  useEffect(() => {
    const messages = gun.get('messages')
    messages.map().on(m => {
      dispatch(
        {
          name: m.name,
          message: m.message,
          createdAt: m.createdAt
        }
      )
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
      message: '',
      createdAt: ''
    })
  }

  function onChange(e: any) {
      setForm({...formState, name: account, message: e.target.value})
  }
  // ------------------------------------------------------------------------------

  function handleConnectWallet() {
    // activateBrowserWallet();
    connectMetaMask()
  }

  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [state.messages]);

  return account ? (
    <Layout>
      <AccountModalNFT 
          isOpen={isOpen} 
          onClose={onClose}
          provider = {providerAccount}
          address = {account}
      />
      {/* Header Profile */}
      <Box
        width= "390px"
        display="flex"
        alignItems="center"
        background="gray.900"
        borderRadius="xl"
        boxShadow='lg'
        py={1}
        zIndex={3}
      >
        <Box px="10">
          <Text color="white" fontSize="md">
            {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} ETH
          </Text>
        </Box>
        <Button
          onClick={handleOpenModal}
          bg="green.700"
          border="1px solid transparent"
          _hover={{
            border: "1px",
            borderStyle: "solid",
            borderColor: "green.800",
            backgroundColor: "green.800",
          }}
          borderRadius="xl"
          m="1px"
          height="44px"
        >
          <Text color="white" fontSize="md" fontWeight="medium" mr="3">
            {account &&
              `${account.slice(0, 6)}...${account.slice(
                account.length - 4,
                account.length
              )}`}
          </Text>
          <Box
            position="relative"
            left="1"
            height="4.2rem"
            width="4.2rem"
            borderRadius="2.1rem"
            // border="1px solid transparent"
            borderColor="limegreen"
            bg="black"
          >
            {/* 
            src image must be pulled from backend 
            with edit options and NFT verification
          */}
            <Image
              padding="0.5"
              borderRadius="2.1rem"
              src={pfp1} />
          </Box>
        </Button>
      </Box>
      {/* chatbox content */}
      <Box
        margin={-1.5}
        position = "relative"
        width= "380px"
        height="500px"
        alignItems="center"
        background="gray.700"
        border="1px solid transparent"
        borderColor= "gray.800"
        boxShadow='lg'
        overflow= 'hidden'
        padding={3}
        >
          {
            state.messages.map(message => (
                <div className={message.name === account ? "message-sent" : "message-received"} ref={messagesEndRef} key={message.createdAt}>
                    {message.name !== account && 
                     ( <img className="avatar" src = {pfp2}/>)}
                    <h2> {message.message}   </h2>
                    <p>  {message.note}      </p>
                    <p>  {message.createdAt} </p>
                </div>
             ))
            }
      </Box>
      {/* input text bar */}
      <InputGroup 
          justifyContent= "center"
          alignItems="center"
          margin={-1.5}
          px = {0.4}
          width= "390px"
          height= "60px"
          bg = "gray.800"
          zIndex={3}
          border="1px solid transparent"
          borderColor= "gray.800"
          borderRadius= "xl"
        >
          <InputLeftElement
            justifyContent= "center"
            alignItems="center"
            children={ 
              <button style = {{position: 'relative', top: '8px', display: 'flex'}} onClick={onOpen} > 
                <Image src={logo} width = {9}/> 
              </button>
            }
          />
          
          <Input
            width= "390px"
            height= "58px"
            justifyContent='center'
            alignItems='center'
            focusBorderColor='limegreen'
            _hover={{
              backgroundColor: "gray.600",
            }}
            position="relative"
            color= "whatsapp.300"
            bg="gray.700"
            borderRadius= "xl"
            placeholder='dGit here'
            borderColor="gray.900"
            onChange = {onChange}
            name="message"
            value = {formState.message}
          />

          <InputRightElement 
            justifyContent= "center"
            alignItems="center"
            children={
              <button disabled={formState.message.length<1} style = {{position: 'relative', top: '10px', right: '4px', display: 'flex'}} onClick={saveMessage} >
                 <Icon as = {BsFillArrowRightCircleFill} color = "white" width = "7" height="7"/> 
              </button>
          } 
          />

      </InputGroup>
    </Layout>
  ) : (
      <Layout>
        <Image src={logo} width={200} paddingBottom={20} />
        <Button
          onClick={handleConnectWallet}
          bg="gray.800"
          color="gray.300"
          fontSize="lg"
          fontWeight="medium"
          borderRadius="xl"
          border="1px solid transparent"
          _hover={{
            borderColor: "gray.700",
            color: "gray.400",
          }}
          _active={{
            backgroundColor: "gray.800",
            borderColor: "gray.700",
          }}
        >
          Connect Wallet
        </Button>
      </Layout>

  );
}
