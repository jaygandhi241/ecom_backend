class ApiFeatures{
    constructor(query,querystr){
        this.query =query;
        this.querystr=querystr;
    }
    search(){
        const keyword=this.querystr.keyword ? {name:{$regex:this.querystr.keyword,$options:"1"}}:{}
        this.query=this.query.find({...keyword})
        return this;
    }
    filter(){
        const querycopy={...this.querystr}
        console.log(querycopy);
        const removefield=["keyword","page","limit"]
        removefield.forEach(key=>delete querycopy[key])
        this.query=this.query.find(querycopy)
        return this
    }
    pagination(resultpage){
        const currentpage=Number(this.querystr.page)||1;
        const skip =resultpage *(currentpage-1)
        this.query=this.query.limit(resultpage).skip(skip)
        return this
    }
}
module.exports=ApiFeatures