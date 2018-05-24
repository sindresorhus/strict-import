'use strict';
const path = require('path');
const Module = require('module');

const getParentModuleDirectories = cwd => {
	const ret = new Set();

	let dir = cwd;
	while (path.parse(dir).root !== dir) {
		dir = path.dirname(dir);
		ret.add(path.join(dir, 'node_modules'));
	}

	return ret;
};

module.exports = (mod, options) => {
	const cwd = path.dirname(mod.filename);

	options = Object.assign({
		_allowedModules: []
	}, options);

	// We specifically block the parent node module directories instead of just blocking
	// everything except for the cwd, so we can support `npm link` modules
	const blockedDirectories = getParentModuleDirectories(cwd);

	const {_nodeModulePaths} = Module;
	Module._nodeModulePaths = from => {
		const paths = _nodeModulePaths(from);

		if (options._allowedModules.some(x => from.endsWith(`/node_modules/${x}`))) {
			return paths;
		}

		return paths.filter(modulePath => {
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
