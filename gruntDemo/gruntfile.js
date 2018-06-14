module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dynamic_mappings: {
        // Grunt will search for "**/*.js" under "js/" when the "uglify" task
        // runs and build the appropriate src-dest file mappings then, so you
        // don't need to update the Gruntfile when files are added or removed.
        files: [{
          expand: true, // Enable dynamic expansion.
          cwd: '<%= pkg.oriPath %>js/', // Src matches are relative to this path.
          src: ['*.js'], // Actual pattern(s) to match.    , '!*.min.js'
          dest: '<%= pkg.tarPath %>js/', // Destination path prefix.
          // ext: '.min.js', // Dest filepaths will have this extension.
          // extDot: 'first' // Extensions in filenames begin after the first dot
        }, ],
      },
    },
    cssmin: { //css文件压缩
      minify: {
        expand: true, // 启用下面的选项
        cwd: '<%= pkg.oriPath %>css/', // 指定待压缩的文件路径
        src: ['*.css'], // 匹配相对于cwd目录下的所有css文件(排除.min.css文件)  , '!*.min.css'
        dest: '<%= pkg.tarPath %>css/', // 生成的压缩文件存放的路径
        // ext: '.min.css' // 生成的文件都使用.min.css替换原有扩展名，生成文件存放于dest指定的目录中
      }
    }
    // jshint: {
    //   ignore_warning: {
    //     options: {
    //       '-W015': true,
    //     },
    //     src: 'js/**',
    //     filter: 'isFile'
    //   }
    // },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // Load the plugin that provides the "jshint" task.
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cssmin']);

};