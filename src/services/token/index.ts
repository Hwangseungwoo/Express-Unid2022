import { TokenModel, Token } from "@models/Token";
import jwt from "jsonwebtoken";
import { KSTDate } from "@lib/common";

export default class TokenService {
  _id: string;
  id: string;
  token: string;
  createdAt: Date;
  expiredAt: Date;

  constructor(result: TokenModel) {
    this._id = String(result._id);
    this.id = result.id;
    this.token = result.token;
    this.createdAt = result.created_at;
    this.expiredAt = result.expired_at;
  }
  static async findOneByToken(token: string): Promise<any> {
    const nowDate = KSTDate();
    const tokenDoc: TokenModel | null = await Token.findOne({
      token,
      expired_at: { $gte: nowDate },
    });
    return tokenDoc ? new TokenService(tokenDoc) : null;
  }

  static async issueToken(id: string, name: string): Promise<string | null> {
    const JwtKey = process.env.JWT_KEY || "";

    const payload: { id: string; name: string } = { id, name };
    const token: string = jwt.sign(payload, JwtKey, { algorithm: "HS256" });

    const nowDate = KSTDate();
    const expiredDate = KSTDate();
    expiredDate.setDate(expiredDate.getDate() + 3);

    const doc = await Token.findOne({ id });

    let tokenDoc;

    if (doc) {
      tokenDoc = await Token.findOneAndUpdate(
        { id },
        {
          $set: {
            token,
            created_at: nowDate,
            expired_at: expiredDate,
          },
        }
      );
    } else {
      tokenDoc = await new Token({
        token,
        id,
        created_at: nowDate,
        expired_at: expiredDate,
      }).save();
    }

    if (!tokenDoc) {
      return null;
    }

    return token;
  }
}
