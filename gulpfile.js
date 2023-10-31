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
		proxy: "https://bugatti-russia.ru",
		https: true,
		serveStatic: ['.'],
		rewriteRules: [
			{
				match: new RegExp('/css/default.css'),
				fn: 'default.css'
			},
			{
				match: new RegExp('/css/style.css'),
				fn: 'style.css'
			},
			{
				match: new RegExp('app.min.*?js'),
				fn: 'app.js'
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