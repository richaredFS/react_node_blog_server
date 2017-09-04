let router=require('koa-router')();
let model=require('../../sql/mysql.js');
//获取所有标签的路由
router.post('/labellist',async (ctx,next)=>{
    let start = ctx.request.body.start;
    let size = ctx.request.body.num;
    //await后面接的是Promise对象，可以用.then()
    await model.getLabels()
        .then(result=>{
            if(result.length !== 0){
                //JSON.parse(JSON.stringify(result))结果是数组
                let labels = JSON.parse(JSON.stringify(result));
                //先把中文逗号转换为英文
                labels.map(item=>{
                    item.label = item.label.replace(/，/,',');
                });
                let arrTemp = [], arr = [];
                labels.map(item=>{
                   arrTemp.push(item.label)
                });
                arrTemp.map(item=>{
                    if(item.indexOf(',')!==-1){
                        let arr2 = item.split(',');
                        arr2.map(item=>{
                            if(arr.indexOf(item) === -1){
                                arr.push(item);
                            }
                        })
                    }else{
                        if(arr.indexOf(item) === -1){
                            arr.push(item);
                        }
                    }
                });
                ctx.response.body = {
                    resultCode:0,
                    result:true,
                    labelList:arr,
                    //blog的总记录数
                    totalNum:arr.length
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