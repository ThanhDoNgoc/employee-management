import bcrypt from "bcryptjs";

export default class Password {
  static async hash(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(1);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  static async comparePassword(
    storePassword: string,
    inputPassword: string
  ): Promise<boolean> {
    return bcrypt.compareSync(inputPassword, storePassword);
  }
}
