import { UserInfo } from "@/common/ts/user-info";
import instance, { type PostFirstArg } from "./config";

export const userLogin = instance.post<{ token: string } & UserInfo>("/user/login");

export const userRegistry = instance.post("/user/registry");

export const getUserInfo = instance.get<UserInfo>("/user/info");

export const updateUserPass = instance.post("/user/update_pass");

export const updateUserInfo = instance.post<PostFirstArg, FormData>("/user/update_userinfo");