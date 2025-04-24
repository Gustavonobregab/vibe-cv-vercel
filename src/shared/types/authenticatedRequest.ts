import { PassportUser } from "@/modules/auth/types/auth.types";

export interface AuthenticatedRequest extends Request {
  user: PassportUser;
}
