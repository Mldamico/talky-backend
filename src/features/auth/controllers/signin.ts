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
import {
  IUserDocument,
  IResetPasswordParams,
} from "../../user/interfaces/user.interface";
import { userService } from "../../../shared/services/db/user.service";
import { mailTransport } from "@service/emails/mail-transport";
import { forgotPasswordTemplate } from "../../../shared/services/emails/templates/forgot-password/forgot-password-template";
import { emailQueue } from "../../../shared/services/queues/email.queue";
import moment from "moment";
import publicIp from "ip";
import { resetPasswordTemplate } from "../../../shared/services/emails/templates/reset-password/reset-password-template";
export class SignIn {
  @joiValidation(signinSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUser: IAuthDocument = await authService.getUserByUsername(
      username
    );
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatch: Boolean = await existingUser.comparePassword(password);
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
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
    await mailTransport.sendEmail(
      "frida88@ethereal.email",
      "Testing development email",
      "This is a test email"
    );

    const templateParams: IResetPasswordParams = {
      username: existingUser.username,
      email: existingUser.email,
      ipaddress: publicIp.address(),
      date: moment().format("DD/MM/YYYY HH:mm"),
    };

    const template: string =
      resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    emailQueue.addEmailJob("forgotPasswordEmail", {
      template,
      receiverEmail: "frida88@ethereal.email",
      subject: "Password reset confirmation",
    });
    req.session = { jwt: userJWT };
    const userDocument: IUserDocument = {
      ...user,
      authId: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
      avatarColor: existingUser.avatarColor,
      uId: existingUser.uId,
      createdAt: existingUser.createdAt,
    } as IUserDocument;
    res.status(HTTP_STATUS.OK).json({
      message: "User login successfully",
      user: userDocument,
      token: userJWT,
    });
  }
}
