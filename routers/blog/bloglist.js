let router=require('koa-router')();
let model=require('../../sql/mysql.js');
//发表文章的路由，post或者get需要与前端的请求方法保持一致,路由不区分大小写
router.post('/bloglist',async (ctx,next)=>{
    let start = ctx.request.body.start;
    let size = ctx.request.body.num;
    let labels = ctx.request.body.labels;
    //await后面接的是Promise对象，可以用.then()
    await model.getArticles(labels)
        .then(result=>{
            if(result.length !== 0){
                let results = JSON.parse(JSON.stringify(result));
                //把label拿出来存成数组返回
                results.map(item=>{
                    //前端有可能输入中文的逗号，先转换英文的，然后再分割
                    item.label = item.label.replace(/，/,',');
                    item.label = item.label.split(',');
                });
                ctx.response.body = {
                    resultCode:0,
                    result:true,
                    blogList:results,
                    //blog的总记录数
                    totalNum:results.length
                }
            }else{
                ctx.response.body = {
                    resultCode:0,
                    result:true,
                    blogList:[],
                    //blog的总记录数
                    totalNum:0
                }
            }
        })
});
//根据文章id获取对应的文章
router.post('/bloglist/:id',async (ctx,next)=>{
    let start = ctx.request.body.start;
    let size = ctx.request.body.num;
    let id = ctx.request.body.id;
    //await后面接的是Promise对象，可以用.then()
    await model.getArticlesById(id)
        .then(result=>{
            if(result.length !== 0){
                let results = JSON.parse(JSON.stringify(result));
                //把label拿出来存成数组返回
                results.map(item=>{
                    //前端有可能输入中文的逗号，先转换英文的，然后再分割
                    item.label = item.label.replace(/，/,',');
                    item.label = item.label.split(',');
                });
                ctx.response.body = {
                    resultCode:0,
                    result:true,
                    blogList:results,
                    //blog的总记录数
                    totalNum:results.length
                }
            }else{
                ctx.response.body = {
                    resultCode:0,
                    result:false
                }
            }
        })
});
//根据id插入对应的浏览数P
router.post('/flushPv',async (ctx,next)=>{
    let id = ctx.request.body.id;
    //await后面接的是Promise对象，可以用.then()
    await model.updatePvById(id)
        .then(result=>{
            if(result.length !== 0){
                let results = JSON.parse(JSON.stringify(result));
                ctx.response.body = {
                    resultCode:0,
                    result:true
                }
            }else{
                ctx.response.body = {
                    resultCode:0,
                    result:false
                }
            }
        })
});
//根据id插入对应的评论数
router.post('/flushComment',async (ctx,next)=>{
    let id = ctx.request.body.id;
    //await后面接的是Promise对象，可以用.then()
    await model.updateCommentById(id)
        .then(result=>{
            if(result.length !== 0){
                let results = JSON.parse(JSON.stringify(result));
                ctx.response.body = {
                    resultCode:0,
                    result:true
                }
            }else{
                ctx.response.body = {
                    resultCode:0,
                    result:false
                }
            }
        })
});
module.exports=router;