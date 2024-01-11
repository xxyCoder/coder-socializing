import instance from "./config";

export const userLogin = instance.post<{ token: string, username: string }>("/user/login");

export const userRegistry = instance.post("/user/registry");

export const userModInfo = instance.post("/user");

export const userLogout = instance.post("/user");