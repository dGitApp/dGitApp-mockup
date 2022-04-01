import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
} from "@chakra-ui/react";

// import { NftGallery } from "react-nft-gallery";
import { NftGallery } from "dgallery-react";
import { providers } from "ethers";

  
  type Props = {
    isOpen: any;
    onClose: any;
    provider: providers.Web3Provider | undefined
    address: string
  };
  
  export default function AccountModalNFT({ isOpen, onClose, provider, address }: Props) {
    // required account
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="6xl">
        <ModalOverlay/>
        <ModalContent
          background="gray.900"
          border="1px"
          borderStyle="solid"
          borderColor="gray.700"
          borderRadius="3xl"
        >
          <ModalHeader color="white" px={4} fontSize="lg" fontWeight="medium">
            Account
          </ModalHeader>
          <ModalCloseButton
            color="white"
            fontSize="sm"
            _hover={{
              color: "whiteAlpha.700",
            }}
          />
          <ModalBody pt={0} px={4}>
            <NftGallery ownerAddress = {address} walletProvider = {provider} darkMode = {true} hasTransferMode = {true} isInline = {true} galleryContainerStyle = {{display: 'flex'}} itemContainerStyle = {{margin: '5px'}} hasLoadMoreButton = {true} />
          </ModalBody>
  
          <ModalFooter
            justifyContent="end"
            background="gray.700"
            borderBottomLeftRadius="3xl"
            borderBottomRightRadius="3xl"
            p={6}
          >
            <Text
              color="white"
              textAlign="left"
              fontWeight="medium"
              fontSize="md"
            >
              Your transactions willl appear here...
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  