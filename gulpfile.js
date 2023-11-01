'use strict';

const gulp             = require('gulp');
const server           = require('browser-sync').create();

gulp.task('serve', () => {

	server.init({
		server: '.',
		files: [
			{
				match: '*.*',
				fn: server.reload()
			}
		]
	});

});

gulp.task('default', () => {

	server.init({
		proxy: "https://xn--80abgv3cad.xn--80adxhks",
		https: true,
		serveStatic: ['.'],
		rewriteRules: [
			{
				match: new RegExp('https://xn--80abgv3cad.xn--80adxhks/css/default.css'),
				fn: 'default.css'
			},
			{
				match: new RegExp('https://xn--80abgv3cad.xn--80adxhks/css/style.css'),
				fn: 'style.css'
			},
			{
				match: new RegExp('js/js.js'),
				fn: 'js.js'
			}
		],
		files: [
			{
				match: ['*'],
				fn: server.reload()
			}
		]
	});

});