import { UserModel } from "@models/User";
import { jsonResponse, errorList } from "../../types/response";
import UserService from "@services/user";
import TokenService from "@services/token";

export default class UserApi {
  static async login(
    userId: string,
    password: string,
    res: jsonResponse
  ): Promise<any> {
    try {
      if (!userId || !password) {
        return res.json({ code: -1, result: errorList.LackInformation });
      }

      const user: UserModel | null = await UserService.findById(userId);

      if (!user) {
        return res.json({ code: -1, result: errorList.NoUser });
      }

      if (password !== user.password) {
        return res.json({ code: -1, result: errorList.Unauthorized });
      }
      const token = await TokenService.issueToken(userId, user.name);
      return res.json({ code: 0, result: { user, token } });
    } catch (error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }

  static async checkDuplicateId(
    userId: string,
    res: jsonResponse
  ): Promise<any> {
    try {
      if (!userId) {
        return res.json({ code: -1, result: errorList.LackInformation });
      }

      const user: UserModel | null = await UserService.findById(userId);
      if (user) {
        return res.json({ code: -1, result: errorList.Duplicated });
      }
      return res.json({ code: 0 });
    } catch (error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }
}
