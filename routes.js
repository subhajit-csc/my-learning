// import other routes
const userRoutes = require('./users');
const authTokenRouter = require('./issue-token');
const productLocationRouter = require('./productlocation');
const getTraxEventsRouter= require('./sdc-getTraxEvents');
const barcodeLookupRouter= require('./barcoad-lookup');
const getRangeDataRouter= require('./sdc-getRangeData');

const appRouter = (app, fs) => {

    // default route
    app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
    });

    // // other routes
    userRoutes(app, fs);
	authTokenRouter(app, fs);
	productLocationRouter(app, fs);
	getTraxEventsRouter(app, fs);
	barcodeLookupRouter(app, fs);
	getRangeDataRouter(app, fs);

};

module.exports = appRouter;