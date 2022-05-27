
const statisticsData = (app, fs) => {

    // variables
    const getStatsPath = './src/server/data/getStats.json';
    const getMatchesPath = './src/server/data/getMatches.json';

    // helper methods
    const readFile = (callback, returnJson = false, filePath = getStatsPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = getStatsPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/v1/api/statistics/getStats', (req, res) => {
        fs.readFile(getStatsPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });


 // CREATE
 app.post('/v1/api/statistics/getMatches', (req, res) => {

  fs.readFile(getMatchesPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        res.status(200).send(JSON.parse(data));
    });
});


};

module.exports = statisticsData;
