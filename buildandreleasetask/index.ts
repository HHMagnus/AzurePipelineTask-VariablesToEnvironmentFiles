import tl = require('azure-pipelines-task-lib/task');
import { dirname } from 'path';

async function run() {
    try {
		const filepath: string = tl.getPathInputRequired('filepath');
		const environments = tl.getDelimitedInput('environments', '\n', true);
		const preserveUnspecified = tl.getBoolInput('preserveUnspecified') || false;

		const envs = environments.reduce((prev, x) => {prev[x] = []; return prev; }, {} as {[key: string]: Array<string>});

		const variables = tl.getVariables();

		for (let variable of variables) {
			const match = environments.find(x => variable.name.startsWith(`${x}.`));
			if (match) {
				console.log(`Adding ${variable.name} to ${match} environment file`);
				envs[match].push(`${variable.name.substring(match.length+1)}=${variable.value}`);
				continue;
			}

			if (preserveUnspecified) {
				console.log(`Adding ${variable.name} to all environment files`);
				for (let env of environments) {
					envs[env].push(`${variable.name}=${variable.value}`);
				}
			}
		}

		const dir = dirname(`${filepath}/unknownfile`);
		tl.mkdirP(dir);
		for (let env of environments) {
			console.log(`Creating file ${env}.env`);
			tl.writeFile(`${filepath}/${env}.env`, envs[env].join('\n'));
		}
		
		console.log(`Successfully finished!`);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();