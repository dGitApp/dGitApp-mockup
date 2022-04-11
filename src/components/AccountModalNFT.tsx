import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";

import { NFTGallery } from "./NFTGallery";
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
          <ModalHeader color="white" fontSize="lg" fontWeight="medium">
            Wallet Address: {address}
          </ModalHeader>
          <ModalCloseButton
            color="white"
            fontSize="sm"
            _hover={{
              color: "whiteAlpha.700",
            }}
          />
          <ModalBody>
            <NFTGallery ownerAddress = {address} walletProvider = {provider} darkMode = {true} hasTransferMode = {true} />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  