'use client'

import Window, { WindowProps } from "./window";

import styles from "./modal_window.module.css"

export interface ModelWindowProps extends WindowProps {
}

// Same like window but its modal in a sense background elements cant be interacted
export default function ModalWindow({ children, ...props }: ModelWindowProps) {
  return <div className={ styles.modalWindow }>
    <div>
      <Window { ...props }>
        { children }
      </Window>
    </div>
  </div>
}