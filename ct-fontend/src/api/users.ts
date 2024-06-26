import { UserInfo } from "@/common/ts/user-info";
import instance from "./config";
import { viewerInfoReq } from "@/common/types";

export const userLogin = instance.post<{ token: string } & UserInfo>("/user/login");

export const userRegistry = instance.post("/user/registry");

export const getUserInfo = instance.get<UserInfo>("/user/info", { hideToast: true });

export const updateUserPass = instance.post("/user/update_pass");

export const updateUserInfo = instance.post("/user/update_userinfo");

export const getViewerInfo = instance.get<viewerInfoReq>("/user/user_info");

export const follwerOrCancel = instance.post("/concern/follower_or_cancel");

export const getFollowers = instance.get<{ followed: number, follower: number }>("/concern/followers");

export const getFollowList = instance.get<{ users: Array<{ userId: number, username: string, avatarSrc: string, biography: string }> }>("/concern/follow-list")

export const signOut = instance.post('/user/quit')

export const searchUser = instance.get<{ users: Array<{ userId: number, username: string, avatarSrc: string, biography: string }> }>('/user/search_user')