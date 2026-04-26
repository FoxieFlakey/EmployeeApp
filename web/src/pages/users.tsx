'use client'

import Centered from "@/components/centered"
import { UserContext } from "@/components/user_provider"
import { ReactNode, useContext, useEffect, useState } from "react"
import styles from "./users.module.css"

import Backend, { UserInfo } from "@/lib/backend/lib"
import { Result } from "@/lib/backend/result"
import { Error, ErrorCode } from "@/lib/backend/error"
import StyledButton from "@/components/button"
import { WEB_URL } from "@/app/config"
import IconButton from "@/components/icon_button"
import ModalWindow from "@/components/modal_window"
import AddUseForm, { AddUserDetail } from "@/components/add_user_form"
import Row from "@/components/row_of_elements"

export default function Users() {
  const { token } = useContext(UserContext)
  
  const [ error, setError ] = useState<string | null>(null)
  const [ users, setUsers ] = useState<[Result<UserInfo, Error>, BigInt][] | null>(null)
  
  // The value of revision actually dont matter, it is used
  // to trigger re-update of table containing list of users
  const [ revision, setRevision ] = useState(0)
  
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
  }, [token, revision])
  
  // Keep the counting matching number of headers in <thead> element
  const columnsCount = 6
  
  let data: ReactNode[] = []
  if (users != null) {
    data = users.map(item => {
      const [ user, id ] = item
      
      async function freezeUser() {
        if (token != null) {
          const result = await Backend.freeze_user(token, id)
          if (!result.ok) {
            console.error(result.value.message)
          } else {
            setRevision(revision + 1)
          }
        }
      }
      
      async function unfreezeUser() {
        if (token != null) {
          const result = await Backend.unfreeze_user(token, id)
          if (!result.ok) {
            console.error(result.value.message)
          } else {
            setRevision(revision + 1)
          }
        }
      }
      
      async function deleteUser() {
        if (token != null) {
          const result = await Backend.delete_user(token, id)
          if (!result.ok) {
            console.error(result.value.message)
          } else {
            setRevision(revision + 1)
          }
        }
      }
      
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
                <IconButton title="Unfreeze This user" onClick={() => unfreezeUser() } >
                  <img src={ WEB_URL + "/Unfreeze Icon.png" } width="16" height="16" />
                </IconButton> :
                <IconButton title="Freeze This user" onClick={() => freezeUser() } >
                  <img src={ WEB_URL + "/Freeze Icon.png" } width="16" height="16" />
                </IconButton>
              }
              <IconButton title="Delete this user" onClick={() => deleteUser() } >
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
  
  const [ openedAddUserWindow, setOpenedAddUserWindow ] = useState(false)
  const [ errorMessageForAddUser, setErrorMessageForAddUser ] = useState<string | null>(null)
  function cancelAddUser() {
    setOpenedAddUserWindow(false)
  }
  
  function submitAddUser(data: AddUserDetail, doneProcessing: () => void) {
    (async () => {
      if (token == null) {
        setErrorMessageForAddUser("You're not logged in, please login first")
        doneProcessing()
        return
      }
      
      const result = await Backend.create_user(token, data)
      if (!result.ok) {
        switch (result.value.code) {
        case ErrorCode.IllegalUsername:
          setErrorMessageForAddUser("Invalid username")
          break
        case ErrorCode.IllegalFullname:
          setErrorMessageForAddUser("Invalid fullname")
          break
        case ErrorCode.InsecurePassword:
          setErrorMessageForAddUser("Insecure password")
          break
        case ErrorCode.MissingPrivileges:
          setErrorMessageForAddUser("You're not allowed to create new users'")
          break
        default:
          setErrorMessageForAddUser(`Error creating user: ${result.value.message}`)
          break
        }
        
        doneProcessing()
        return
      }
      
      doneProcessing()
      setOpenedAddUserWindow(false)
      setRevision(revision + 1)
    })()
  }
  
  return <>
    <h1>List of registered users</h1>
    <Row>
      <StyledButton onClick={ () => {
        setErrorMessageForAddUser(null)
        setOpenedAddUserWindow(true)
      } }>
        <img src={ WEB_URL + "/Plus Icon.png" } width="16" height="16" />
        Create User
      </StyledButton>
      
      <StyledButton onClick={ () => setRevision(revision + 1) }>
        <img src={ WEB_URL + "/Refresh Icon.png" } width="16" height="16" />
        Refresh List
      </StyledButton>
    </Row>
    
    <table key={ revision } className={ styles.users_table }>
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
    
    {
      openedAddUserWindow && <ModalWindow title="Create new user" onClose={ cancelAddUser }>
        {
          errorMessageForAddUser != null && <div className={ styles.errorDiv } >
            <p>{ errorMessageForAddUser }</p>
          </div>
        }
        <AddUseForm onCancel={ cancelAddUser } onSubmit={ submitAddUser } />
      </ModalWindow>
    }
  </>
}

