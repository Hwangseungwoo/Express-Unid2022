import { UserModel } from "@models/User";
import { jsonResponse, errorList } from "../../types/response";
import UserService from "@services/user";
import TokenService from "@services/token";
import TopicService from "@services/topic";

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

      const user = await UserService.findById(userId);

      if (!user) {
        return res.json({ code: -1, result: errorList.NoUser });
      }

      const isSamePassword = await user.comparePassword(password);

      if (!isSamePassword) {
        return res.json({ code: -1, result: errorList.Unauthorized });
      }

      const token = await TokenService.issueToken(userId, user.name);
      delete user.userDoc;
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

  static async signUp(
    body: {
      id: string;
      password: string;
      name: string;
      gender: string;
      age: number;
    },
    res: jsonResponse
  ) {
    try {
      const { id, password, name, gender, age } = body;
      if (!id || !password || !name || !gender || !age) {
        console.log(id, password);
        return res.json({ code: -1, result: errorList.LackInformation });
      }

      if (age > 30) {
        return res.json({ code: -1, result: errorList.NotAllowed });
      }

      const isSignUpSucceeded = await UserService.insertUser(
        id,
        password,
        name,
        gender,
        age
      );

      if (!isSignUpSucceeded) {
        return res.json({ code: -1, result: errorList.Failed });
      }

      return res.json({ code: 0 });
    } catch (error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }

  static async getUserTopics(
    id: string,
    res: jsonResponse
  ): Promise<any> {
    try {
      if (!id) {
        return res.json({ code: -1, result: errorList.LackInformation });
      }

      const user = await UserService.findById(id);

      if (!user) {
        return res.json({ code: -1, result: errorList.Failed });
      }

      const topics = await user.favoriate_topics.map(async (topic_id: string) => 
        await TopicService.findOneById(topic_id));

      return res.json({ code: 0, result: { topics }})

    } catch(error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }
}
