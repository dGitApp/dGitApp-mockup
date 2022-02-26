import { ReactNode } from "react";
import { Container, Flex, Box } from "@chakra-ui/react";

import '../scss/page.scss'

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      bg="gray.800"
    >
        <Box  display='flex'
              flexDirection= "column" 
              alignItems='center' 
              justifyContent= 'center'
              borderWidth='1px'
              borderRadius='20px'
              borderColor = 'blackAlpha.200'
              width={350} 
              height={500}
              bg = 'gray.900'
              boxShadow='lg'
        >

          {children}

        </Box>

    </Flex>
  );
}

