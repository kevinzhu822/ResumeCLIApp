#!/usr/bin/env node

"use strict";

var inquirer = require("inquirer");
var chalk = require("chalk");
var clear = require('clear');
var request = require("request");


const header = chalk.bold.underline;
const yellow = chalk.yellow.bold;
const green = chalk.green;
const blue = chalk.blue.bold;
const cyan = chalk.cyan;
const regular = chalk.white;
const red = chalk.red.underline;


var resume = require("./resume.json");

var vistorInfo = {"Name": "N/A", "Email": "N/A"};


var mainMenu = {
    type: "list",
    name: "resumeOptions",
    message: yellow("What do you want to know about me?"),
    choices: [...Object.keys(resume), new inquirer.Separator(""), "Send Kevin a Message", "Exit"],
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

var messageToKevin = {
	type: 'input',
	name: 'message',
	message: blue('Enter your message to Kevin here:')
};

var introductionQuestions = [
	{
    type: 'input',
    name: "name",
    message: yellow("Enter your name here:"),
    validate: (res) => {
      if(!res.length || res=="abc" || res=="asd" || res=="xyz" || res=="aaa")
        return('Invalid name');
      else return true;
    }
  // },
  // {
  //   type: 'input',
  //   name: "email",
  //   message: yellow("What's your email? (for tracking purposes)"),
  //   validate: (res) => {
  //     const reg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  //     if(reg.test(res))
  //       return true;
  //     else return('Please enter valid email.');
  //   }
  }
];

var widthOfTerminal = process.stdout.columns;

function drawTopDivider() {
	console.log("┏" + "━".repeat(widthOfTerminal-2) + "┓");
}

function drawMidDivider() {
	console.log("┃" + "━".repeat(widthOfTerminal-2) + "┃");
}

function drawBotDivider() {
	console.log("┗" + "━".repeat(widthOfTerminal-2) + "┛");
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
    var subPoint;
    if (text.indexOf('*') != -1) {
        subPoint = text.slice(-1 * (text.length - text.indexOf('*') -1));
        text = text.slice(0, text.indexOf('*'));
    }
	console.log(" ".repeat(sideSpace-1) + "- "+style(text) + " ".repeat(sideSpace-1));
    subPoint && console.log(" ".repeat(sideSpace-1) + "  "+style(subPoint) + " ".repeat(sideSpace-1));

}

function centerTextMultiple(text1, text2, style1) {
	var leftoverSpaces = widthOfTerminal - text1.length - text2.length;
	if (leftoverSpaces % 2 != 0) {
		leftoverSpaces = leftoverSpaces - 1;
	}

	var sideSpace = leftoverSpaces / 2;
	console.log(" ".repeat(sideSpace) + style1(text1) + text2 + " ".repeat(sideSpace));
}


function checkTerminalSize() {
    widthOfTerminal = process.stdout.columns;
	return widthOfTerminal - 120 > 10;
}

function handleTerminalSize() {
    if (!checkTerminalSize()) {
        console.log("\n");

        console.log(red("Your terminal window is too small!"));
        console.log("\n");
        console.log(red("****Please adjust your terminal window width so that it is wide enough to display this sentence on a single line and try again.****"));
        return true;
    }
}

async function main() {
	if (handleTerminalSize()) {
        return;
    }
	clear();
	await introduction(inquirer);
    resumeHandler(true);
  
}

async function introduction(inquirer) {
		console.clear();
		console.log(blue("Hey, thanks for visiting my resume!"));
		console.log("Before we begin, can you please tell me your name?");
		await inquirer.prompt(introductionQuestions).then(intro => {
		    console.clear();
		    console.log("\n");
		    console.log(" ", `Hey ${intro.name}!`);
		    vistorInfo["Name"] = intro.name;
		    vistorInfo["Email"] = "Emails are not being tracked";
		    recordVisitor(vistorInfo["Name"], vistorInfo["Email"]);
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
    if (handleTerminalSize()) {
        return;
    }
	console.log('\n');
    console.log(" ", regular("Kevin Zhu's Resume (Updated as of 4/04/2023)"));
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

        if (answer.resumeOptions == "Send Kevin a Message") {
        	messageHandler();
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
    if (handleTerminalSize()) {
        return;
    }
    console.log("\n");
    centerText("Contact Information", regular.bold);
	drawTopDivider();
    var counter = 0;
    resume[`${"Contact Information"}`].forEach(info => {
    	var colonIndex = info.indexOf(":");
        var beforeColon = info.slice(0, colonIndex);
        var afterColon = info.slice(colonIndex + 1);
        centerText(beforeColon, yellow);
        centerText(afterColon, blue)
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
    if (handleTerminalSize()) {
        return;
    }
    console.log("\n");
    centerText("Education", regular.bold);
    drawTopDivider();
    var counter = 0;
    resume[`${"Education"}`].forEach(info => {
        var colonIndex = info.indexOf(":");
        var beforeColon = info.slice(0, colonIndex);
        var afterColon = info.slice(colonIndex + 1);
        centerText(beforeColon, yellow);
        centerText(afterColon, blue)
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
    if (handleTerminalSize()) {
        return;
    }
    console.log("\n");
    centerText("Skills", regular.bold);
    drawTopDivider();
    var counter = 0;
    resume[`${"Skills"}`].forEach(info => {
        var colonIndex = info.indexOf(":");
        var beforeColon = info.slice(0, colonIndex);
        var afterColon = info.slice(colonIndex + 1);
        centerText(beforeColon, yellow);
        centerText(afterColon, blue)
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
    if (handleTerminalSize()) {
        return;
    }
    specificExperienceHandler();
    return;
}

function specificExperienceHandler() {
    if (handleTerminalSize()) {
        return;
    }
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

            if (choice.experienceOptions.includes("X-Matik")) {
                experienceDataPrinter(choice.experienceOptions);
                console.log("\n");
                actionHandler("Past Experiences");
            }

            if (choice.experienceOptions.includes("Codebase")) {
                experienceDataPrinter(choice.experienceOptions);
                console.log("\n");
                actionHandler("Past Experiences");
            }

            if (choice.experienceOptions.includes("Bill.com")) {
                experienceDataPrinter(choice.experienceOptions);
                console.log("\n");
                actionHandler("Past Experiences");
            }

            if (choice.experienceOptions == "Amazon Web Services (Full-Time)") {
                experienceDataPrinter(choice.experienceOptions);
                console.log("\n");
                actionHandler("Past Experiences");
            }

            if (choice.experienceOptions == "Amazon Web Services (Internship)") {
                experienceDataPrinter(choice.experienceOptions);
                console.log("\n");
                actionHandler("Past Experiences");
            }

        })
}



function experienceDataPrinter(companyName) {
    if (handleTerminalSize()) {
        return;
    }

    clear();
    console.log("\n");
    centerText(companyName, regular.bold);
    drawTopDivider();


    var title = resume["Past Experiences"][companyName][0];
    var date = resume["Past Experiences"][companyName][1];
    var responsibilities = resume["Past Experiences"][companyName][2];
    centerText(title, blue);
    centerText(date, yellow);
    console.log("\n");

    var longest = 0;
    responsibilities.forEach(function(item) {
        let currLength = item.indexOf('*') == -1 ? item.length : item.indexOf('*');
        longest = Math.max(longest, currLength);
    })
    for (let i = 0; i < responsibilities.length; i++) {

        if (responsibilities[i].indexOf("Worked with") != -1) {
            alignText(responsibilities[i], green, longest);
        } else {
            alignText(responsibilities[i], regular, longest);
        }
    }
    
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
    centerText(techStack, blue);
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
    if (handleTerminalSize()) {
        return;
    }
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
                message: yellow("Previous Page, Main Menu or Exit?"),
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

function sendMessage(message) {
    var options = { method: 'POST',
        url: 'https://resumedata-ff5c.restdb.io/rest/visitormessages',
        headers: 
            { 'cache-control': 'no-cache',
             'x-apikey': '030e3abaeef7a980d7e8fcf25f331a2096ac5',
            'content-type': 'application/json' },
        body: { Name: vistorInfo["Name"], Email: vistorInfo["Email"], Message: message},
        json: true };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
});

}

async function messageHandler() {
    clear();
    console.log("\n");
    await inquirer.prompt(messageToKevin).then(msg => {
		    console.log("\n");
            console.log(regular("Message received!"));
		    console.log(blue("Thanks for the message"));
		    sendMessage(msg.message)
	  	})
    console.log("\n");
    actionHandler();
    return;
}

main();