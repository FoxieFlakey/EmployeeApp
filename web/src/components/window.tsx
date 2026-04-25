import { PointerEvent, ReactNode, useEffect, useId, useRef, useState } from "react";
import styles from "./window.module.css";
import IconButton from "./icon_button";
import { WEB_URL } from "@/app/config";

interface WindowProps {
  children?: ReactNode
  title?: string
  onClose?(): void
}

export default function Window({ children, ...props }: WindowProps ) {
  const [ initialized, setInitialized ] = useState(false)
  const [ state, setWindowState ] = useState({
    isDragging: false,
    pointer: 0,
    currentX: 0,
    currentY: 0,
    offsetX: 0,
    offsetY: 0
  })
  const stateRef = useRef(state)
  
  useEffect(() => {
    stateRef.current = state
  }, [ state ])
  
  const windowId = useId()
  useEffect(() => {
    if (initialized) {
      return
    }
    
    const win = document.getElementById(windowId)!
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const winWidth = win.offsetWidth
    const winHeight = win.offsetHeight
    
    setWindowState({
      isDragging: false,
      pointer: 0,
      currentX: (viewportWidth - winWidth) / 2,
      currentY: (viewportHeight - winHeight) / 2,
      offsetX: 0,
      offsetY: 0
    })
    
    setInitialized(true)
  }, [])
  
  function calcFinalPos(inputX: number, inputY: number) {
    const state = stateRef.current
    return [inputX - state.offsetX, inputY - state.offsetY]
  }
  
  function onPointerMove(event: globalThis.PointerEvent) {
    const state = stateRef.current
    
    if (!state.isDragging) {
      return
    }
    
    console.log("move: " + event.pointerId)
    if (event.pointerId == state.pointer) {
      event.preventDefault()
      const [x, y] = calcFinalPos(event.clientX, event.clientY);
      setWindowState({
        ...stateRef.current,
        currentX: x,
        currentY: y
      })
    }
  }
  
  function onPointerUp(event: globalThis.PointerEvent) {
    const state = stateRef.current
    
    console.log("up: " + event.pointerId)
    if (event.pointerId == state.pointer) {
      event.preventDefault()
      const [x, y] = calcFinalPos(event.clientX, event.clientY);
      setWindowState({
        ...state,
        currentX: x,
        currentY: y,
        isDragging: false,
        pointer: 0
      })
      
      document.removeEventListener("pointerup", onPointerUp)
      document.removeEventListener("pointermove", onPointerMove)
    }
  }
  
  function onPointerDown(event: PointerEvent) {
    const state = stateRef.current
    console.log("down: " + event.pointerId)
    
    if (state.isDragging) {
      // There other pointer at same time on same window handle
      return
    }
    event.preventDefault()
    
    setWindowState({
      ...state,
      isDragging: true,
      pointer: event.pointerId,
      offsetX: event.clientX - state.currentX,
      offsetY: event.clientY - state.currentY
    })
    
    document.addEventListener("pointerup", onPointerUp)
    document.addEventListener("pointermove", onPointerMove)
  }
  
  return <div
      id={ windowId }
      className={ styles.window }
      style={{ top: `${state.currentY}px`, left: `${state.currentX}px` }}
    >
      <div className={ styles.window_header } onPointerDown={ onPointerDown }>
        <div style={{ flex: 1 }}>
          { props.title ?? "Unnamed" }
        </div>
        
        <IconButton onClick={ props.onClose }>
          <img src={ WEB_URL + "/X icon.png" } width="20" height="20"></img>
        </IconButton>
      </div>
      
      <div className={ styles.window_content }>
        { children }
      </div>
    </div>
}

