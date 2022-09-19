import { VariableInfo } from 'azure-pipelines-task-lib';
import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import * as assert from 'assert';

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('filepath', 'test/path/to/dest');
tmr.setInput('environments', 'env1\nenv2\nenv3');
tmr.setInput('preserveUnspecified', 'true');

const tl = require('azure-pipelines-task-lib/mock-task');
const tlClone = Object.assign({}, tl);
tlClone.getVariables = function() {
	return [
		{ name: "env1.test1", value: "test1" } as VariableInfo,
		{ name: "env1.test2", value: "test2" } as VariableInfo,
		{ name: "env1.test3", value: "test3" } as VariableInfo,
		
		{ name: "env2.single", value: "true" } as VariableInfo,
		
		{ name: "env3.connection", value: "Host=4214;port=1241;somethingelse = true;" } as VariableInfo,
		{ name: "env3.password", value: "test123", secret: true } as VariableInfo,
		
		{ name: "all1", value: "all1" } as VariableInfo,
		{ name: "all2", value: "all2" } as VariableInfo,
	]
};
tlClone.writeFile = function(name: string, data: string) {
	if (name === 'test/path/to/dest/env1.env') {
		assert.equal(data, [
			'test1=test1',
			'test2=test2',
			'test3=test3',
			'all1=all1',
			'all2=all2',
		].join('\n'));
	} else if (name === 'test/path/to/dest/env2.env') {
		assert.equal(data, [
			'single=true',
			'all1=all1',
			'all2=all2',
		].join('\n'));
	} else if (name === 'test/path/to/dest/env3.env') {
		assert.equal(data, [
			'connection=Host=4214;port=1241;somethingelse = true;',
			'password=test123',
			'all1=all1',
			'all2=all2',
		].join('\n'));
	} else {
		assert.fail('wrong file', name);
	}
};
tmr.registerMock('azure-pipelines-task-lib/mock-task', tlClone);

tmr.run();