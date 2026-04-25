import { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./button.module.css"

interface IconButtonAttributes extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

// A button styled
export default function IconButton({ children, ...props }: IconButtonAttributes) {
  return <button className={`${ styles.button } ${ styles.icon_button }`} {...props} >
    { children }
  </button>
}


