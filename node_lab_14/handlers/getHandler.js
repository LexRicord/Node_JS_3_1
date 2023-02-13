const url = require('url');
const http = require('http');
const fs = require('fs');
const utf8 = require('utf8');
const database = require('../database')
let db = new database();

const indexPath = './resource/index.html'
function decode_utf8(s) {
    return decodeURIComponent(s);
}
function methodNotRecognized(res) {
    errorHandler(res, 0, `Method not recognised :[`);
}

function errorHandler(res, code, mess) {
    res.writeHead(500, 'yikes', { 'Content-Type': 'application/json; charset=utf-8'});
    res.end(`{"error": "${code}", "message": "${mess}"}`)
}

module.exports = (req, res) => {
    let path = url.parse(req.url).pathname;

    switch(true) {
        case path == '/': {
            try {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end(fs.readFileSync(indexPath));
            }
            catch (e) {
                errorHandler(res, 1, `Unable to read the file (${indexPath})`);
            }
            break;
        }

        case path == '/api/faculties': {
            db.getFaculties().then(records => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => { errorHandler(res, 2, error); });
            break;
        }
        
        case path == '/api/pulpits': {
            db.getPulpits().then(records => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => { errorHandler(res, 3, error); });
            break;
        }
        
        case path == '/api/subjects': {
            db.getSubjects().then(records => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => { errorHandler(res, 4, error); });
            break;
        }
        
        case path == '/api/auditoriumtypes': {
            db.getAuditoriumTypes().then(records => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => { errorHandler(res, 5, error); });
            break;
        }

        case path == '/api/auditoriums': {
            db.getAuditoriums().then(records => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => { errorHandler(res, 6, error); });
            break;
        }
        case(RegExp('^/api/faculty/[^/]*/pulpits/?$').test(path)): {
            let faculty = path.split('/')[3];
            let decodedFaculty =  decode_utf8(faculty);
            db.getPulpitsByFaculty(decodedFaculty).then(records => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => { errorHandler(res, 6, error); });
            break;
        }
        case(RegExp('^/api/auditoriumtypes/[^/]*/auditoriums/?$').test(path)) :{
            let auditType = path.split('/')[3];
            let decodedAuditType =  decode_utf8(auditType);
            db.getAuditoriumsByAuditTypes(decodedAuditType).then(records => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(records.recordset))
            }).catch(error => { errorHandler(res, 6, error); });
            break;
        }

default: {
            methodNotRecognized(res);
            break;
        }
    }
}