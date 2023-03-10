const url = require('url');
const http = require('http');
const fs = require('fs');

const database = require('../database')
let db = new database();

function methodNotRecognized(res) {
    errorHandler(res, 0, `Method not recognised :[`);
}

function errorHandler(res, code, mess) {
    res.writeHead(500, 'yikes', { 'Content-Type': 'application/json; charset=utf-8'});
    res.end(`{"error": "${code}", "message": "${mess}"}`)
}

module.exports = (req, res) => {
    let path = decodeURI(url.parse(req.url).pathname);
    pathParameters = path.split('/');
    let jsonData = '';

    switch('/api/' + pathParameters[2]) {
        case '/api/faculties': {
            res.writeHead(200, {'Content-Type': 'application/json'});
            db.findFaculty(pathParameters[3]).then((result) => {
                if(result.recordset.length == 0) throw 'Faculty not found';
                res.write(JSON.stringify(result.recordset));
            }).catch(error => { errorHandler(res, 22, error); });

            db.deleteFaculty(pathParameters[3]).then(records => {
                res.end();
            }).catch(error => { errorHandler(res, 23, error); });            
            break;
        }
        
        case '/api/pulpits': {
            res.writeHead(200, {'Content-Type': 'application/json'});
            db.findPulpit(pathParameters[3]).then((result) => {
                if(result.recordset.length == 0) throw 'Pulpit not found';
                res.write(JSON.stringify(result.recordset));
            }).catch(error => { errorHandler(res, 24, error); });

            db.deletePulpit(pathParameters[3]).then(records => {
                res.end();
            }).catch(error => { errorHandler(res, 25, error); });
            
            break;
        }
        
        case '/api/subjects': {
            res.writeHead(200, {'Content-Type': 'application/json'});
            db.findSubject(pathParameters[3]).then((result) => {
                if(result.recordset.length == 0) throw 'Subject not found';
                res.write(JSON.stringify(result.recordset));
            }).catch(error => { errorHandler(res, 26, error); });

            db.deleteSubject(pathParameters[3]).then(records => {
                res.end();
            }).catch(error => { errorHandler(res, 27, error); });
            
            break;
        }
        
        case '/api/auditoriumtypes': {
            res.writeHead(200, {'Content-Type': 'application/json'});
            db.findAuditoriumType(pathParameters[3]).then((result) => {
                if(result.recordset.length == 0) throw 'Auditorium type not found';
                res.write(JSON.stringify(result.recordset));
            }).catch(error => { errorHandler(res, 28, error); });

            db.deleteAuditoriumType(pathParameters[3]).then(records => {
                res.end();
            }).catch(error => { errorHandler(res, 29, error); });
            
            break;
        }

        case '/api/auditoriums': {
            res.writeHead(200, {'Content-Type': 'application/json'});
            db.findAuditorium(pathParameters[3]).then((result) => {
                if(result.recordset.length == 0) throw 'Auditorium not found';
                res.write(JSON.stringify(result.recordset));
            }).catch(error => { errorHandler(res, 30, error); });

            db.deleteAuditorium(pathParameters[3]).then(records => {
                res.end();
            }).catch(error => { errorHandler(res, 31, error); });
            
            break;
        }

        default: {
            methodNotRecognized(res);
            break;
        }
    }
}