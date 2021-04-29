const Joi = require('joi');
const jwt = require('jsonwebtoken');
const secret = require('crypto').randomBytes(64).toString('hex');


function handleInformation(req, res){
    const { error } = validateToken(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const data = {
        "authenticated": req.body.authenticated,
        "iss": req.body.iss,
        "facility": req.body.facility,
        "roles": req.body.roles
    }
    const token = jwt.sign(data, secret);
    res.send(token);
}


function validateToken(data){
    const schema = Joi.object({
        authenticated : Joi.boolean(),
        iss : Joi.string(),
        facility : Joi.array(),
        roles : Joi.array().items(Joi.string().valid('Admin', 'Practitioner')),
    });
    return schema.validate(data);
}


function authenticateToken(req, res, next){
    const authHeader = req.headers['x-vamf-jwt'];
    const token = authHeader.split(" ")[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, secret,(err, headerData) =>{
        if(err) return res.sendStatus(403);
        req.headerData = headerData;
        next();
    });
}


module.exports.handleInformation = handleInformation;
module.exports.authenticateToken = authenticateToken;