const mssql = require("mssql");

const config = {
  user: 'node_user',
  password: '330420',
  server: 'ROG',
  port: 1433,
  database: "node_test",
  options: {
    trustServerCertificate: true
  }
};

function Db(cb) {
  this.getFullTable = (tableName) => {
    return new mssql.Request()
      .query(`select * from ${tableName}`)
      .then((result) => result.recordset);
  };

  this.getOneRecord = (tableName, value) => {
    return new mssql.Request()
      .query(`select * from ${tableName} where ${tableName} = '${value}'`)
      .then((result) => result.recordset);
  };

  this.deleteOneRecord = (tableName, value) => {
    return new mssql.Request()
      .query(`delete from ${tableName} where ${tableName} = '${value}'`)
      .then((result) => result.rowsAffected[0] !== 0);
  };

  this.insertOneRecord = (tableName, args) => {
    const keys = Object.keys(args).join(", ");
    const values = Object.values(args)
      .map((x) => "'" + x + "'")
      .join(", ");

    return new mssql.Request()
      .query(`insert into ${tableName}(${keys}) values (${values})`)
      .then((result) => args);
  };

  this.updateOneRecord = (tableName, args) => {
    const keys = Object.keys(args);
    const values = Object.values(args);
    const parameters = keys
      .slice(1)
      .map((x, i) => `${x} = '${values[i + 1]}'`)
      .join(", ");

    return new mssql.Request()
      .query(
        `update ${tableName} set ${parameters} where ${keys[0]} = '${values[0]}'`
      )
      .then((result) => (result.rowsAffected[0] ? args : null));
  };

  this.getTeachersByFaculty = (args, context) => {
    return new mssql.Request()
      .query(
        `select TEACHER.*, PULPIT.FACULTY from TEACHER 
        inner join PULPIT on TEACHER.PULPIT = PULPIT.PULPIT 
        inner join FACULTY on PULPIT.FACULTY = FACULTY.FACULTY 
        where FACULTY.FACULTY = '${args.FACULTY}'`
      )
      .then((result) => {
        const teachers = (obj) => {
          return {
            TEACHER: obj.TEACHER,
            TEACHER_NAME: obj.TEACHER_NAME,
            PULPIT: obj.PULPIT,
          };
        };
        const faculties = (obj) => {
          return { FACULTY: obj.FACULTY, TEACHERS: [teachers(obj)] };
        };
        const resultSet = [];

        resultSet.push(faculties(result.recordset[0]));
        result.recordset.slice(1).forEach((item) => {
          resultSet[0].TEACHERS.push(teachers(item));
        });

        return resultSet;
      });
  };

  this.getSubjectsByFaculties = (args, context) => {
    return new mssql.Request()
      .query(
        `select SUBJECT.*, PULPIT.PULPIT_NAME, PULPIT.FACULTY from SUBJECT 
        inner join PULPIT on subject.PULPIT = PULPIT.PULPIT 
        inner join FACULTY on PULPIT.FACULTY = FACULTY.FACULTY 
        where FACULTY.FACULTY = '${args.FACULTY}'`
      )
      .then((result) => {
        const subjects = (obj) => {
          return {
            SUBJECT: obj.SUBJECT,
            SUBJECT_NAME: obj.SUBJECT_NAME,
            PULPIT: obj.PULPIT,
          };
        };
        const pulpits = (obj) => {
          return {
            PULPIT: obj.PULPIT,
            PULPIT_NAME: obj.PULPIT_NAME,
            FACULTY: obj.FACULTY,
            SUBJECTS: [subjects(obj)],
          };
        };
        const resultSet = [];

        resultSet.push(pulpits(result.recordset[0]));
        result.recordset.slice(1).forEach((item) => {
          resultSet[resultSet.length - 1].PULPIT !== item.PULPIT
            ? resultSet.push(pulpits(item))
            : resultSet[resultSet.length - 1].SUBJECTS.push(subjects(item));
        });

        return resultSet;
      });
  };

  this.connect = mssql.connect(config, (err) => {
    err ? cb(err, null) : cb(null, this.connect);
  });
}

exports.DB = (cb) => new Db(cb);
