function handleInformation(req, res){
    let data = Buffer.from('');
    req.on('data', function (chunk) {
        data = Buffer.concat([data, chunk]);
    });

    req.on('end', function () {
        req.rawBody = data;
        let jsonArray = transformStringCsvToJson(data.toString());
        let validDoctors = getValidDoctors(jsonArray);

        if(validDoctors === null){
            res.send("Error: same id with different names!");
        }

        let result = [];
        for(doctor of validDoctors){  
            result.push(`${doctor.name}: ${doctor.facilities.join(', ')} `)
        }
        res.send(result);
    });
}

function transformStringCsvToJson(csv){
    const data = csv.replace(/\s*,\s*/g, ",").split('\r\n');
    const headers = data[0].split(',');
    data.shift();
    const content = data;
    const result = [];

    for(let value of content){
        let json = {};
        const rowValues = value.split(',');
        for(let i = 0; i < rowValues.length; i++){
            json[headers[i]] = rowValues[i];
        }
        result.push(json);
    }
    return result;
}


function getValidDoctors(jsonArray){
    let doctors = [];
    for(let json of jsonArray){
        let doctor = {
            id: json.ID,
            name: json.FamilyName + " " + json.GivenName,
        }
        if(!checkedName(doctors, doctor.name)){
            doctors.push(doctor);
        }
    }

    for(let doctor of doctors){
        if(!checkedDoctor(doctors, doctor.id, doctor.name)){
            return null;
        }
        let facilities = [];
        for(let json of jsonArray){
            if(json.ID === doctor.id && json.Active === 'true' ){
                facilities.push(json.NameId);
            }
        }
        doctor.facilities = facilities;
    }
    return doctors;
}


function checkedName(doctors, name){
    for(doctor of doctors){
        if(doctor.name === name){
            return true;
        }
        return false;
    }
}


function checkedDoctor(doctors, id, name){
    for(doctor of doctors){
        if(doctor.id === id){
            if(doctor.name === name){
                return true;
            }
            return false;
        }
    }
}


module.exports.handleInformation = handleInformation;