const http = require("http");
const fs = require("fs");
const { graphql, buildSchema } = require("graphql");
const schema = buildSchema(fs.readFileSync("./schema.gql").toString());
const { DB } = require("./db");
const resolver = require("./resolver");
const errors = require("./ErrorList.json");

const PORT = 3000;

const database = DB((err) => {
  if (err) {
    console.log('DB connection failed. Error: '+ err);
  }
  console.log('DB connection established.');
});

http.createServer((req, res) => {
    switch (req.method) {
      case "POST":
        let body = "";

        req.on("data", (data) => {
          body += data;
        });

        req.on("end", () => {
          body = JSON.parse(body);
          console.log(body);
          graphql(
            schema,
            body.query,
            resolver,
            database,
            body.variables ? body.variables : {}
          )
            .then((body) => {
              let outPut = JSON.stringify(body);
              console.log(outPut);
              res.writeHead(200, {
                "Content-type": "application/json; charset=utf-8",
              });
              res.end(JSON.stringify(body));
            })
            .catch((err) => {
              error_handler(req, res, 0);
            });
        });
        break;
      default:
        error_handler(req, res, 1);
        break;
    }
  })
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

const error_handler = (req, res, errorNumber) => {
  res.writeHead(errors[errorNumber].statusCode, {
    "Content-type": "application/json; charset=utf-8",
  });
  res.end(
    JSON.stringify({
      error: errors[errorNumber].error,
      message: errors[errorNumber].message,
    })
  );
};
