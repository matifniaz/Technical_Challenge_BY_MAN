const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  video: false,//Used for Enable disbale video recording
  reporterOptions: {
    charts: true, //Display Suite charts
    reportPageTitle: 'OneFootball - QA -API Automation',//Report title
    embeddedScreenshots: true, //snapshots in HTML report embedded.
    inlineAssets: true,
    saveAllAttempts: false, //ave screenshots of all test attempts, set to false to save only the last attempt
    code:false, //Display test code
    showHooks:true, //show Hook on report
    autoOpen:true, //Automatically open the report
    overwrite:true //Overwrite existing report files. 
  },

  e2e: {
    baseUrl: 'http://127.0.0.1:3030',
    watchForFileChanges: false,

    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    
  },
});
