import { InteractionTypeMap, NotifyStateMap, NotifyTypeMap } from "@src/constant/notify";
import { serviceError } from "@src/constant/resp.constant";
import { getSSEConn } from "@src/router/sse.router";
import ConcernsService from "@src/service/concerns.service";
import NotifyController from '@src/controller/notify.controller'
import UsersService from "@src/service/users.service";
import type { Request, Response } from "express";
import { Follow } from "@src/constant/concern.constant";
import { Model } from "sequelize";

const { remove, add, count, searchByPage } = ConcernsService;
const { precisionFind } = UsersService
const { addNotify } = NotifyController

class ConcernController {
  follwerOrCancel(req: Request, resp: Response) {
    const { id, viewer_id, is_follwer } = req.body;
    (is_follwer ? remove({ id, viewer_id }) : add({ id, viewer_id }))
      .then(() => {
        if (!is_follwer) {
          addNotify({ type: NotifyTypeMap.concern, state: NotifyStateMap.unread, userId: id, receiverId: viewer_id })
            .then((res) => {
              // 如果在线就通知，且没有通知过
              if (res) {
                const sse = getSSEConn(viewer_id)
                sse && sse.write({ data: { type: InteractionTypeMap["comment-follow"] } })
              }
            })
            .catch(err => {
              console.error(`${viewer_id}通知失败:${err}`)
            })
        }
        resp.send({ code: 200, msg: '操作成功' });
      })
      .catch(err => {
        console.log(`关注或取消操作失败：${err}`);
        resp.send(serviceError);
      })
  }
  async getFollowers(req: Request, resp: Response) {
    const id = Number(req.query.id)
    try {
      const [followed, follower] = await Promise.all([count({ followed: id }), count({ follower: id })])
      resp.send({
        code: 200,
        data: {
          followed,
          follower
        }
      })
    } catch (e) {
      console.error(`拉取粉丝和关注者失败：${e}`)
      return resp.send(serviceError)
    }
  }
  async getFollowList(req: Request, resp: Response) {
    const userId = Number(req.query.id), idx = Number(req.query.idx), page_num = Number(req.query.page_num)
    let result: Model<any, any>[] = []
    console.log(userId, idx, 'num')
    switch (idx) {
      case Follow.follower: // 关注者
        result = await searchByPage({ page_num, follower: userId })
        break
      case Follow.followed: // 被关注者
        result = await searchByPage({ page_num, followed: userId })
        break
    }
    const users: Array<{ userId: number, username: string, avatarSrc: string, biography: string }> = []
    console.log(result, 'resu')
    for (let i = 0, len = result.length; i < len; ++i) {
      const data = result[i].dataValues
      let user: Model<any, any> | null = null
      switch (idx) {
        case Follow.follower:
          user = await precisionFind({ id: data.followed })
          break
        case Follow.followed:
          user = await precisionFind({ id: data.follower })
          break
      }
      users.push({
        userId: user?.dataValues.id,
        username: user?.dataValues.username,
        avatarSrc: user?.dataValues.avatarSrc,
        biography: user?.dataValues.biography
      })
    }

    resp.send({
      code: 200,
      data: {
        users
      }
    })
  }
}

export default new ConcernController();
