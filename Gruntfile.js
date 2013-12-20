/* global module */
/* global require */
module.exports = function (grunt) {
	/* jshint strict: false */

	// todo: use grunt to change html to client/subject/data

	var fs = require('fs')
		,glob = require('glob')

		,aFiles = [
			'src/js/sfbrowser.js'
		]
//		,sMain = fs.readFileSync(aFiles[0]).toString()
//		,oBanner = readBanner(sMain)
	;

//	// update package.json with jsdoc data
//	var oMap = {namespace:'name',name:'title',title:'description'};
//	for (var bannerKey in oBanner) {
//		var sPackageKey = oMap[bannerKey]||bannerKey
//			,oValP = oPackage[sPackageKey]
//			,oValB = oBanner[bannerKey];
//		if (oValP!==undefined&&oValP!==oValB) {
//			grunt.log.writeln('Updated package '+sPackageKey+' from',oValP,'to',oValB,' (',sPackage,')');
//			oPackage[sPackageKey] = oValB;
//		}
//		fs.writeFileSync(sPackage,JSON.stringify(oPackage,null,'\t'));
//	}
//
//	// update jsdoc.conf.json with jsdoc data
//	oJsDoc.templates.systemName = oBanner.name;
//	oJsDoc.templates.copyright = oBanner.copyright;
//	oJsDoc.templates.theme = 'sjeiti';
//	// ok: Flatly Spacelab Cerulean United
//	// not ok: Amelia Cosmo Cyborg Journal Readable Simplex Slate Superhero Spruce
//	fs.writeFileSync(sJsDoc,JSON.stringify(oJsDoc,null,'\t'));
//
//
//	/**
//	 * Convert initial jsdoc comments to object
//	 * @param source source file
//	 * @returns {{title: *}} jsdoc as object
//	 */
//	function readBanner(source){
//		var sBanner = source.match(/\/\*\*([\s\S]*?)\*\//g)[0]
//			,aLines = sBanner.split(/[\n\r]/g)
//			,aMatchName = sBanner.match(/(\s?\*\s?([^@]+))/g)
//			,sName = aMatchName.shift().replace(/[\/\*\s\r\n]+/g,' ').trim()
//			,oBanner = {title:sName};
//		for (var i = 0, l = aLines.length; i<l; i++) {
//			var sLine = aLines[i]
//				,aMatchKey = sLine.match(/(\s?\*\s?@([^\s]*))/);
//			if (aMatchKey) {
//				var sKey = aMatchKey[2];
//				oBanner[sKey] = sLine.split(sKey).pop().trim();
//			}
//		}
//		return oBanner;
//	}


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: { jshintrc: '.jshintrc' },
			files: aFiles
		},

		copy: {
			dist: {
				files: [
					{
						expand: true
						,cwd: 'src/fonts/'
						,src: ['**']
						,dest: 'dist/fonts/'
						,filter: 'isFile'
					},
					{
						expand: true
						,cwd: 'src/js/'
						,src: ['**']
						,dest: 'dist/js/'
						,filter: 'isFile'
					}
				]
			}
			,devjs: {
				files: [
					{
						expand: true
						,cwd: 'src/js/'
						,src: ['sfbrowser.js']
						,dest: 'dist/js/'
						,filter: 'isFile'
					}
				]
			}
		},

		wrapconcat: {
			options: {
				prefix: '<script type="text/ng-template" id="%filename%">'
				,suffix: '</script>'
			},
			dist: {
				src: ['src/tpl/*.html','src/tpl/*'],
				dest: 'dist/sfbrowser.html'
			}
		},

		uglify: {
			dist: {
				src: aFiles,
				dest: 'dist/js/sfbrowser.min.js'
			}
		}
	});

	grunt.registerMultiTask('wrapconcat', '', function() {
		var oOptions = this.options({});
		var aFiles = []
			,sContents = '';
		this.data.src.forEach(function(src){
			glob.sync(src).forEach(function(file){
				if (aFiles.indexOf(file)===-1) aFiles.push(file);
			});
		});
		aFiles.forEach(function(file){
			var sFileName = file.split('/').pop()
			sContents += oOptions.prefix.replace('%filename%',sFileName)+fs.readFileSync(file).toString().replace(/[\r\n\t]/g,' ').replace(/\s+/g,' ').replace(/>\s</g,'><')+oOptions.suffix;
		});
		fs.writeFileSync(this.data.dest,sContents);
		grunt.log.writeln(aFiles.length+' files wrapped and concatenated.');
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default',['jshint','uglify']);
	grunt.registerTask('dist',['copy:dist','wrapconcat:dist','uglify:dist']);

};
