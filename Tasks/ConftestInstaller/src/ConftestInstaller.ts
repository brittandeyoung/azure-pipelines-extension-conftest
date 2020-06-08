import tasks = require('azure-pipelines-task-lib/task');
import tools = require('azure-pipelines-tool-lib/tool');
import path = require('path');
import os = require('os');
import fs = require('fs');

const uuidV4 = require('uuid/v4');
const conftestToolName = "conftest";
const isWindows = os.type().match(/^Win/);

export async function downloadConftest(inputVersion: string): Promise<string> {
    let version = tools.cleanVersion(inputVersion);
    if (!version) {
        throw new Error(tasks.loc("InputVersionNotValidSemanticVersion", inputVersion));
    }

    let cachedToolPath = tools.findLocalTool(conftestToolName, version);
    if (!cachedToolPath) {
        let conftestDownloadUrl = getConftestDownloadUrl(version);
        let fileName = `${conftestToolName}-${version}-${uuidV4()}.zip`;
        let conftestDownloadPath;

        try {
            conftestDownloadPath = await tools.downloadTool(conftestDownloadUrl, fileName);
        } catch (exception) {
            throw new Error(tasks.loc("ConftestDownloadFailed", conftestDownloadUrl, exception));
        }

        let conftestUnzippedPath = await tools.extractZip(conftestDownloadPath);
        cachedToolPath = await tools.cacheDir(conftestUnzippedPath, conftestToolName, version);
    }

    let conftestPath = findConftestExecutable(cachedToolPath);
    if (!conftestPath) {
        throw new Error(tasks.loc("ConftestNotFoundInFolder", cachedToolPath));
    }

    if (!isWindows) {
        fs.chmodSync(conftestPath, "777");
    }

    tasks.setVariable('conftestLocation', conftestPath);

    return conftestPath;
}

function getConftestDownloadUrl(version: string): string {
    let platform: string;
    let architecture: string;
    let archive :string

    switch(os.type()) {
        case "Darwin":
            platform = "Darwin";
            archive = ".tar.gz";
            break;
        
        case "Linux":
            platform = "Linux";
            archive = ".tar.gz";
            break;
        
        case "Windows_NT":
            platform = "Windows";
            archive = ".zip";
            break;
        
        default:
            throw new Error(tasks.loc("OperatingSystemNotSupported", os.type()));
    }

    switch(os.arch()) {
        case "x64":
            architecture = "amd64";
            break;
        
        case "x32":
            architecture = "386";
            break;
        
        default:
            throw new Error(tasks.loc("ArchitectureNotSupported", os.arch()));
    }

    return `https://github.com/instrumenta/conftest/releases/download/v${version}/conftest_${version}_${platform}_x86_64${archive}`;
}

function findConftestExecutable(rootFolder: string): string {
    let conftestPath = path.join(rootFolder, conftestToolName + getExecutableExtension());
    var allPaths = tasks.find(rootFolder);
    var matchingResultFiles = tasks.match(allPaths, conftestPath, rootFolder);
    return matchingResultFiles[0];
}

function getExecutableExtension(): string {
    if (isWindows) {
        return ".exe";
    }

    return "";
}