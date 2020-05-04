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

function generateTeam() {
  // validation functions:
  const emailTest = async (inquiry) => {
    if (!inquiry.includes("@") || !inquiry.includes(".") || inquiry.includes(" ")) {
      return "Please enter a valid e-mail address.";
    } else {
      return true;
    };
  };
  const phoneNumTest = async (inquiry) => {
    if (isNaN(inquiry) || inquiry.length !== 10) {
      return "Please enter a valid, 10-digit phone number.";
    } else {
      return true;
    };
  };
  // Inquirer.js prompt:
  return inquirer.prompt([
    {
      type: "input",
      name: "managerName",
      message: "Hey there, manager! Please enter your name to begin:"
    },
    {
      type: "input",
      name: "managerID",
      message: "Please enter your ID:"
    },
    {
      type: "input",
      name: "managerEmail",
      message: "Please enter your e-mail address:",
      validate: emailTest
    },
    {
      type: "input",
      name: "managerOfficeNum",
      message: "What is your office phone number?",
      validate: phoneNumTest
    }
  ]);
};

function populateTeam() {
  return inquirer.prompt([
    {
      type: "input",
      name: "continue",
      message: "Alright, let's start with your team. Enter the next name."
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
    
    // Addresses the user by given first name and informs of successful setting of Manager ID:
    const managerForename = isolateFirstName(managerResult.name);
    console.log(`Success! I've generated your profile, ${managerForename}! I have your ID as ${managerResult.id}, your e-mail address as ${managerResult.email}, and your office number as ${managerResult.officeNumber}.`);


    populateTeam()
    .then(inquiry => {
      console.log(`Great! Your first team member's name is ${inquiry.continue}.`);
      console.log(`TO SUM UP:\nManager name: ${inquiry.managerName}\nManager ID: ${inquiry.managerID}\nManager email: ${inquiry.managerEmail}\nManager phone number: ${inquiry.managerOfficeNum}\nEmployee name: ${inquiry.continue}`);
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
