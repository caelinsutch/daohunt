import * as React from "react"
import { Button, ButtonProps } from "@chakra-ui/react"
import { Link } from "@remix-run/react"

type LinkButtonProps = {
  to: string
} & ButtonProps;

export const LinkButton: React.FC<LinkButtonProps> = (props) => {
  return (
    <Button as={Link} textDecor="none !important" {...props}>
      {props.children}
    </Button>
  )
}
