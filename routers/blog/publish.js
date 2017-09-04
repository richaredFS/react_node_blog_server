let router=require('koa-router')();
let model=require('../../sql/mysql.js');
let moment=require('moment');
//发表文章的路由，post或者get需要与前端的请求方法保持一致
router.post('/publish',async (ctx,next)=>{
    console.log(ctx.request.body);
    let title = ctx.request.body.title;
    let description = ctx.request.body.description;
    let content = ctx.request.body.content;
    let label = ctx.request.body.label;
    let uid=ctx.request.body.uid;
    let author=ctx.request.body.username;
    let createTime=moment().format('YYYY-MM-DD HH:mm');
    console.log(uid)
    console.log(author)
    //await后面接的是Promise对象，可以用.then()
    await model.insertArticle([title,description,content,label,uid,author,createTime])
        .then(result=>{
            console.log(result);
            ctx.response.body = {
                resultCode:0,
                result:true
            }
        })
});
module.exports=router;