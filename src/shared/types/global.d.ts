import { PassportUser } from '../../modules/auth/types/auth.types'
import { User } from '../../modules/users/types/user.types'

declare global {
  namespace Express {
    interface User extends PassportUser { }
    interface Request {
      file?: Express.Multer.File
      user?: User
    }
  }
}

export { } 
