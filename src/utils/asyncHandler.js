const asyncHandler = async(fn) =>{
    try{
        return await fn();
    }catch(err){
        console.log(err);
        throw err;
    }
}
export default asyncHandler;