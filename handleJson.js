const Joi = require('joi');

const doctorsId = [];
let doctors = [];


function handleInformation(req, res){
    const { error } = validateDoctor(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const doctor = {
        resourceType: req.body.resourceType,
        id: req.body.id,
        name: req.body.name,
        facility: req.body.facility,
        active: req.body.active
    }

    if(doctorsId.includes(doctor.id)){
        return res.status(400).send("Id already exists!");
    }

    doctorsId.push(doctor.id);
    doctors.push(doctor);

    if(req.body.active == true){
        const doctor = {
            name: req.body.name,
            facility: req.body.facility
        };
        res.send(doctor);
    }
    res.send(doctor);
}


function validateDoctor(doctor){
    const schema = Joi.object({
        resourceType: Joi.string().valid('Practitioner'),
        id: Joi.string().required(),
        name: Joi.array(),
        facility: Joi.array().unique('value'),
        active: Joi.boolean()
    });
    return schema.validate(doctor);
}


module.exports.handleInformation = handleInformation;