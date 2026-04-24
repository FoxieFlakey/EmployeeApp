import { WEB_URL } from "@/app/config";
import { UserInfo } from "@/lib/backend/lib";

import styles from "./profile_card.module.css";

export interface ProfileCardProps {
  userInfo?: UserInfo | null,
  isLoading?: boolean
}

export default function ProfileCard({ userInfo = null, isLoading = false } : ProfileCardProps) {
  var notLoadedMessage = isLoading ? "Loading..." : "Not loaded"
  
  return <>
    <table className={ styles.profile_card }><tbody>
      <tr>
        <td>
          <img src={ WEB_URL + "/profile.png" } width={ 100 } height={ 100 } />
        </td>
        
        <td>
          <table><tbody>
            <tr>
              <td>Name</td>
              <td>{ userInfo?.display_name ?? notLoadedMessage }</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>{ userInfo?.username ?? notLoadedMessage }</td>
            </tr>
            <tr>
              <td>Role</td>
              <td>{ userInfo?.role ?? notLoadedMessage }</td>
            </tr>
            <tr>
              <td>Full name</td>
              <td>{ userInfo?.fullname ?? notLoadedMessage }</td>
            </tr>
          </tbody></table>
        </td>
      </tr>
    </tbody></table>
  </>
}


