import { UserRole } from "@/lib/backend/lib"
import { useId, useState } from "react"

import styles from "./add_user_form.module.css"
import StyledButton from "./button"

export interface AddUserDetail {
  username: string
  fullname: string
  role: UserRole
  display_name?: string
  password: string
}

export default function AddUseForm({
  onSubmit,
  onCancel
}: {
  onSubmit?: (data: AddUserDetail) => void,
  onCancel?: () => void
}) {
  const fullnameId = useId()
  const usernameId = useId()
  const roleId = useId()
  const displayNameId = useId()
  const passwordId = useId()
  
  const [ processing, setProcessing ] = useState(false)
  
  function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    
    const data = new FormData(event.currentTarget)
    const fullName = data.get("fullName")!.toString()
    const displayName = data.get("fullName")?.toString()
    const username = data.get("username")!.toString()
    const role = data.get("username")! as UserRole
    const password = data.get("password")!.toString()
    
    setProcessing(true)
    if (onSubmit != null) {
      onSubmit({
        fullname: fullName,
        display_name: displayName,
        username: username,
        role: role,
        password: password
      })
    }
  }
  
  return <div>
    <form onSubmit={ submit }>
      <table>
        <tbody>
          <tr>
            <td><label htmlFor={ fullnameId }>Full Name</label></td>
            <td><input className={ styles.inputElement } id={ fullnameId } name="fullName" type="text" required /></td>
          </tr>
          
          <tr>
            <td><label htmlFor={ displayNameId }>Display Name</label></td>
            <td><input className={ styles.inputElement } id={ displayNameId } name="displayName" type="text" /></td>
          </tr>
          
          <tr>
            <td><label htmlFor={ usernameId }>Username</label></td>
            <td><input className={ styles.inputElement } id={ usernameId } name="username" type="text" required /></td>
          </tr>
          
          <tr>
            <td><label htmlFor={ roleId }>Role</label></td>
            <td>
              <select className={ styles.inputElement } id={ roleId } name="role" required >
                <option value={ UserRole.Accounting }>Accounting</option>
                <option value={ UserRole.Admin }>Administrator</option>
                <option value={ UserRole.Developer }>Developer</option>
                <option value={ UserRole.HRD }>Human Resource Department</option>
              </select>
            </td>
          </tr>
          
          <tr>
            <td><label htmlFor={ passwordId }>Password</label></td>
            <td><input className={ styles.inputElement } id={ passwordId } name="password" type="password" required /></td>
          </tr>
          
          <tr>
            <td colSpan={ 2 }>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <StyledButton disabled={ processing } type="button" style={{ flex: 1 }} onClick={ onCancel }>
                  Cancel
                </StyledButton>
                
                <StyledButton disabled={ processing } type="submit" style={{ flex: 1 }}>
                  Add
                </StyledButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
}
