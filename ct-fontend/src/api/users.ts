import { UserInfo } from "@/common/ts/user-info";
import instance from "./config";
import { PostFirstArg } from './types'
import { viewerInfoReq } from "@/common/types";

export const userLogin = instance.post<{ token: string } & UserInfo>("/user/login");

export const userRegistry = instance.post("/user/registry");

export const getUserInfo = instance.get<UserInfo>("/user/info");

export const updateUserPass = instance.post("/user/update_pass");

export const updateUserInfo = instance.post<PostFirstArg, FormData>("/user/update_userinfo");

export const dynamicGetDatas = instance.get("/user/dynamic_datas");

export const getViewerInfo = instance.get<viewerInfoReq>("/user/user_info");

export const follwerOrCancel = instance.post("/concern/follower_or_cancel");
