import { ReactNode } from "react";
import { Flex, Box } from "@chakra-ui/react";

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
      bg="gray.600"
    >
          {children}
          
    </Flex>
  );
}

// <Box  display='flex'
//               flexDirection= "column" 
//               alignItems='center' 
//               justifyContent= 'center'
//               borderWidth='1px'
//               borderRadius='20px'
//               borderColor = 'blackAlpha.200'
//               width={450} 
//               height={600}
//               bg = 'gray.700'
//               boxShadow='lg'
//         ></Box>