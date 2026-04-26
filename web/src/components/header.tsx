import { WEB_URL } from "@/app/config"
import styles from "./header.module.css"
import Row from "./row_of_elements"

export default function Header() {
  return <div className={ styles.header }>
    <Row>
      <img src={ WEB_URL + "/favicon.ico" } width="24" height="24" />
      Employee App
    </Row>
  </div>
}

