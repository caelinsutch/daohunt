import * as c from "@chakra-ui/react"

import { Limiter } from "~/components/Limiter"
import { LinkButton } from "~/components/LinkButton"

import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  Img,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import React from 'react'

const Home: React.FC = () => (
  <>
    <Box as="section" bg="bg-surface">
      <Limiter height={{ lg: '720px' }}>
        <Box py={{ base: '16', md: '24' }} height="full">
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            spacing={{ base: '16' }}
            align={{ lg: 'center' }}
            height="full"
          >
            <Stack spacing={{ base: '8', md: '12' }}>
              <Stack spacing="4">
                <Badge
                  colorScheme="blue"
                  alignSelf="start"
                  size={useBreakpointValue({ base: 'md', md: 'lg' })}
                >
                  100+ DAOs Documented 👀
                </Badge>
                <Stack spacing={{ base: '4', md: '6' }} maxW={{ md: 'xl', lg: 'md', xl: 'xl' }}>
                  <Heading size={useBreakpointValue({ base: 'md', md: 'xl' })}>
                    Search, find, and review Daos 🎉
                  </Heading>
                  <Text fontSize={{ base: 'lg', md: 'xl' }} color="muted">
                    Find the DAOs you want to know more about and review their quality.
                  </Text>
                </Stack>
              </Stack>
              <Stack direction={{ base: 'column', md: 'row' }} spacing="3">
                <LinkButton to="/daos" variant="primary" size={useBreakpointValue({ base: 'lg', md: 'xl' })}>
                  See Daos
                </LinkButton>
                <Button variant="secondary" size={useBreakpointValue({ base: 'lg', md: 'xl' })}>
                  Submit Dao
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Limiter>
    </Box>
  </>
)

export default Home;