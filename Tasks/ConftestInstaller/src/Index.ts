import tasks = require('azure-pipelines-task-lib/task');
import tools = require('azure-pipelines-tool-lib/tool');
import { ToolRunner } from 'azure-pipelines-task-lib/toolrunner';
import path = require('path');
import * as installer from './ConftestInstaller';

async function configureConftest() {
    let inputVersion = tasks.getInput("version", true);
    let conftestPath = await installer.downloadConftest(inputVersion!);
    let envPath = process.env['PATH'];

    // Prepend the tools path. Instructs the agent to prepend for future tasks
    if (envPath && !envPath.startsWith(path.dirname(conftestPath))) {
        tools.prependPath(path.dirname(conftestPath));
    }
}

async function verifyConftest() {
    console.log(tasks.loc("VerifyConftestInstallation"));
    let conftestPath = tasks.which("conftest", true);
    let conftestTool : ToolRunner = tasks.tool(conftestPath);
    conftestTool.arg("--version");
    return conftestTool.exec();
}

async function run() {
    tasks.setResourcePath(path.join(__dirname, '..', 'task.json'));

    try {
        await configureConftest();
        await verifyConftest();
        tasks.setResult(tasks.TaskResult.Succeeded, "");
    } catch (error) {
        tasks.setResult(tasks.TaskResult.Failed, error);
    }
}

run();
