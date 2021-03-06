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

		clean: {
			dist: {
				src: ['dist/**']
			}
		},

		copy: {
			dist: {
				files: [
					{ // index.html and test data/
						expand: true
						,cwd: 'dist_files/'
						,src: ['**']
						,dest: 'dist/'
						,filter: 'isFile'
					},
					{ // fonts
						expand: true
						,cwd: 'src/fonts/'
						,src: ['**']
						,dest: 'dist/fonts/'
						,filter: 'isFile'
					},
					{ // vendor js files
						expand: true
						,cwd: 'src/js/vendor/'
						,src: ['**']
						,dest: 'dist/js/vendor/'
						,filter: 'isFile'
					}
				]
			}
			,connector: {
				files: [
					{
						expand: true
						,dot: true
						,cwd: 'src/connector/'
						,src: ['**']
						,dest: 'dist/connector/'
						,filter: 'isFile'
					}
				]
			}
			,css: {
				files: [
					{
						expand: true
						,cwd: 'src/less/'
						,src: ['**']
						,dest: 'dist/css/'
						,filter: function(src){
							return ['less','css','bootstrap'].indexOf(src.split('.').pop())===-1;
						}
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
			,temp: {
				files: [
					{
						expand: true
						,cwd: 'temp/'
						,src: 'sfbrowser.js'
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
//			dist: {
//				src: ['src/tpl/*.html','src/tpl/*'],
//				dest: 'dist/sfbrowser.html'
//			},
			dist: {
				src: ['src/tpl/*.html','src/tpl/*'],
				dest: 'temp/templates.html'
			}
		},

		uglify: {
			dist: {
				//src: aFiles,
				src: 'dist/js/sfbrowser.js',
				dest: 'dist/js/sfbrowser.min.js'
			}
		},

		includejs: {
			temp: {
				cwd: 'src/js/',
				src: ['sfbrowser.js'],
				dest: 'temp/'
			}
		}

		,less: {
			options: {
				compress: true
			}
			,dist: {
				src: ['src/less/sfbrowser.less'],
				dest: 'dist/css/sfbrowser.css'
			}
			,dev: {
				src: ['src/less/sfbrowser.less'],
				dest: 'src/less/sfbrowser.css'
			}
		}

		,'ftp-deploy': {
			build: {
				auth: {
					host: 'ftp.dds.nl',
					port: 21,
					authKey: 'dds'
				},
				src: 'dist',
				dest: '/public_html/sub/sfbrowser/test',
				exclusions: []
			}
			,js: {
				auth: {
					host: 'ftp.dds.nl',
					port: 21,
					authKey: 'dds'
				},
				src: 'dist/js',
				dest: '/public_html/sub/sfbrowser/test/js',
				exclusions: []
			}
		}

		,rsync: {
			options: {
				args: ["--verbose"],
				exclude: [".git*","*.scss","node_modules"],
				recursive: true
			},
			ddd: {
				options: {
					src: '/dist',
					dest: '/public_html/sub/sfbrowser/test',
						host: 'sjeiti@shell.dds.nl',
					port: 22,
					ssh: true,
					dryRun: true,
					syncDestIgnoreExcl: true
				}
			},
			dist: {
				options: {
					src: 'dist',
					dest: '/public_html/sub/sfbrowser/test',
					host: 'sjeiti@ftp.dds.nl',
					dryRun: true,
					syncDestIgnoreExcl: true
				}
			}/*,
			ddist: {
				options: {
					src: "./",
					dest: "../dist"
				}
			},
			stage: {
				options: {
					src: "../dist/",
					dest: "/var/www/site",
					host: "user@staging-host",
					syncDestIgnoreExcl: true
				}
			},
			prod: {
				options: {
					src: "../dist/",
					dest: "/var/www/site",
					host: "user@live-host",
					syncDestIgnoreExcl: true
				}
			}*/
		}

	});

	// todo: grunt-include-all
	/* include -e asdf/qwer.js */
	/*
	-e escape quotes
	-u encodeURIComponent
	-b base64 encoding

	config
	cwd .
	regex /\/\*\s?include(\s\-\w)?\s+.*\s?\*\//

	data:image/jpeg;base64,
	data:image/png;base64,
	data:image/gif;base64,
	*/
	grunt.registerMultiTask('includejs', '', function() {
		//var oOptions = this.options({});
		var sCwd = this.data.cwd||''
			,sDest = this.data.dest
			,iNumFiles = 0;
		this.data.src.forEach(function(src){
			console.log('including ',sCwd+src); // log
			fs.writeFileSync(sDest+src,includeInto(sCwd+src));
		});
		function includeInto(file){
			iNumFiles++;
			var sFileContents = fs.readFileSync(file).toString()
				,aMatch = sFileContents.match(/\/\*!?\s?include(\s\-\w)?\s+[^\s]*\s?\*\//g);
			if (aMatch) {
				aMatch.forEach(function(include){
					var aFile = include.match(/(\/\*!?\s?include(\s\-\w)?\s+)([^\s]*)\s?\*\//)
						,sFile = aFile[aFile.length-1]
						,aSplit = file.split('/')
						,sPath
						,bEsc = include.indexOf(' -e ')!==-1
						,bBase64 = include.indexOf(' -b ')!==-1
					;
					aSplit.pop();
					sPath = aSplit.join('/')+'/';
					console.log('including ',fs.existsSync(sPath+sFile),sPath+sFile); // log
					if (bEsc) {
//						sFileContents = sFileContents.replace(include,includeInto(sPath+sFile).replace(/'/gi,'\\\'').replace(/"/gi,'\\\"'));
						sFileContents = sFileContents.replace(include,encodeURIComponent(includeInto(sPath+sFile)).replace(/'/gi,'\\\'').replace(/"/gi,'\\\"'));
//						var qs = require('querystring');
//						sFileContents = sFileContents.replace(include,qs.escape(encodeURIComponent(includeInto(sPath+sFile))));
					} else if (bBase64) {
						sFileContents = sFileContents.replace(include,'background-image:url(data:image/png;base64,'+fs.readFileSync(sPath+sFile).toString('base64')+');');
					} else {
						sFileContents = sFileContents.replace(include,includeInto(sPath+sFile));
					}
				});
			}
			return sFileContents;
		}
		grunt.log.writeln(iNumFiles+' files processed.');
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
			var sFileName = file.split('/').pop();
			sContents += oOptions.prefix.replace('%filename%',sFileName)+fs.readFileSync(file).toString().replace(/[\r\n\t]/g,' ').replace(/\s+/g,' ').replace(/>\s</g,'><')+oOptions.suffix;
		});
		fs.writeFileSync(this.data.dest,sContents);
		grunt.log.writeln(aFiles.length+' files wrapped and concatenated.');
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-ftp-deploy');
	grunt.loadNpmTasks('grunt-rsync');

	grunt.registerTask('default',[
		'jshint'
		,'uglify'
	]);
	grunt.registerTask('dev',[
		'includejs:temp'
		,'copy:temp'
	]);
	grunt.registerTask('dist',[
		'clean:dist'
		,'copy:dist'
		,'copy:connector'
		,'copy:css'
		,'includejs:temp'
		,'copy:temp'
		,'wrapconcat:dist'
		,'uglify:dist'
	]);
	grunt.registerTask('css',[
		'less:dev'
		,'includejs:temp'
		,'copy:temp'
	]);
	grunt.registerTask('tpl',[
		'wrapconcat'
		,'includejs:temp'
		,'copy:temp'
	]);

};
