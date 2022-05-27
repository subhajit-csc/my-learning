
const getEmployeesData = (app, fs) => {

    // variables
    const dataPath = './src/server/data/employees.json';
    // variables
    const employeePath = './src/server/data/employee.json';

    // helper methods
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/v1/api/employees', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // READ
    app.get('/v1/api/employees/:id', (req, res) => {
        fs.readFile(employeePath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });



    // CREATE
    app.post('/v1/api/employees', (req, res) => {

	    fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.status(200).send(JSON.parse(data));
        });
    });



};

module.exports = getEmployeesData;
