import { Avatar, Box, Heading, HStack, Tag, Wrap, Text } from "@chakra-ui/react";
import { DaoCategory, DaoTags } from "@prisma/client";

type DaoCardProps = {
  name: string;
  photo?: string | null;
  category: DaoCategory;
  tags: DaoTags[];
  shortDescription: string;
  website?: string | null;
}

const DaoCard: React.FC<DaoCardProps> = ({ name, photo,category, tags, shortDescription, website,}) => (
  <Box px={6} py={4} borderColor="secondaryText" borderWidth={1} borderRadius={8}>
    <HStack spacing={4}>
      <Avatar size="xl" src={photo ?? undefined} name={name} borderRadius={8} />
      <Box>

      <Heading as="h3" size="md">
        {name}
      </Heading>
          <Wrap spacing={4} mt={1}>
      <Tag>{category}</Tag>
      {tags.map((tag) => (
      <Tag key={tag}>{category}</Tag>
      ))}
    </Wrap>
      </Box>
    </HStack>

    <Text mt={2} color="secondaryText">
      {shortDescription}
    </Text>
  </Box>
)

export default DaoCard;