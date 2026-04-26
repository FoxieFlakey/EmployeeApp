import { PointerEvent, ReactNode, useEffect, useId, useRef, useState } from "react";
import styles from "./window.module.css";
import IconButton from "./icon_button";
import { WEB_URL } from "@/app/config";
import Row from "./row_of_elements";

export interface WindowProps {
  children?: ReactNode
  title?: string
  onClose?(): void
}

const SAFE_SPACE = 50

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
    
    function onResize() {
      const state = stateRef.current
      
      const [x, y] = calcFinalPos(state.currentX, state.currentY);
      setWindowState({
        ...stateRef.current,
        currentX: x,
        currentY: y
      })
    }
    
    window.addEventListener("resize", onResize)
    setInitialized(true)
    
    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])
  
  function calcFinalPos(inputX: number, inputY: number) {
    const state = stateRef.current
    
    // Clamps coords so window cant be place in place where
    // it cant be dragged back to view
    let finalX = inputX - state.offsetX
    let finalY = inputY - state.offsetY
    
    if (finalX >= document.documentElement.clientWidth - SAFE_SPACE) {
      finalX = document.documentElement.clientWidth - SAFE_SPACE
    }
    
    if (finalY >= document.documentElement.clientHeight - SAFE_SPACE) {
      finalY = document.documentElement.clientHeight - SAFE_SPACE
    }
    
    if (finalX < 0) {
      finalX = 0
    }
    
    if (finalY < 0) {
      finalY = 0
    }
    
    return [finalX, finalY]
  }
  
  function onPointerMove(event: globalThis.PointerEvent) {
    const state = stateRef.current
    
    if (!state.isDragging) {
      return
    }
    
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
    
    if (event.pointerId == state.pointer) {
      event.preventDefault()
      const [x, y] = calcFinalPos(event.clientX, event.clientY);
      setWindowState({
        ...state,
        currentX: x,
        currentY: y,
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        pointer: 0
      })
      
      document.removeEventListener("pointerup", onPointerUp)
      document.removeEventListener("pointermove", onPointerMove)
    }
  }
  
  function onPointerDown(event: PointerEvent) {
    const state = stateRef.current
    
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
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td>
                <div style={{ flex: 1 }}>
                  { props.title ?? "Unnamed" }
                </div>
              </td>
              
              <td style={{ width: "0px" }}>
                <IconButton onClick={ props.onClose }>
                  <img src={ WEB_URL + "/X icon.png" } width="20" height="20"></img>
                </IconButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className={ styles.window_content }>
        { children }
      </div>
    </div>
}

