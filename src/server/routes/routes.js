// import other routes
const employeesRoutes = require('./employees');
const skillsRoutes = require('./skills');
const skillSetsRoutes = require('./skillSets');
const statisticsRoutes = require('./statistics');

const appRouter = (app, fs) => {

    // default route
    app.get('/', (req, res) => {
      console.log('Loding index.html');
      console.log(process.cwd()+"../../dist/index.html");
       res.sendFile(process.cwd()+"/dist/index.html")
    });

    // // other routes
    employeesRoutes(app, fs);
    skillsRoutes(app, fs);
    skillSetsRoutes(app, fs);
    statisticsRoutes(app, fs);


};

module.exports = appRouter;
