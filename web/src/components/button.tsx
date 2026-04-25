import { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./button.module.css"

interface StyledButtonAttributes extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

// A button styled
export default function StyledButton({ children, ...props }: StyledButtonAttributes) {
  return <button className={ styles.button } {...props} >
    { children }
  </button>
}


