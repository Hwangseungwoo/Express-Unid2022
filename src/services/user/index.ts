import { UserModel, User } from "@models/User";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

export default class UserService {
  _id: string;
  id: string;
  password: string;
  name: string;
  gender: string;
  age: string;
  favoriteTopics: string[];
  userDoc: UserModel;

  constructor(user: UserModel) {
    this.userDoc = user;
    this._id = String(user._id);
    this.id = user.id;
    this.password = user.password;
    this.name = user.name;
    this.gender = user.gender;
    this.age = user.age;
    this.favoriteTopics = user.favorite_topics;
  }
  static async find(): Promise<any> {
    const users: UserModel[] = await User.find();
    return users.map((user) => new UserService(user));
  }

  static async findByIds(ids: string[]): Promise<any> {
    const users: UserModel[] = await User.find({
      _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
    });
    return users;
  }

  static async findById_(_id: string): Promise<any> {
    const user: UserModel | null = await User.findOne({ _id });

    return user ? new UserService(user) : null;
  }

  static async findById(id: string): Promise<any> {
    const user: UserModel | null = await User.findOne({ _id: id });

    return user ? new UserService(user) : null;
  }

  static async findOneById(id: string): Promise<any> {
    const user: UserModel | null = await User.findOne({ id });

    return user ? new UserService(user) : null;
  }

  async comparePassword(password?: string): Promise<boolean | null> {
    if (!password) {
      return null;
    }
    return bcrypt.compareSync(password, this.userDoc.password);
  }

  static async insertUser(
    userId: string,
    password: string,
    name: string,
    gender: string,
    age: number
  ): Promise<boolean | null> {
    const user = await User.findOne({ id: userId });
    if (user) {
      return null;
    }

    const encryptedPwd: string = (() => {
      let salt: string = bcrypt.genSaltSync(12);
      return bcrypt.hashSync(password, salt);
    })();

    const userDoc = await new User({
      id: userId,
      password: encryptedPwd,
      name,
      gender,
      age,
      favorite_topics: [],
    }).save();

    if (!userDoc) {
      return null;
    }

    return true;
  }

  static async insertFavorite(userId: string, topicId: string): Promise<any> {
    const user: UserModel | null = await User.findOne({ _id: userId });

    if (!user) {
      return null;
    }

    if (!user.favorite_topics.includes(topicId)) {
      const updatedDoc: UserModel | null = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { favorite_topics: new Types.ObjectId(topicId) } },
        { new: true }
      );

      if (!updatedDoc) {
        return null;
      }

      return new UserService(updatedDoc);
    } else {
      const updatedDoc: UserModel | null = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { favorite_topics: new Types.ObjectId(topicId) } },
        { new: true }
      );

      if (!updatedDoc) {
        return null;
      }

      return new UserService(updatedDoc);
    }
  }

  static async checkBookmarkStatus(
    topicId: string,
    userId: string
  ): Promise<any> {
    const user: UserModel | null = await User.findOne({ _id: userId });

    if (!user) {
      return false;
    }

    const userDoc = new UserService(user);

    return userDoc.favoriteTopics.includes(topicId);
  }
}
