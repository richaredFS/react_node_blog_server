react_node_blog server 服务端
---项目还在完善中，目前可以使用的功能有：注册登录，发表文章，查找所有文章进行分页，根据标签查找文章进行分页！
---项目后端采用node+koa2开发，数据库使用mysql，
---项目运行
   ---cnpm install安装依赖
   ---cnpm run server 或者 node index.js启动开发环境

---项目新增pm2来管理进程
   ---利用pm2启动node程序的方法：pm2 start index.js,
   ---pm2 list 可以查看当前所有的nodejs进程

