import { UserRole } from "@/lib/backend/lib"
import { useId, useState } from "react"

import styles from "./user_details_form.module.css"
import StyledButton from "./button"

export interface UserDetail {
  username?: string
  fullname?: string
  role?: UserRole
  display_name?: string
  password?: string
}

export interface FieldsOptions {
  username?: boolean,
  fullname?: boolean,
  role?: boolean,
  display_name?: boolean,
  password?: boolean,
}

export default function UserDetailForm({
  onSubmit,
  onCancel,
  disabled,
  initialValues,
  disabledFields,
  requiredFields,
  submitButtonName
}: {
  onSubmit?: (data: UserDetail, doneSubmitting: () => void) => void,
  onCancel?: () => void
  disabledFields?: FieldsOptions
  requiredFields: FieldsOptions
  initialValues?: UserDetail | null,
  submitButtonName?: string
  disabled?: boolean
}) {
  const fullnameId = useId()
  const usernameId = useId()
  const roleId = useId()
  const displayNameId = useId()
  const passwordId = useId()
  
  const [ processing, setProcessing ] = useState(false)
  const isThereAtleastOneEditable =
    !disabledFields?.display_name ||
    !disabledFields?.fullname ||
    !disabledFields?.username ||
    !disabledFields?.password ||
    !disabledFields?.role
  
  function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    
    const data = new FormData(event.currentTarget)
    const fullName = data.get("fullName")?.toString()
    const displayName = data.get("displayName")?.toString()
    const username = data.get("username")?.toString()
    const role = data.get("role")?.toString()
    const password = data.get("password")?.toString()
    
    setProcessing(true)
    if (onSubmit != null) {
      onSubmit({
        fullname: fullName == "" ? undefined : fullName,
        display_name: displayName == "" ? undefined : displayName,
        username: username == "" ? undefined : username,
        role: role == "" ? undefined : role as UserRole,
        password: password == "" ? undefined : password
      }, () => setProcessing(false))
    }
  }
  
  return <div>
    <form onSubmit={ submit }>
      <p>Fields that are marked with <span style={{ color: "red" }}>*</span> are required</p>
      <table>
        <tbody>
          <tr>
            <td><label htmlFor={ fullnameId }>Full Name{ requiredFields.fullname && <span style={{ color: "red" }}>*</span> }</label></td>
            <td><input
              className={ styles.inputElement }
              id={ fullnameId }
              name="fullName"
              type="text"
              required={ requiredFields.fullname }
              disabled={ disabledFields?.fullname || disabled }
              defaultValue={ initialValues?.fullname }
            /></td>
          </tr>
          
          <tr>
            <td><label htmlFor={ displayNameId }>Display Name{ requiredFields.display_name && <span style={{ color: "red" }}>*</span> }</label></td>
            <td><input
              className={ styles.inputElement }
              id={ displayNameId }
              name="displayName"
              type="text"
              required={ requiredFields.display_name }
              disabled={ disabledFields?.display_name || disabled }
              defaultValue={ initialValues?.display_name }
            /></td>
          </tr>
          
          <tr>
            <td><label htmlFor={ usernameId }>Username{ requiredFields.username && <span style={{ color: "red" }}>*</span> }</label></td>
            <td><input
              className={ styles.inputElement }
              id={ usernameId }
              name="username"
              type="text"
              required={ requiredFields.username }
              disabled={ disabledFields?.username || disabled }
              defaultValue={ initialValues?.username }
            /></td>
          </tr>
          
          <tr>
            <td><label htmlFor={ roleId }>Role{ requiredFields.role && <span style={{ color: "red" }}>*</span> }</label></td>
            <td>
              <select
                className={ styles.inputElement }
                id={ roleId }
                name="role"
                required={ requiredFields.role }
                disabled={ disabledFields?.role || disabled }
                defaultValue={ initialValues?.role }
              >
                <option value={ UserRole.Accounting }>Accounting</option>
                <option value={ UserRole.Admin }>Administrator</option>
                <option value={ UserRole.Developer }>Developer</option>
                <option value={ UserRole.HRD }>Human Resource Department</option>
              </select>
            </td>
          </tr>
          
          <tr>
            <td><label htmlFor={ passwordId }>Password{ requiredFields.password && <span style={{ color: "red" }}>*</span> }</label></td>
            <td><input
              className={ styles.inputElement }
              id={ passwordId }
              name="password"
              type="password"
              required={ requiredFields.password }
              disabled={ disabledFields?.password || disabled }
              defaultValue={ initialValues?.password }
            /></td>
          </tr>
          
          <tr>
            <td colSpan={ 2 }>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <StyledButton disabled={ processing } type="button" style={{ flex: 1 }} onClick={ onCancel }>
                  Cancel
                </StyledButton>
                
                <StyledButton disabled={ processing || disabled || !isThereAtleastOneEditable } type="submit" style={{ flex: 1 }}>
                  { submitButtonName ?? "Submit" }
                </StyledButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
}
