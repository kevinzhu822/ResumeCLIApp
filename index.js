#!/usr/bin/env node

"use strict";

var inquirer = require("inquirer");
var chalk = require("chalk");
var clear = require('clear');
var request = require("request");




var header = chalk.bold.underline;
var yellow = chalk.yellow.bold;
var blue = chalk.blue.bold;
var cyan = chalk.cyan;
var regular = chalk.white;

var resume = require("./resume.json");


var mainMenu = {
    type: "list",
    name: "resumeOptions",
    message: yellow("What do you want to know about me?"),
    choices: [...Object.keys(resume), new inquirer.Separator(""), "Exit"],
    pageSize: "10"
};

var skillsMenu = {
    type: "list",
    name: "skillOptions",
    message: yellow("Which of my skill categories do you want to learn about?"),
    choices: [...Object.keys(resume.Skills), new inquirer.Separator(), "Back to Main Menu", "Exit"],
    pageSize: "10"

};

var experienceMenu = {
    type: "list",
    name: "experienceOptions",
    message: yellow("Which of my experiences do you want to learn more about?"),
    choices: [...Object.keys(resume["Past Experiences"]), new inquirer.Separator(), "Back to Main Menu", "Exit"],
    pageSize: "10"
};

var projectsMenu = {
    type: "list",
    name: "projectOptions",
    message: yellow("Which of my projects do you want to learn more about?"),
    choices: [...Object.keys(resume["Projects"]), new inquirer.Separator(), "Back to Main Menu", "Exit"]
};

var introductionQuestions = [
	{
    type: 'input',
    name: "name",
    message: "What's your name?",
    validate: (res) => {
      if(!res.length || res=="abc" || res=="asd" || res=="xyz" || res=="aaa")
        return('Invalid name');
      else return true;
    }
  },
  {
    type: 'input',
    name: "email",
    message: "What's your email?",
    validate: (res) => {
      const reg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      if(reg.test(res))
        return true;
      else return('Please enter valid email.');
    }
  }
];

const widthOfTerminal = process.stdout.columns;

function drawTopDivider() {
	console.log("┏" + "━".repeat(widthOfTerminal-4) + "┓");
}

function drawMidDivider() {
	console.log("┃" + "━".repeat(widthOfTerminal-4) + "┃");
}

function drawBotDivider() {
	console.log("┗" + "━".repeat(widthOfTerminal-4) + "┛");
}

function centerText(text, style) {
	var leftoverSpaces = widthOfTerminal - text.length;
	if (leftoverSpaces % 2 != 0) {
		leftoverSpaces = leftoverSpaces - 1;
	}

	var sideSpace = leftoverSpaces / 2;
	console.log(" ".repeat(sideSpace) + style(text) + " ".repeat(sideSpace));
}

function alignText(text, style, longest) {
	var leftoverSpaces = widthOfTerminal - longest;
	if (leftoverSpaces % 2 != 0) {
		leftoverSpaces = leftoverSpaces - 1;
	}

	var sideSpace = leftoverSpaces / 2;
	console.log(" ".repeat(sideSpace-1) + "- "+style(text) + " ".repeat(sideSpace-1));

}

function centerTextMultiple(text1, text2, style1) {
	var leftoverSpaces = widthOfTerminal - text1.length - text2.length;
	if (leftoverSpaces % 2 != 0) {
		leftoverSpaces = leftoverSpaces - 1;
	}

	var sideSpace = leftoverSpaces / 2;
	console.log(" ".repeat(sideSpace) + style1(text1) + text2 + " ".repeat(sideSpace));
}

async function main() {
	clear();
	await introduction(inquirer);
    resumeHandler(true);
  
}

async function introduction(inquirer) {
		console.clear();
		console.log("Hey! Thanks for visiting my resume!");
		console.log("Before we begin, can you answer a few questions?");
		await inquirer.prompt(introductionQuestions).then(intro => {
		    console.clear();
		    console.log("\n");
		    console.log(" ", `Hey ${intro.name}!`);
		    recordVisitor(intro.name, intro.email);
	  	})
}	

function recordVisitor(visitorName, visitorEmail) {
	var options = { method: 'POST',
	  url: 'https://resumedata-ff5c.restdb.io/rest/visitor-data',
	  headers: 
	   { 'cache-control': 'no-cache',
	     'x-apikey': '030e3abaeef7a980d7e8fcf25f331a2096ac5',
	     'content-type': 'application/json' },
	  body: { Name: visitorName, Email: visitorEmail},
	  json: true };


  	request(options, function (error, response, body) {
		if (error) throw new Error(error);
  		// console.log(body);
	});

}



function resumeHandler(init) {
	if (init == null) {
		clear()
	}
	console.log('\n');
    console.log(" ", blue.underline("Kevin Zhu's Resume"));
    inquirer.prompt(mainMenu).then(answer => {
        if (answer.resumeOptions == "Exit") {
        	clear();
            return;
        }

        var option = answer.resumeOptions;
        if (answer.resumeOptions == "Contact Information") {
            contactHandler();
            return;
        }

        if (answer.resumeOptions == "Education") {
            educationHandler();
            return;
        }

        if (answer.resumeOptions == "Skills") {
            skillHandler();
            return;
        }

        if (answer.resumeOptions == "Past Experiences") {
            experienceHandler();
            return;
        }

        if (answer.resumeOptions == "Projects") {
            projectHandler();
            return;
        }
    });
}

function dataStylerAndPrint(string) {
    var colonIndex = string.indexOf(":");
    if (colonIndex != -1) {
        var beforeColon = string.slice(0, colonIndex + 1);
        var afterColon = string.slice(colonIndex + 1);
        console.log(" ", blue(beforeColon), chalk.bold.white(afterColon));
    } else {
        console.log(" ", blue(string));
    }

}

function contactHandler() {
    clear();
    console.log("\n");
    centerText("Contact Information", regular.bold);
	drawTopDivider();
    var counter = 0;
    resume[`${"Contact Information"}`].forEach(info => {
    	var colonIndex = info.indexOf(":");
        var beforeColon = info.slice(0, colonIndex);
        var afterColon = info.slice(colonIndex + 1);
        centerText(beforeColon, yellow);
        centerText(afterColon, cyan)
        counter = counter + 1;
        if (counter == resume[`${"Contact Information"}`].length) {
        	drawBotDivider();
        } else {
	        drawMidDivider();
        }
        
    });
    console.log("\n");
    actionHandler();
    return;
}

function educationHandler() {
    clear();
    console.log("\n");
    centerText("Education", regular.bold);
    drawTopDivider();
    var counter = 0;
    resume[`${"Education"}`].forEach(info => {
        var colonIndex = info.indexOf(":");
        var beforeColon = info.slice(0, colonIndex);
        var afterColon = info.slice(colonIndex + 1);
        centerText(beforeColon, yellow);
        centerText(afterColon, cyan)
        counter = counter + 1;
        if (counter == resume[`${"Education"}`].length) {
        	drawBotDivider();
        } else {
	        drawMidDivider();
        }

    });
    console.log("\n");
    actionHandler();
    return;
}

function skillHandler() {
    clear();
    console.log("\n");
    centerText("Skills", regular.bold);
    drawTopDivider();
    var counter = 0;
    resume[`${"Skills"}`].forEach(info => {
        var colonIndex = info.indexOf(":");
        var beforeColon = info.slice(0, colonIndex);
        var afterColon = info.slice(colonIndex + 1);
        centerText(beforeColon, yellow);
        centerText(afterColon, cyan)
        counter = counter + 1;
        if (counter == resume[`${"Skills"}`].length) {
        	drawBotDivider();
        } else {
	        drawMidDivider();
        }

    });
    console.log("\n");
    actionHandler();
    return;
}


function experienceHandler() {
    clear();
    specificExperienceHandler();
    return;
}

function specificExperienceHandler() {
    console.log("\n");
    console.log(" ", header("Past Experiences"));
    inquirer.prompt(experienceMenu)
        .then(choice => {
            if (choice.experienceOptions == "Back to Main Menu") {
                resumeHandler();
                return;
            }

            if (choice.experienceOptions == "Exit") {
            	clear();
                return;
            }

            if (choice.experienceOptions == "X-Matik Inc.") {
                experienceDataPrinter("X-Matik Inc.");
                console.log("\n");
                actionHandler("Past Experiences");

            }

            if (choice.experienceOptions == "CodeBase") {
                experienceDataPrinter("CodeBase");
                console.log("\n");
                actionHandler("Past Experiences");
            }

            if (choice.experienceOptions == "Uber Freight") {
                experienceDataPrinter("Uber Freight");
                console.log("\n");
                actionHandler("Past Experiences");
            }

        })
}



function experienceDataPrinter(companyName) {
    clear();
    console.log("\n");
    centerText(companyName, regular.bold);
    drawTopDivider();


    var title = resume["Past Experiences"][companyName][0];
    var date = resume["Past Experiences"][companyName][1];
    var responsibilities = resume["Past Experiences"][companyName][2];
    centerText(title, cyan);
    centerText(date, yellow);
    console.log("\n");
    // console.log(cyan(title));
    // console.log(yellow(date));

    var longest = 0;
    responsibilities.forEach(function(item) {
        longest = Math.max(longest, item.length);
    })
    responsibilities.forEach(function(item) {
        // console.log(" ", " ", "-", item);
        alignText(item, regular, longest);
    })
    console.log("\n")
    drawBotDivider();  
    return;
}

function projectDataPrinter(projectName) {
    clear();
    console.log("\n");
    centerText(projectName, regular.bold);
    drawTopDivider();

    var techStack = resume["Projects"][projectName][0];
    var details = resume["Projects"][projectName][1]
    centerText(techStack, cyan);
    console.log("\n");


    var longest = 0;
    details.forEach(function(item) {
        longest = Math.max(longest, item.length);
    })
    details.forEach(function(item) {
        // console.log(" ", " ", "-", item);
        alignText(item, regular, longest);
    })
    console.log("\n")
    drawBotDivider();  
    return;

}

function projectHandler() {
    clear();
    specificProjectHandler();
    return;
}

function specificProjectHandler() {
    console.log("\n");
    console.log(" ", header("Projects"));
    inquirer.prompt(projectsMenu)
        .then(choice => {
            if (choice.projectOptions == "Back to Main Menu") {
                resumeHandler();
                return;
            }

            if (choice.projectOptions == "Exit") {
            	clear();
                return;
            }

            if (choice.projectOptions == "HealthClear") {
                projectDataPrinter("HealthClear");
                console.log("\n");
                actionHandler("Projects");

            }

            if (choice.projectOptions == "Mobile Melanoma Tracker") {
                projectDataPrinter("Mobile Melanoma Tracker");
                console.log("\n");
                actionHandler("Projects");
            }

            if (choice.projectOptions == "NPM Resume Package (This Resume You're Reading Right Now)") {
                projectDataPrinter("NPM Resume Package (This Resume You're Reading Right Now)");
                console.log("\n");
                actionHandler("Projects");
            }

        })


}

function actionHandler(previousPage) {
    if (!previousPage) {
        inquirer.prompt({
                type: "list",
                name: "exitBack",
                message: yellow("Go back or Exit?"),
                choices: ["Back to Main Menu", "Exit"]
            })
            .then(choice => {
                if (choice.exitBack == "Back to Main Menu") {
                    resumeHandler();
                    return;
                } else {
                	clear();
                    return;
                }
            });
    } else {
        var upPage = "Back to ".concat(previousPage);
        inquirer.prompt({
                type: "list",
                name: "exitBack",
                message: chalk.yellow("Previous Page, Main Menu or Exit?"),
                choices: [upPage, "Back to Main Menu", "Exit"]
            })
            .then(choice => {
                if (choice.exitBack == "Back to Main Menu") {
                    resumeHandler();
                    return;
                }

                if (choice.exitBack == "Exit") {
                	clear();
                    return;
                }

                if (choice.exitBack == upPage) {
                    switch (previousPage) {
                        case "Contact Information":
                            contactHandler();
                            return;

                        case "Education":
                            educationHandler();
                            return;

                        case "Skills":
                            skillHandler();
                            return;

                        case "Past Experiences":
                            experienceHandler();
                            return;

                        case "Projects":
                            projectHandler();
                            return;
                    }
                }
            });
    }
}

main();