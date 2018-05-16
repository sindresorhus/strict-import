'use strict';
const path = require('path');
const Module = require('module');

const getParentModuleDirectories = cwd => {
	const ret = new Set();

	let dir = cwd;
	while (true) { // eslint-disable-line no-constant-condition
		dir = path.dirname(dir);
		ret.add(path.join(dir, 'node_modules'));

		if (path.parse(dir).root === dir) {
			break;
		}
	}

	return ret;
};

module.exports = mod => {
	const cwd = path.dirname(mod.filename);

	// We specifically block the parent node module directories instead of just blocking
	// everything except for the cwd, so we can support `npm link` modules
	const blockedDirectories = getParentModuleDirectories(cwd);

	const {_nodeModulePaths} = Module;
	Module._nodeModulePaths = from => {
		return _nodeModulePaths(from).filter(modulePath => {
			for (const blockedDirectory of blockedDirectories) {
				if (modulePath.startsWith(blockedDirectory)) {
					return false;
				}
			}

			return true;
		});
	};

	mod.paths = Module._nodeModulePaths(cwd);
};
