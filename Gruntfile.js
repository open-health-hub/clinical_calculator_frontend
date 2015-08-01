module.exports = function(grunt) {
  grunt.initConfig({
    project: {
      directories: {
        source: 'src',
        build: {
          base: 'build',
          js: '<%= project.directories.build.base %>/js',
          vendor: '<%= project.directories.build.base %>/vendor'
        }
      },

      files: {
        html: 'index.html',
        scripts: 'js/**/*.js',
        copy: [ '<%= project.files.html %>', '!<%= project.files.scripts %>' ]
      }
    },

    clean: {
      build: '<%= project.directories.build.base %>'
    },

    copy: {
      build: {
        src: '<%= project.files.copy %>',
        dest: '<%= project.directories.build.base %>',
        cwd: '<%= project.directories.source %>',
        expand: true
      }
    },

    'bower-install-simple': {
      build: {
        options: {
          directory: 'vendor',
          production: true
        }
      }
    },

    useminPrepare: {
      html: '<%= project.directories.source %>/<%= project.files.html %>',

      options: {
        dest: '<%= project.directories.build.base %>'
      }
    },

    usemin: {
      html: '<%= project.directories.build.base %>/<%= project.files.html %>'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bower-install-simple');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('build', [
    'clean',
    'copy',
    'bower-install-simple',
    'useminPrepare',
    'concat:generated',
    'uglify:generated',
    'cssmin:generated',
    'usemin'
  ]);
};