import tasks = require('azure-pipelines-task-lib/task');
import tools = require('azure-pipelines-tool-lib/tool');
import { ToolRunner } from 'azure-pipelines-task-lib/toolrunner';
import path = require('path');
// import * as installer from './Conftest';

async function runConftest() {
    let inputCommand = tasks.getInput("conftestCommand", true);
    let inputArgs = tasks.getInput("conftestArgs", false);    
    let envPath = process.env['PATH'];
    let conftestPath = tasks.which("conftest", true);
    let conftestTool : ToolRunner = tasks.tool(conftestPath);

    conftestTool.arg([inputCommand!, inputArgs!]);
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