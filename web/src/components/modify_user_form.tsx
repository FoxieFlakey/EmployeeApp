import { useContext, useEffect, useState } from "react"
import UserDetailForm, { FieldsOptions, UserDetail } from "./user_details_form"
import { UserContext } from "./user_provider"
import Backend from "@/lib/backend/lib"
import styles from "./modal_window.module.css"
import { ErrorCode } from "@/lib/backend/error"

export default function ModifyUserForm({
  target,
  onCancel,
  onSubmit
}: {
  target: BigInt,
  onCancel?: () => void,
  onSubmit?: (target: BigInt, detail: UserDetail, doneProcessing: () => void) => void
}) {
  const { token } = useContext(UserContext)
  const [ isDisabled, setIsDisabled ] = useState(true)
  const [ initialValues, setInitialValues ] = useState<UserDetail | null>(null)
  const [ requiredFields, setRequiredField ] = useState<FieldsOptions>({})
  const [ disabledFields, setDisabledFields ] = useState<FieldsOptions>({})
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null)
  
  useEffect(() => {
    (async () => {
      if (token == null) {
        setErrorMessage("You're not logged in please login")
        return
      }
      
      let userInfo = await Backend.find_user(token, target)
      if (!userInfo.ok) {
        switch (userInfo.value.code) {
        case ErrorCode.InvalidSessionToken:
          setErrorMessage("You're not logged in please login")
          break
        case ErrorCode.UnknownUser:
          setErrorMessage("Can't find that user")
          break
        case ErrorCode.MissingPrivileges:
          setErrorMessage("You're not privileged enough")
          break
        default:
          setErrorMessage(`Error fetching user data for user in edit: ${userInfo.value.message}`)
        }
        return
      }
      
      let allowedEdits = await Backend.get_allowed_changes_to_user(token, target)
      if (!allowedEdits.ok) {
        switch (allowedEdits.value.code) {
        case ErrorCode.InvalidSessionToken:
          setErrorMessage("You're not logged in please login")
          break
        case ErrorCode.UnknownUser:
          setErrorMessage("Can't find that user")
          break
        case ErrorCode.MissingPrivileges:
          setErrorMessage("You're not privileged enough")
          break
        default:
          setErrorMessage(`Error fetching list of allowed to edit: ${allowedEdits.value.message}`)
        }
        return
      }
      
      setRequiredField({
        username: true,
        fullname: true,
        display_name: false,
        role: true,
        password: false
      })
      setDisabledFields({
        username: !allowedEdits.value.username,
        display_name: !allowedEdits.value.display_name,
        role: !allowedEdits.value.role,
        fullname: !allowedEdits.value.fullname,
        password: !allowedEdits.value.password
      })
      setInitialValues({
        username: userInfo.value.username,
        fullname: userInfo.value.fullname,
        display_name: userInfo.value.display_name,
        role: userInfo.value.role
      })
      
      setIsDisabled(false)
    })()
  }, [ token, target ])
  
  return <div>
    {
      errorMessage && <div className={ styles.errorDiv }>
        errorMessage
      </div>
    }
    
    <UserDetailForm
      requiredFields={ requiredFields }
      disabledFields={ disabledFields }
      disabled={ isDisabled }
      initialValues={ initialValues }
      onCancel={ onCancel }
      onSubmit={ (data, doneProcessing) => {
          if (onSubmit != null) {
            onSubmit(target, data, doneProcessing)
          }
        } }
    />
  </div>
}



