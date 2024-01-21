import { UserInfo } from "@/common/ts/user-info";
import instance from "./config";

export const userLogin = instance.post<{ token: string } & UserInfo>("/user/login");

export const userRegistry = instance.post("/user/registry");

export const getUserInfo = instance.get<UserInfo>("/user/info");

export const updatePass = instance.post("/user/update_pass")