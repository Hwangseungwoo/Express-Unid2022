import { UserModel, User } from "@models/User";

export default class UserService {
  _id: string;
  id: string;
  password: string;
  name: string;
  gender: string;
  age: string;

  constructor(user: UserModel) {
    this._id = String(user._id);
    this.id = user.id;
    this.password = user.password;
    this.name = user.name;
    this.gender = user.gender;
    this.age = user.age;
  }
  static async find(): Promise<any> {
    const users = await User.find();
    return users;
  }

  static async findById(id: string): Promise<any> {
    const user: UserModel | null = await User.findOne({ id });

    return user ? new UserService(user) : null;
  }
}
