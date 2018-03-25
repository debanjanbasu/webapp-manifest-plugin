"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FAVICON_PLUGIN = void 0;

var _mimeTypes = require("mime-types");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WEBPACK_COMPILATION_HOOK = "compilation";
var HTML_PLUGIN_BEFORE_PROCESS = "html-webpack-plugin-before-html-processing";
var HTML_PLUGIN_ALTER_ASSETS = "html-webpack-plugin-alter-asset-tags";
var FAVICON_PLUGIN = "FaviconPlugin";
exports.FAVICON_PLUGIN = FAVICON_PLUGIN;

function normaliseConfig(config) {
  return {
    name: config.name || "",
    short_name: config.short_name || config.shortName || "",
    description: config.description || null,
    dir: config.dir || "auto",
    lang: config.lang || "en-US",
    display: config.display || "standalone",
    orientation: config.orientation || "any",
    start_url: config.start_url || config.startUrl || "/",
    background_color: config.background_color || config.background_colour || config.backgroundColor || config.backgroundColour || "#fff",
    theme_color: config.theme_color || config.theme_colour || config.themeColor || config.themeColour || "#fff",
    icons: config.icons || [],
    prefer_related_applications: config.prefer_related_applications || config.preferRelatedApplications || false,
    related_applications: config.related_applications || config.relatedApplications || [],
    scope: config.scope || "/",
    publicPath: config.publicPath || "/"
  };
}

var WebappManifestPlugin =
/*#__PURE__*/
function () {
  function WebappManifestPlugin(config) {
    _classCallCheck(this, WebappManifestPlugin);

    this.config = _extends({}, config);
  }

  _createClass(WebappManifestPlugin, [{
    key: "compilationHook",
    value: function compilationHook() {
      var config = this.config;
      return function hook(compilation) {
        compilation.plugin(HTML_PLUGIN_BEFORE_PROCESS, function (htmlData, callback) {
          var publicPath = config.publicPath;

          if (publicPath.length > 0 && publicPath[publicPath.length - 1] !== "/") {
            publicPath += "/";
          }

          htmlData.html = htmlData.html.replace("</head>", "  <link rel=\"manifest\" href=\"".concat(publicPath, "manifest.json\">\n</head>")); // we want to inject our manifest into the head

          callback(null, htmlData);
        });
        compilation.plugin(HTML_PLUGIN_ALTER_ASSETS, function (htmlData, callback) {
          var assets = Object.keys(compilation.assets);

          if (config.icons === FAVICON_PLUGIN) {
            // use the favicon
            var images = assets.filter(function (a) {
              return a.includes("android-chrome-");
            });
            config.icons = images.map(function (image) {
              return {
                src: image,
                type: (0, _mimeTypes.lookup)(image),
                sizes: image.match(/(\d{2,3}x\d{2,3})/g)[0]
              };
            });
          }

          var _source = JSON.stringify(normaliseConfig(config), null, 2);

          compilation.assets["manifest.json"] = {
            source: function source() {
              return _source;
            },
            size: function size() {
              return _source.length;
            }
          };
          callback(null, htmlData);
        });
      };
    }
  }, {
    key: "apply",
    value: function apply(compiler) {
      compiler.plugin(WEBPACK_COMPILATION_HOOK, this.compilationHook());
    }
  }]);

  return WebappManifestPlugin;
}();

exports.default = WebappManifestPlugin;