# 封装axios
- 基本配置：公共url前缀+超时重传（最多重传1次，超时时间设置为4s）
  - | ECONNABORTED | Request timed out due to exceeding timeout specified in axios configuration.
  - | ETIMEDOUT | Request timed out due to exceeding default axios timelimit.
  - 在http.js文件中，只有config.transitional 中clarifyTimeoutError为true且超时了才会返回ETIMEOUT错误码
- 统一Loading处理
  - 细想了还是不这么做比较好，如果发出了请求展示loading，请求还没有得到响应就返回上一级导致loading还在
- 避免重复请求（这里的重复是指相同的请求（同url、query、params）已经发出但是还没有返回响应）
  - 给conifg添加AbortController，然后调用取消方法即可
- 统一错误处理（针对code!=200）
  - 给出提示
- 封装GET和POST请求方法

# 聊天室
1. 后端实现分页+前端实现滚动到顶部向后端拉取数据
  - touch等事件判断是否到达顶部比较麻烦，需要知道可视区域处于scrollHeigh那一部分，还需要累加偏移量，考虑使用vue指令+intersection observe实现
2. 首次进入和发送消息都需要滚动到底部
  - 使用scrollIntoView实现
3. 发送消息和如果对方在线则需要通知
  - 使用接口发送消息，后端接收到请求后使用sse向对方发送通知
  - 如果对方本身就在聊天页面，则需要使用websocket实现即时接收
4. 展示时间问题，如何划分间隔？

## 问题
- 滚动底部问题
  - scrollTop = scrollHeight 无效？
  - 考虑使用scrollIntoView实现
- 为什么onMounted中调用scrollIntoView失效？