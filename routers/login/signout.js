let router=require('koa-router')();

router.get('/signout',async (ctx,next)=>{
    console.log(ctx.request.session)
    ctx.response.session=null;
    console.log('退出成功');
    ctx.response.body={
        resultCode:0,
        result:true
    }

})

module.exports=router