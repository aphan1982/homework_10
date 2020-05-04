const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

function isolateFirstName(string) {
  const spaceIndex = string.indexOf(" ");
  return string.slice(0, spaceIndex).concat();
};

// validation functions:
const blankValidate = async inquiry => {
  return (!inquiry ? "Please make a valid entry." : true);
}

const emailValidate = async inquiry => {
  if (!inquiry.includes("@") || !inquiry.includes(".") || inquiry.includes(" ")) {
    return "Please enter a valid e-mail address.";
  } else {
    return true;
  };
};

const phoneNumValidate = async inquiry => {
  if (isNaN(inquiry) || inquiry.length !== 10) {
    return "Please enter a valid, 10-digit phone number.";
  } else {
    return true;
  };
};

function generateTeam() {
  // Inquirer.js prompt:
  return inquirer.prompt([
    {
      type: "input",
      name: "managerName",
      message: "Hey there, manager! Please enter your name to begin:",
      validate: blankValidate
    },
    {
      type: "input",
      name: "managerID",
      message: "Please enter your ID:",
      validate: blankValidate
    },
    {
      type: "input",
      name: "managerEmail",
      message: "Please enter your e-mail address:",
      validate: emailValidate
    },
    {
      type: "input",
      name: "managerOfficeNum",
      message: "What is your office phone number?",
      validate: phoneNumValidate
    }
  ]);
};

function getEngineerGitHub() {
  return inquirer.prompt([
    {
      type: "input",
      name: "engineerGitHub",
      message: "What is this engineer's GitHub username?",
      validate: blankValidate
    }
  ]);
};

function getInternSchool() {
  return inquirer.prompt([
    {
      type: "input",
      name: "internSchool",
      message: "What school is this intern attending?",
      validate: blankValidate
    }
  ]);
};

function populateTeam() {
  return inquirer.prompt([
    {
      type: "list",
      name: "employeeRole",
      message: "What role does your next employee have?",
      choices: [ "Engineer", "Intern" ]
    },
    {
      type: "input",
      name: "employeeName",
      message: "What's this employee's name?",
      validate: blankValidate
    },
    {
      type: "input",
      name: "employeeID",
      message: "What's this employee's ID?",
      validate: blankValidate
    },
    {
      type: "input",
      name: "employeeEmail",
      message: "What is this employee's e-mail address?",
      validate: emailValidate
    }
  ]);
};

generateTeam()
  .then(inquiry => {
    // array to hold employee objects:
    const employees = [];

    // parses Manager's office number into telephone format:
    inquiry.managerOfficeNum = `(${inquiry.managerOfficeNum.slice(0, 3).concat()}) ${inquiry.managerOfficeNum.slice(3, 6).concat()}-${inquiry.managerOfficeNum.slice(6).concat()}`;

    // creates new Manager object and pushes it into employees[]:
    const managerResult = new Manager(inquiry.managerName, inquiry.managerID, inquiry.managerEmail, inquiry.managerOfficeNum);

    employees.push(managerResult);
    
    // Addresses the user by given first name and confirms the setting of Manager ID (the numbers and symbols in the console.log() sets the color of the terminal text):
    const managerForename = isolateFirstName(managerResult.name);
    console.log(`\x1b[32m%s\x1b[0m%s\x1b[32m%s\x1b[0m%s\x1b[33m%s\x1b[0m%s\x1b[33m%s\x1b[0m%s\x1b[33m%s\x1b[35m%s\x1b[0m`, `\nSuccess! `, `I've generated your profile, `, `${managerForename}!`, `\nI have your ID as `, `${managerResult.id},`, `\nyour e-mail address as `, `${managerResult.email},`, `\nand your office number as `, `${managerResult.officeNumber}.\n`, `\nNow let's get to your team.\n`);

    // Adds new employees to the team:
    populateTeam()
    .then(inquiry => {
      if (inquiry.employeeRole === "Engineer") {
        const engineerResult = new Engineer(inquiry.employeeName, inquiry.employeeID, inquiry.employeeEmail);
        getEngineerGitHub()
        .then(inquiry => {
          engineerResult.github = inquiry.engineerGitHub;
        })
      }
    });
  })
  .catch(error => console.log(error));
// });
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
