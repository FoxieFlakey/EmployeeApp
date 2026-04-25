'use client'

import Centered from "@/components/centered"
import { UserContext } from "@/components/user_provider"
import { ReactNode, useContext, useEffect, useState } from "react"
import styles from "./users.module.css"

import Backend, { UserInfo } from "@/lib/backend/lib"
import { UserList } from "@/lib/backend/list_user"
import { Result } from "@/lib/backend/result"
import { Error } from "@/lib/backend/error"
import StyledButton from "@/components/button"
import { WEB_URL } from "@/app/config"
import IconButton from "@/components/icon_button"

export default function Users() {
  const { token } = useContext(UserContext)
  
  const [ error, setError ] = useState<string | null>(null)
  const [ users, setUsers ] = useState<[Result<UserInfo, Error>, BigInt][] | null>(null)
  
  useEffect(() => {
    if (token == null) {
      setError("You're not logged in please login, first")
      return
    }
    
    (async () => {
      const users = await Backend.list_users(token);
      if (!users.ok) {
        setError(`Cannot fetch users list: ${users.value.message}`)
        return
      }
      
      const usersArray = users.value.users
      setUsers(await Promise.all(
        usersArray.map(async (id) => [await Backend.find_user(token, id), id])
      ))
    })()
  }, [token])
  
  // Keep the counting matching number of headers in <thead> element
  const columnsCount = 6
  
  let data: ReactNode[] = []
  if (users != null) {
    data = users.map(item => {
      const [ user, id ] = item
      
      if (user.ok) {
        return <tr key={ id.toString() }>
          <td>{ id.toString() }</td>
          <td>{ user.value.username }</td>
          <td>{ user.value.display_name }</td>
          <td>{ user.value.fullname }</td>
          <td>{ user.value.role }</td>
          <td>
            <div style={{ display: "flex" }}>
              {
                user.value.is_frozen ?
                <IconButton title="Unfreeze This user" >
                  <img src={ WEB_URL + "/Unfreeze Icon.png" } width="16" height="16" />
                </IconButton> :
                <IconButton title="Freeze This user" >
                  <img src={ WEB_URL + "/Freeze Icon.png" } width="16" height="16" />
                </IconButton>
              }
              <IconButton title="Delete this user">
                <img src={ WEB_URL + "/Trash Can Icon.png" } width="16" height="16" />
              </IconButton>
            </div>
          </td>
        </tr>
      } else {
        return <tr key={ id.toString() }>
          <td>{ id.toString() }</td>
          <td colSpan={ columnsCount - 1 }>
            Cannot fetch this user: { user.value.message }
          </td>
        </tr>
      }
    })
  }
  
  return <>
    <h1>List of registered users</h1>
    <StyledButton>
      <img src={ WEB_URL + "/Plus Icon.png" } width="16" height="16" />
      Create User
    </StyledButton>
    
    <table className={ styles.users_table }>
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Display Name</th>
          <th>Full Name</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      
      <tbody>
        { data }
      </tbody>
    </table>
    
    {
      users == null &&
      <Centered>
        {
          error == null ?
            <>Loading... Please wait</> :
            <>{ error }</>
        }
      </Centered>
    }
  </>
}

