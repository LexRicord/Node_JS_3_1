    const URL = require("url");

    const {WriteToJson} = require('./sqlService');
    const {WriteError} = require('./sqlService');

    function getSubstring(str, char1, char2) {
        return str.substring(
            str.indexOf(char1),
            str.indexOf(char2) + 1
        );
    }
    exports.PostHandler = (url, req, res,faculty,pulpit,client) =>
    {
        let pathParts = url.split('/');
        const parsedUrl = URL.parse(url);
        let body = '';
        switch (true) {
            case url === '/api/faculties' || url === '/api/faculties/':

                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let facultyToInsert = JSON.parse(body);
                    faculty.insertOne(facultyToInsert).then(r =>
                        WriteToJson(facultyToInsert, res)
                    ).catch(err => {
                        WriteError(err, res);
                    });
                });

                break;
                case url === '/api/pulpits' || url === '/api/pulpits/':
                req.on('data', chunk => {
                    body += chunk.toString();
                } );
                req.on('end', () => {
                    let pulpitToInsert = JSON.parse(body);
                    pulpit.insertOne(pulpitToInsert).then(r => {
                        WriteToJson(pulpitToInsert, res)
                    }).catch(err => {
                        WriteError(err, res);
                    }
                    );
                });
                break;
            case  url ===  "/transaction":
                req.on('data', chunk => {
                        body += chunk.toString().trim();
                }
                );
                req.on('end', async () => {
                    let arrStr = [], inputStr = [];
                    let interString, bodyString = body;
                    let c = 1;
                    let strLength;

                    interString = getSubstring(bodyString,'[',']');
                    arrStr[0] = interString;
                    strLength = bodyString.split('[')[0].length;
                    bodyString = bodyString.substring(strLength+1);
                    while (c < 5){
                        strLength = bodyString.split('[')[0].length;
                        if (strLength == 0) break;
                        bodyString = bodyString.substring(strLength);
                        interString = getSubstring(bodyString,'[',']');
                        arrStr[c] = interString;
                        c++;
                    }
                    let PulpitsToInsert = JSON.parse(arrStr.join().split("],[").join(','));
                    //inputStr = PulpitsToInsert.split(/,/);
                    let session = client.startSession();
                    session.startTransaction();
                    try {
                        let i = 0
                        for (i; i < PulpitsToInsert.length; i++)
                        {
                            await pulpit.insertOne(PulpitsToInsert[i]);
                            //console.log(PulpitsToInsert[i]);
                        }
                        await session.commitTransaction();
                        session.endSession();
                        WriteToJson(PulpitsToInsert, res);
                        console.log("Transaction committed.");
                    }
                    catch (err) {
                        await session.abortTransaction();
                        console.log(`Transaction aborted. Caught exception: ${err}`);
                        session.endSession();
                        WriteError(err, res);
                    }
                    finally {
                        session.endSession();
                    }
                });
                break;
            default:
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Not found');

        }

    }