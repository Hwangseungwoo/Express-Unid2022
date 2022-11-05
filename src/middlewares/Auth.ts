import TokenService from "@services/token";
import { errorList, jsonResponse } from "../types/response";
import UserService from "@services/user";

export default class Authentication {
  static check(memberRequired: boolean) {
    return async function (req: any, res: jsonResponse, next: any) {
      let headers: any = req.headers;
      let token: string | undefined | number = headers["authorization"];

      if (token === "0" || token === 0 || token === null) {
        // 토큰 0인 경우 비회원인데 우리 클라이언트 header
        res.locals.memberId = null;
        res.locals.memberUniqueId = null;
        if (memberRequired) {
          // 그럼에도 불구하고 로그인 필요한 route 에서의 요청이면 reject
          return res
            .status(401)
            .json({ code: -1, result: errorList.Unauthorized });
        } else {
          return next();
        }
      } else {
        if (typeof token === "string") {
          const tokenDoc = await TokenService.findOneByToken(token);
          if (!tokenDoc) {
            return res
              .status(401)
              .json({ code: -1, result: errorList.Unauthorized });
          }

          const user = await UserService.findById(tokenDoc.id);

          if (!user) {
            return res
              .status(401)
              .json({ code: -1, result: errorList.Unauthorized });
          }

          res.locals.memberId = tokenDoc.id;
          res.locals.memberUniqueId = user._id;
          return next();
        } else {
          return res
            .status(401)
            .json({ code: -1, result: errorList.Unauthorized });
        }
      }
      return next();
    };
  }
}
