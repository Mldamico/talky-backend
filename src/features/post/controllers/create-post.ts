import { joiValidation } from "@global/decorators/joi-validation.decorators";
import { postSchema } from "@post/schemes/post.schemes";
import { PostCache } from "@service/redis/post.cache";
import { socketIOPostObject } from "@socket/post";
import { Request, Response } from "express";
import HTTP_STATUS from "http-status-codes";
import { ObjectId } from "mongodb";
import { IPostDocument } from "../interfaces/post.interface";
import { postQueue } from "../../../shared/services/queues/post.queue";

const postCache = new PostCache();
export class CreatePost {
  @joiValidation(postSchema)
  public async post(req: Request, res: Response): Promise<void> {
    const { post, bgColor, privacy, gifUrl, profilePicture, feelings } =
      req.body;

    const postObjectId: ObjectId = new ObjectId();
    const createdPost: IPostDocument = {
      _id: postObjectId,
      userId: req.currentUser!.userId,
      username: req.currentUser!.username,
      email: req.currentUser!.email,
      avatarColor: req.currentUser!.avatarColor,
      profilePicture,
      post,
      bgColor,
      feelings,
      privacy,
      gifUrl,
      commentsCount: 0,
      imgVersion: "",
      imgId: "",
      createdAt: new Date(),
      reactions: { like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0 },
    } as IPostDocument;

    await postCache.savePostToCache({
      key: postObjectId,
      currentUserId: `${req.currentUser!.userId}`,
      uId: `${req.currentUser!.uId}`,
      createdPost,
    });

    socketIOPostObject.emit("add post", createdPost);

    postQueue.addPostJob("addPostToDB", {
      key: req.currentUser!.userId,
      value: createdPost,
    });

    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "Post created successfully" });
  }
}
