// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"services/DemoPageService.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DemoPageService = void 0;

var _typedi = require("typedi");

var _server = require("../server");

var _DemoPage = _interopRequireDefault(require("../models/DemoPage"));

var _tracer = require("tracer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var _a, _b;

let DemoPageService = class DemoPageService {
  getAll() {
    return _DemoPage.default.find();
  }

  getOne(id) {
    return _DemoPage.default.findOne({
      where: {
        id
      }
    });
  }

  create(data, user) {
    const page = _DemoPage.default.create(Object.assign(Object.assign({}, data), {
      author: user
    }));

    console.log(Object.assign(Object.assign({}, data), {
      author: user
    }));
    return page.save();
  }

  edit(data) {
    return __awaiter(this, void 0, void 0, function* () {
      const page = yield this.getOne(data.id);
      if (!page) throw new Error("Page not found: " + data.id);
      Object.assign(page, Object.assign(Object.assign({}, data), {
        id: page.id
      }));
      return page.save();
    });
  }

  delete(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const page = yield this.getOne(id);
      if (!page) throw new Error("Page not found: " + id);
      return page.remove();
    });
  }

};
exports.DemoPageService = DemoPageService;

__decorate([(0, _typedi.Inject)("server"), __metadata("design:type", typeof (_a = typeof _server.GrapheneServer !== "undefined" && _server.GrapheneServer) === "function" ? _a : Object)], DemoPageService.prototype, "server", void 0);

__decorate([(0, _typedi.Inject)("logger"), __metadata("design:type", typeof (_b = typeof _tracer.Tracer !== "undefined" && _tracer.Tracer.Logger) === "function" ? _b : Object)], DemoPageService.prototype, "logger", void 0);

exports.DemoPageService = DemoPageService = __decorate([(0, _typedi.Service)()], DemoPageService);
},{"../server":"server.ts","../models/DemoPage":"models/DemoPage.ts"}],"resolvers/demoPage/DemoPageResolver.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EditPageInput = exports.CreatePageInput = void 0;

var _typeGraphql = require("type-graphql");

var _User = _interopRequireDefault(require("../../models/User"));

var _server = require("../../server");

var _typedi = require("typedi");

var _DemoPage = _interopRequireDefault(require("../../models/DemoPage"));

var _DemoPageService = require("../../services/DemoPageService");

var _RichContent = require("../../models/scalars/RichContent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param = void 0 && (void 0).__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var _a, _b, _c;

let CreatePageInput = class CreatePageInput {};
exports.CreatePageInput = CreatePageInput;

__decorate([(0, _typeGraphql.Field)(), __metadata("design:type", String)], CreatePageInput.prototype, "title", void 0);

__decorate([(0, _typeGraphql.Field)(type => _RichContent.RichContent), __metadata("design:type", String)], CreatePageInput.prototype, "content", void 0);

exports.CreatePageInput = CreatePageInput = __decorate([(0, _typeGraphql.InputType)()], CreatePageInput);
let EditPageInput = class EditPageInput {};
exports.EditPageInput = EditPageInput;

__decorate([(0, _typeGraphql.Field)(), __metadata("design:type", String)], EditPageInput.prototype, "id", void 0);

__decorate([(0, _typeGraphql.Field)(), __metadata("design:type", String)], EditPageInput.prototype, "title", void 0);

__decorate([(0, _typeGraphql.Field)(type => _RichContent.RichContent), __metadata("design:type", String)], EditPageInput.prototype, "content", void 0);

exports.EditPageInput = EditPageInput = __decorate([(0, _typeGraphql.InputType)()], EditPageInput);
let DemoPageResolver = class DemoPageResolver {
  constructor(pageService) {
    this.pageService = pageService;
  }

  demoPages() {
    return this.pageService.getAll();
  }

  demoPage(id) {
    return this.pageService.getOne(id);
  }

  createDemoPage(data, context) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield _User.default.findOne({
        where: {
          id: context.user.id
        }
      });
      return this.pageService.create(data, user);
    });
  }

  editDemoPage(data, context) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.pageService.edit(data);
    });
  }

  deleteDemoPage(id) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.pageService.delete(id);
    });
  }

};

__decorate([(0, _typeGraphql.Query)(returns => [_DemoPage.default]), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], DemoPageResolver.prototype, "demoPages", null);

__decorate([(0, _typeGraphql.Query)(() => _DemoPage.default), __param(0, (0, _typeGraphql.Arg)("id")), __metadata("design:type", Function), __metadata("design:paramtypes", [String]), __metadata("design:returntype", void 0)], DemoPageResolver.prototype, "demoPage", null);

__decorate([(0, _typeGraphql.Authorized)("ADMIN"), (0, _typeGraphql.Mutation)(() => _DemoPage.default), __param(0, (0, _typeGraphql.Arg)("data")), __param(1, (0, _typeGraphql.Ctx)()), __metadata("design:type", Function), __metadata("design:paramtypes", [CreatePageInput, typeof (_a = typeof _server.GrapheneContext !== "undefined" && _server.GrapheneContext) === "function" ? _a : Object]), __metadata("design:returntype", Promise)], DemoPageResolver.prototype, "createDemoPage", null);

__decorate([(0, _typeGraphql.Authorized)("ADMIN"), (0, _typeGraphql.Mutation)(() => _DemoPage.default), __param(0, (0, _typeGraphql.Arg)("data")), __param(1, (0, _typeGraphql.Ctx)()), __metadata("design:type", Function), __metadata("design:paramtypes", [EditPageInput, typeof (_b = typeof _server.GrapheneContext !== "undefined" && _server.GrapheneContext) === "function" ? _b : Object]), __metadata("design:returntype", Promise)], DemoPageResolver.prototype, "editDemoPage", null);

__decorate([(0, _typeGraphql.Authorized)("ADMIN"), (0, _typeGraphql.Mutation)(() => _DemoPage.default), __param(0, (0, _typeGraphql.Arg)("id")), __metadata("design:type", Function), __metadata("design:paramtypes", [String]), __metadata("design:returntype", Promise)], DemoPageResolver.prototype, "deleteDemoPage", null);

DemoPageResolver = __decorate([(0, _typedi.Service)(), (0, _typeGraphql.Resolver)(of => _DemoPage.default), __metadata("design:paramtypes", [typeof (_c = typeof _DemoPageService.DemoPageService !== "undefined" && _DemoPageService.DemoPageService) === "function" ? _c : Object])], DemoPageResolver);
var _default = DemoPageResolver;
exports.default = _default;
},{"../../models/User":"models/User.ts","../../server":"server.ts","../../models/DemoPage":"models/DemoPage.ts","../../services/DemoPageService":"services/DemoPageService.ts","../../models/scalars/RichContent":"models/scalars/RichContent.ts"}]},{},[], null)
//# sourceMappingURL=/DemoPageResolver.b062c7cd.js.map