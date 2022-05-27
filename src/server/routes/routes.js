// import other routes
const employeesRoutes = require('./employees');
const skillsRoutes = require('./skills');
const skillSetsRoutes = require('./skillSets');
const statisticsRoutes = require('./statistics');

const appRouter = (app, fs) => {

    // default route
    app.get('/', (req, res) => {
       res.sendFile(process.cwd()+"/my-app/dist/angular-nodejs-example/index.html")
    });

    // // other routes
    employeesRoutes(app, fs);
    skillsRoutes(app, fs);
    skillSetsRoutes(app, fs);
    statisticsRoutes(app, fs);


};

module.exports = appRouter;
