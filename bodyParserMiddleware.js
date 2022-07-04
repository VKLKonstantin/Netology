

const message = function messages(req,res,next){
var message;
res.locals.message = message;
next();
}

module.exports = message