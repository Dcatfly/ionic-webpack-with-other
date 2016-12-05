var path = require('path')
var config = require('../config')

exports.assetsPath = function (_path, _subpath) {
	_subpath = _subpath ? _subpath : ''
	var assetsSubDirectory = process.env.NODE_ENV === 'production'
		? config.build.assetsSubDirectory
		: config.dev.assetsSubDirectory
	return path.posix.join(assetsSubDirectory, _subpath + _path)
}
