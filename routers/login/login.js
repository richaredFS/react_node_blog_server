let router=require('koa-router')();
let model=require('../../sql/mysql.js');
let md5=require('md5');

router.post('/login',async (ctx,next)=>{
    let name=ctx.request.body.username;
    let pass=ctx.request.body.password;
    await model.findUserByName(name)
        .then(result =>{
            let res=JSON.parse(JSON.stringify(result));
            if (name === res[0]['name'] && md5(pass) === res[0]['pass']) {
                ctx.response.body={
                    resultCode:0,
                    result:true,
                    user:{
                        username:res[0]['name'],
                        uid:res[0]['id']
                    }
                };
                //设置session的data，方便后续拿到
                ctx.session.user=res[0]['name'];
                ctx.session.id=res[0]['id'];
                console.log('ctx.session.id',ctx.session.id);
                console.log('session',ctx.session);
                console.log('登录成功')
            }else{
                ctx.response.body={
                    resultCode:0,
                    result:false
                };
                console.log('用户名或密码错误!')
            }
        }).catch(err=>{
            ctx.response.body={
                resultCode:0,
                result:false
            };
            console.log('用户名或密码错误!')
        })
});

module.exports=router