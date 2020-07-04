import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'src', 'Index.js');
console.log(taskPath)
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);
tmr.setInput('version', '0.18.2');

tmr.run();