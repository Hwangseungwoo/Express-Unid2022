export default class Authentication {
  static check(memberRequired: boolean) {
    return async function (req: any, res: any, next: any) {
      let headers: any = req.headers;
      let token: string | undefined | number = headers["authorization"];

      if (!token) {
        // 토큰 없으면 그냥 reject
        return res.status(401).json({ code: -1 });
      }

      if (token === "0" || token === 0) {
        // 토큰 0인 경우 비회원인데 우리 클라이언트 header
        res.locals.memberId = null;

        if (memberRequired) {
          // 그럼에도 불구하고 로그인 필요한 route 에서의 요청이면 reject
          return res.status(401).json({ code: -1 });
        } else {
          return next();
        }
      } else {
      }
      return next();
    };
  }
}