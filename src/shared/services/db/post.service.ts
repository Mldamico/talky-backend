import { PostModel } from "@post/models/post.schema";
import { IUserDocument } from "@user/interfaces/user.interface";
import { UserModel } from "@user/models/user.schema";
import { UpdateQuery } from "mongoose";
import { IPostDocument } from "../../../features/post/interfaces/post.interface";

class PostService {
  public async addPostToDB(
    userId: string,
    createdPost: IPostDocument
  ): Promise<void> {
    const post: Promise<IPostDocument> = PostModel.create(createdPost);
    const user: UpdateQuery<IUserDocument> = UserModel.updateOne(
      { _id: userId },
      { $inc: { postsCount: 1 } }
    );
    await Promise.all([post, user]);
  }
}

export const postService: PostService = new PostService();