import { Button, Box, Text, Image, Center, layout } from "@chakra-ui/react";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import Layout from "../components/Layout";


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
    <Box
      display="flex"
      alignItems="center"
      background= "limegreen"
      borderRadius="xl"
      py="0"
    >
      <Box px="3">
        <Text color="white" fontSize="md">
          {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} ETH
        </Text>
      </Box>
      <Button
        onClick={handleOpenModal}
        bg="green.900"
        border="1px solid transparent"
        _hover={{
          border: "1px",
          borderStyle: "solid",
          borderColor: "darkgreen",
          backgroundColor: "darkgreen",
        }}
        borderRadius="xl"
        m="1px"
        px={2}
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
          position= "relative"
          left="1" 
          height = "4.2rem"
          width = "4.2rem"
          borderRadius="2.1rem"
          // border="1px solid transparent"
          borderColor = "limegreen"
          bg = "black"
          >
          {/* 
            src image must be pulled from backend 
            with edit options and NFT verification
          */}
          <Image
            padding= "0.5"
            borderRadius="2.1rem"
            src = {pfp1} />
        </Box>
      </Button>
    </Box>
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
