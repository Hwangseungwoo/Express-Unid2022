import { UserModel } from "@models/User";
import { jsonResponse, errorList } from "../../types/response";
import UserService from "@services/user";

export default class UserApi {
  static async login(
    userId: string,
    password: string,
    res: jsonResponse
  ): Promise<any> {
    try {
      const user: UserModel | null = await UserService.findById(userId);
      if (!user) {
        return res.json({ code: -1, result: errorList.NoUser });
      }

      if (password !== user.password) {
        return res.json({ code: -1, result: errorList.Unauthorized });
      }
      return res.json({ code: 0, result: user });
    } catch (error) {
      return res.json({ code: -1, result: errorList.Exception });
    }
  }
}
