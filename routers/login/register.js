let router=require('koa-router')();
let model=require('../../sql/mysql.js');
let md5=require('md5');
//注册的路由，post或者get需要与前端的请求方法保持一致
router.post('/register',async (ctx,next)=>{
    console.log(ctx.request.url)
    let user={
        name:ctx.request.body.username,
        pass:ctx.request.body.password,
        repeatpass:ctx.request.body.repPass
    };
    //await后面接的是Promise对象，可以用.then()
    await model.findUserByName(user.name)
        .then(result=>{
            console.log(result);
            if (result.length){
                try {
                    throw Error('用户存在')
                }catch (error){
                    //处理err
                    console.log(error)
                }
                //total=1表示用户存在
                ctx.response.body={
                    result:false,
                    resultCode:0
                }
            }else{
                //total=0表示用户不存在
                ctx.response.body={
                    result:true,
                    resultCode:0
                };
                console.log('注册成功');
                //以数组的形式传sql语句的参数
                model.insertUser([ctx.request.body.username,md5(ctx.request.body.password)])
            }
        })
});
module.exports=router;