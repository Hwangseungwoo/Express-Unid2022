import { TokenModel, Token } from "@models/Token";
import jwt from "jsonwebtoken";
import { KSTDate } from "@lib/common";

export default class TokenService {
  _id: string;
  token: string;
  createdAt: Date;
  expiredAt: Date;

  constructor(result: TokenModel) {
    this._id = String(result._id);
    this.token = result.token;
    this.createdAt = result.created_at;
    this.expiredAt = result.expired_at;
  }

  static async issueToken(id: string, name: string): Promise<string | null> {
    const JwtKey = process.env.JWT_KEY || "";

    const payload: { id: string; name: string } = { id, name };
    const token: string = jwt.sign(payload, JwtKey, { algorithm: "HS256" });

    const nowDate = KSTDate();

    const tokenDoc = await new Token({
      token,
      created_at: nowDate,
      expired_at: nowDate.setDate(nowDate.getDate() + 3),
    }).save();

    if (!tokenDoc) {
      return null;
    }

    return token;
  }
}
