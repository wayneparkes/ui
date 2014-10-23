'use strict';

module.exports = function(grunt) {
	
	grunt.initConfig({
		// used by the changelog task
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: 'build'
		},
		jshint: {
			client: {
				src: ['public/js/**/*.js'],
				options: {
					jshintrc: 'public/.jshintrc'
				}
			},
			build: {
				src: ['Gruntfile.js'],
				options: {
					jshintrc: '.jshintrc'
				}
			},
			server: {
				src: ['app.js'],
				options: {
					jshintrc: '.jshintrc'
				}
			}
		},
		less: {
			debug: {
				files: {
					'build/css/global.css': 'public/css/global.less',
					'build/css/common.css': 'public/css/common.less',
					'build/css/layout.css': 'public/css/layout.less'
				}
			},
			release: {
				options: {
					yuicompress: true
				},
				files: {
					'build/css/all.css': 'public/css/**/*.less'
				}
			}
		},
		copy: {
			js_debug: {
				expand: true,
				cwd: 'public/js',
				src: '**/*.js',
				dest: 'build/js/'
			}
		},
		concat: {
			release: {
				files: {
					'build/js/bundle.js': 'public/js/**/*.js'
				}
			}
		},
		uglify: {
			release: {
				files: {
					'build/js/all.min.js': 'build/js/bundle.js'
				}
			}
		},
		watch: {
			// lint js files when they change, and then copy them over to build directory
			js: {
				files: ['public/js/**/*.js'],
				tasks: ['jshint:client', 'copy:js_debug']
			},
			// lint server js
			lint_server: {
				files: ['app.js'],
				tasks: ['jshint:server']
			},
			// run the less:debug task if a less file changes
			less: {
				files: ['public/css/**/*.less'],
				tasks: ['less:debug']
			},
			// run the whole build again if the process changes
			rebuild: {
				files: ['Gruntfile.js'],
				tasks: ['jshint:build', 'build:debug']
			}
		},
		nodemon: {
			dev: {
				script: 'app.js',
				ignore: ['node_modules/**', './.git/**', './build/**', './public/**', './tests/**']
			}
		},
		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		bump: {
			options: {
				// after bumping, update it so that the changelog task uses same version number
				updateConfigs: ['pkg'],
				// commit CHANGELOG.md as well
				commitFiles: ['package.json', 'CHANGELOG.md'],
				pushTo: 'https://github.com/wayneparkes/ui.git'
			}
		},
		changelog: {
			options: {
				editor: 'subl -w'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-conventional-changelog');

	grunt.registerTask('build:debug', 'Lint and compile', [
		'clean', 'jshint', 'less:debug', 'copy:js_debug'
	]);

	grunt.registerTask('build:release', 'Lint, compile, bundle and optimise', [
		'clean', 'jshint', 'less:release', 'concat:relase', 'uglify:release'
	]);

	grunt.registerTask('dev', ['build:debug', 'concurrent']);

	grunt.registerTask('notes', ['bump-only', 'changelog', 'bump-commit']);
};