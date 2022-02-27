import { Button, Box, Text, Image, Input, Icon, InputLeftElement, InputRightElement, InputGroup} from "@chakra-ui/react";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import Layout from "../components/Layout";

import { BsFillArrowRightCircleFill } from 'react-icons/bs'

import pfp1 from "../assets/pfp/810.png"
import logo from "../assets/icons/dGitIconGreen.png"

type Props = {
  handleOpenModal: any;
};

export default function ConnectButton({ handleOpenModal }: Props) {
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  return account ? (
    <Layout>
      {/* Header Profile */}
      <Box
        width= "390px"
        display="flex"
        alignItems="center"
        background="gray.900"
        borderRadius="xl"
        boxShadow='lg'
        py={0.5}
        zIndex={3}
      >
        <Box px="12">
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
          px={3.5}
          height="38px"
        >
          <Text color="white" fontSize="md" fontWeight="medium" mr="2">
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
        py="0"
        boxShadow='lg'
        >
          {/* messages */}
      </Box>
      {/* input text bar */}
      <Box
        margin={-1.5}
        display = "flex"
        position = "relative"
        width= "390px"
        height="48px"
        alignItems="center"
        background="gray.900"
        borderRadius="xl"
        py="0"
        zIndex={3}
        
        >
        <InputGroup>
          <InputLeftElement 
            pointerEvents='none'
            children={<Image src = {logo} width={8} />}
          />
          
          <Input
            focusBorderColor='limegreen'
            _hover={{
              borderColor: "gray.700",
              backgroundColor: "gray.700",
            }}
            position="relative"
            bg="gray.700"
            borderLeftRadius="100px"
            borderRightRadius="80px"
            placeholder='dGita here'
            borderColor="gray.900"
          />

          <InputRightElement 
            pointerEvents='none'
            children={<Icon as={BsFillArrowRightCircleFill} color = "white" width={10} />} 
          />

        </InputGroup>
      </Box>
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
