import {
    Box,
    Button,
    Flex,
    Link,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Image
  } from "@chakra-ui/react";
  import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";
  import { useEthers } from "@usedapp/core";

  import pfp1 from "../assets/pfp/810.png"
import { NftGallery } from "react-nft-gallery";

  
  type Props = {
    isOpen: any;
    onClose: any;
  };
  
  export default function AccountModalNFT({ isOpen, onClose }: Props) {
    // required account 
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
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
            <NftGallery ownerAddress = ''></NftGallery>
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
  