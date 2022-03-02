import { ChakraProvider, useDisclosure} from "@chakra-ui/react";
import theme from "./theme";
import ConnectButton from "./components/ConnectButton";
import AccountModal from "./components/AccountModal";
import "@fontsource/inter";
import AccountModalNFT from "./components/AccountModalNFT";


function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ChakraProvider theme={theme}>
        <ConnectButton handleOpenModal={onOpen}/>
        <AccountModal isOpen={isOpen} onClose={onClose} />
    </ChakraProvider>
  );
}

export default App;