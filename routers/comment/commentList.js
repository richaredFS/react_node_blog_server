let router=require('koa-router')();
let model=require('../../sql/mysql.js');
let moment=require('moment');
//获取所有评论的路由
router.post('/commentlist',async (ctx,next)=>{
    let start = ctx.request.body.start;
    let size = ctx.request.body.num;
    let postid = ctx.request.body.id;
    //await后面接的是Promise对象，可以用.then()
    await model.getComments(postid)
        .then(result=>{
            if(result.length !== 0){
                let results = JSON.parse(JSON.stringify(result));
                ctx.response.body = {
                    resultCode:0,
                    result:true,
                    commentList:results,
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
//根据postid插入评论的路由
router.post('/publishComment',async (ctx,next)=>{
    let postid = ctx.request.body.id;
    let content = ctx.request.body.content;
    let commentator = ctx.request.body.commentator;
    let createTime=moment().format('YYYY-MM-DD HH:mm');
    console.log(commentator)
    //await后面接的是Promise对象，可以用.then()
    await model.insertCommentsById([postid,content,commentator,createTime])
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