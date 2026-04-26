import { UserRole } from "@/lib/backend/lib"
import UserDetailForm, { UserDetail } from "./user_details_form"

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
  onSubmit?: (data: AddUserDetail, doneSubmitting: () => void) => void,
  onCancel?: () => void
}) {
  function doSubmit(data: UserDetail, done: () => void) {
    // NOTE: already requested that its required
    if (onSubmit != null) {
      onSubmit(data as AddUserDetail, done)
    }
  }
  
  return <UserDetailForm submitButtonName="Create" requiredFields={{
    username: true,
    fullname: true,
    role: true,
    password: true
  }} onSubmit={ doSubmit } onCancel={ onCancel } />
}

