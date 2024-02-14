import { Box, HStack, Heading, Link } from '@chakra-ui/react'
import React from 'react'

function Navbar() {
  return (
    <Box w={"100%"}
    h={"100px"}
    display={"flex"}
    justifyContent={"space-around"}
    alignItems={"center"}
    bg={"blueviolet"}
    >
        <HStack>
            <Heading>USERDASH</Heading>
        </HStack>
        <HStack>
            <Link>HOME</Link>
        </HStack>
    </Box>
  )
}

export default Navbar