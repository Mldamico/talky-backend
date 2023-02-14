import { joiValidation } from "@global/decorators/joi-validation.decorators";
import { config } from "@root/config";
import Logger from "bunyan";
import { Response, Request } from "express";
import JWT from "jsonwebtoken";
import HTTP_STATUS from "http-status-codes";
import { authService } from "@service/db/auth.service";
import { BadRequestError } from "@global/helpers/error-handler";
import { signinSchema } from "@auth/schemes/signin";
import { IAuthDocument } from "../interfaces/auth.interface";
import { IUserDocument } from "../../user/interfaces/user.interface";
import { userService } from "../../../shared/services/db/user.service";

export class SignIn {
  @joiValidation(signinSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUser: IAuthDocument = await authService.getUserByUsername(
      username
    );
    if (!existingUser) {
      throw new BadRequestError("invalid credentials");
    }

    const passwordMatch: Boolean = await existingUser.comparePassword(password);
    if (!passwordMatch) {
      throw new BadRequestError("invalid credentials");
    }

    const user: IUserDocument = await userService.getUserByAuthId(
      `${existingUser._id}`
    );

    const userJWT: string = JWT.sign(
      {
        userId: user._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor,
      },
      config.JWT_TOKEN!
    );
    req.session = { jwt: userJWT };
    res.status(HTTP_STATUS.OK).json({
      message: "User login successfully",
      user: existingUser,
      token: userJWT,
    });
  }
}
