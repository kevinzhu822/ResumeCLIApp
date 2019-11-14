#!/usr/bin/env node

"use strict";

var inquirer = require("inquirer");
var chalk = require("chalk");
var clear = require('clear');

var header = chalk.bold.underline;
var yellow = chalk.yellow.bold;
var blue = chalk.blue.bold;

var resume = require("./resume.json");

var mainMenu = {
    type: "list",
    name: "resumeOptions",
    message: yellow("What do you want to know about me?"),
    choices: [new inquirer.Separator(), ...Object.keys(resume), new inquirer.Separator(""), "Exit"]
};

var skillsMenu = {
    type: "list",
    name: "skillOptions",
    message: yellow("Which of my skill categories do you want to learn about?"),
    choices: [new inquirer.Separator(), ...Object.keys(resume.Skills), new inquirer.Separator(), "Back to Main Menu", "Exit"]
};

var experienceMenu = {
    type: "list",
    name: "experienceOptions",
    message: yellow("Which of my experiences do you want to learn more about?"),
    choices: [new inquirer.Separator(), ...Object.keys(resume["Past Experience"]), new inquirer.Separator(), "Back to Main Menu", "Exit"]
};

var projectsMenu = {
    type: "list",
    name: "projectOptions",
    message: yellow("Which of my projects do you want to learn more about?"),
    choices: [new inquirer.Separator(), ...Object.keys(resume["Projects"]), new inquirer.Separator(), "Back to Main Menu", "Exit"]
};

function main() {
    resumeHandler();
}

function resumeHandler() {
    clear();
    console.log("\n");
    console.log(" ", blue.underline("Kevin Zhu's Resume"));
    inquirer.prompt(mainMenu).then(answer => {
        if (answer.resumeOptions == "Exit") {
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

        if (answer.resumeOptions == "Past Experience") {
            experienceHandler();
            return;
        }

        if (answer.resumeOptions == "Projects") {
            projectHandler();
            return;
        }
    });
}

function contactHandler() {
    clear();
    console.log("\n");
    console.log(" ", header("Contact Information"));
    resume[`${"Contact Information"}`].forEach(info => {
        dataStylerAndPrint(info);
    });
    console.log("\n");
    actionHandler();
    return;
}

function educationHandler() {
    clear();
    console.log("\n");
    console.log(" ", header("Education"));
    resume[`${"Education"}`].forEach(info => {
        dataStylerAndPrint(info);
    });
    console.log("\n");
    actionHandler();
    return;
}

function skillHandler() {
    clear();
    specificSkillHandler();
    return;
}

function specificSkillHandler() {
    console.log("\n");
    console.log(" ", header("Skills"));
    inquirer.prompt(skillsMenu)
        .then(choice => {
            if (choice.skillOptions == "Back to Main Menu") {
                resumeHandler();
                return;
            }

            if (choice.skillOptions == "Exit") {
                return;
            }

            if (choice.skillOptions == "Backend") {
                clear();
                console.log("\n");
                console.log(" ", header("Backend"));
                resume[`${"Skills"}`][`${"Backend"}`].forEach(info => {
                    dataStylerAndPrint(info)
                });
                console.log("\n");
                actionHandler("Skills");
            }

            if (choice.skillOptions == "Data Science") {
                clear();
                console.log("\n");
                console.log(" ", header("Data Science"));
                resume[`${"Skills"}`][`${"Data Science"}`].forEach(info => {
                    dataStylerAndPrint(info)
                });
                console.log("\n");
                actionHandler("Skills");
            }

            if (choice.skillOptions == "Frontend") {
                clear();
                console.log("\n");
                console.log(" ", header("Frontend"));
                resume[`${"Skills"}`][`${"Frontend"}`].forEach(info => {
                    dataStylerAndPrint(info)
                });
                console.log("\n");
                actionHandler("Skills");
            }

            if (choice.skillOptions == "Graphic Design") {
                clear();
                console.log("\n");
                console.log(" ", header("Graphic Design"));
                resume[`${"Skills"}`][`${"Graphic Design"}`].forEach(info => {
                    dataStylerAndPrint(info)
                });
                console.log("\n");
                actionHandler("Skills");
            }

            if (choice.skillOptions == "PCB Design") {
                clear();
                console.log("\n");
                console.log(" ", header("PCB Design"));
                resume[`${"Skills"}`][`${"PCB Design"}`].forEach(info => {
                    dataStylerAndPrint(info)
                });
                console.log("\n");
                actionHandler("Skills");
            }


        });
    return;
}

function experienceHandler() {
    clear();
    specificExperienceHandler();
    return;
}

function specificExperienceHandler() {
    console.log("\n");
    console.log(" ", header("Past Experience"));
    inquirer.prompt(experienceMenu)
        .then(choice => {
            if (choice.experienceOptions == "Back to Main Menu") {
                resumeHandler();
                return;
            }

            if (choice.experienceOptions == "Exit") {
                return;
            }

            if (choice.experienceOptions == "X-Matik Inc.") {
                experienceDataPrinter("X-Matik Inc.");
                console.log("\n");
                actionHandler("Past Experience");

            }

            if (choice.experienceOptions == "CodeBase") {
                experienceDataPrinter("CodeBase");
                console.log("\n");
                actionHandler("Past Experience");
            }

            if (choice.experienceOptions == "Uber Freight") {
                experienceDataPrinter("Uber Freight");
                console.log("\n");
                actionHandler("Past Experience");
            }

        })
}



function experienceDataPrinter(companyName) {
    clear();
    console.log("\n");
    console.log(" ", header(companyName));
    var date = resume["Past Experience"][companyName][0];
    var title = resume["Past Experience"][companyName][1];
    var responsibilities = resume["Past Experience"][companyName][2]["Responsibilities"];

    dataStylerAndPrint(date);
    dataStylerAndPrint(title);
    responsibilities.forEach(function(item) {
        console.log(" ", " ", "-", item);
    });
    return;
}

function projectDataPrinter(projectName) {
    clear();
    console.log("\n");
    console.log(" ", header(projectName));

    var techStack = resume["Projects"][projectName][0];
    var details = resume["Projects"][projectName][1]["Details"];

    dataStylerAndPrint(techStack);
    details.forEach(function(item) {
        console.log(" ", " ", "-", item);
    })
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

                        case "Past Experience":
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

main();