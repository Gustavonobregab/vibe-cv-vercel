import { PassportUser } from '../../modules/auth/types/auth.types'

declare global {
  namespace Express {
    interface User extends PassportUser { }
    interface Request {
      file?: Express.Multer.File
    }
  }
}

export { } 
