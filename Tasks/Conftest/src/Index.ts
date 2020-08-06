import tasks = require('azure-pipelines-task-lib/task');
import tools = require('azure-pipelines-tool-lib/tool');
import { ToolRunner } from 'azure-pipelines-task-lib/toolrunner';
import path = require('path');
// import * as installer from './Conftest';

async function runConftest() {
    let inputCommand = tasks.getInput("command", true);
    let inputArgs = tasks.getInput("arguments", false);
    let inputFile = tasks.getInput("file", false); 
    let inputFilePath = tasks.getInput("filepath", false); 
    let inputRepo = tasks.getInput("repository", false); 
    let envPath = process.env['PATH'];
    let conftestPath = tasks.which("conftest", true);
    let conftestTool : ToolRunner = tasks.tool(conftestPath);

    switch(inputCommand) {
      case "test":
        conftestTool.argIf(inputCommand != undefined, inputCommand);
        conftestTool.argIf(inputFile != undefined, inputFile);
        conftestTool.argIf(inputArgs != undefined, inputArgs);
        break; 
      case "parse":
        conftestTool.argIf(inputCommand != undefined, inputCommand);
        conftestTool.argIf(inputFile != undefined, inputFile);
        conftestTool.argIf(inputArgs != undefined, inputArgs);
        break; 
      case "verify":
        conftestTool.argIf(inputCommand != undefined, inputCommand);
        conftestTool.argIf(inputArgs != undefined, inputArgs);
        break; 
      case "pull":
        conftestTool.argIf(inputCommand != undefined, inputCommand);
        conftestTool.argIf(inputRepo != undefined, inputRepo);
        conftestTool.argIf(inputFilePath != undefined, inputFilePath);
        conftestTool.argIf(inputArgs != undefined, inputArgs);
        break; 
      case "push":
        conftestTool.argIf(inputCommand != undefined, inputCommand);
        conftestTool.argIf(inputRepo != undefined, inputRepo);
        conftestTool.argIf(inputFilePath != undefined, inputFilePath);
        conftestTool.argIf(inputArgs != undefined, inputArgs);
        break; 
    }
    // if (inputCommand == "test" || inputCommand == "parse") {
    //     conftestTool.argIf(inputCommand != undefined, inputCommand)
    //     conftestTool.argIf(inputFile != undefined, inputFile)
    //     conftestTool.argIf(inputArgs != undefined, inputArgs)
    // }
    
    // if (inputCommand == "verify") {
    //   conftestTool.argIf(inputCommand != undefined, inputCommand)
    //   conftestTool.argIf(inputArgs != undefined, inputArgs)
    // }

    // if (inputCommand == "pull" || inputCommand == "push") {
    //     conftestTool.argIf(inputCommand != undefined, inputCommand)
    //     conftestTool.argIf(inputRepo != undefined, inputRepo)
    //     conftestTool.argIf(inputFilePath != undefined, inputFilePath)
    //     conftestTool.argIf(inputArgs != undefined, inputArgs)
    // }

    return conftestTool.exec();
}

async function run() {
    tasks.setResourcePath(path.join(__dirname, '..', 'task.json'));

    try {
        await runConftest();
        tasks.setResult(tasks.TaskResult.Succeeded, "");
    } catch (error) {
        tasks.setResult(tasks.TaskResult.Failed, error);
    }
}

run();