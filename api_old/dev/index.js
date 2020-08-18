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
})({"models/enums/UserRole.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserRole = void 0;

var _typeGraphql = require("type-graphql");

var UserRole;
exports.UserRole = UserRole;

(function (UserRole) {
  UserRole["ADMIN"] = "ADMIN";
  UserRole["USER"] = "USER";
})(UserRole || (exports.UserRole = UserRole = {}));

(0, _typeGraphql.registerEnumType)(UserRole, {
  name: "UserRole" // this one is mandatory

});
},{}],"models/scalars/Password.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Password = exports.passwordMask = void 0;

var _graphql = require("graphql");

const passwordMask = "******";
exports.passwordMask = passwordMask;
const Password = new _graphql.GraphQLScalarType({
  name: "Password",
  description: "Password scalar type",

  parseValue(value) {
    return value; // value from the client input variables
  },

  serialize(value) {
    return passwordMask; // value sent to the client
  },

  parseLiteral(ast) {
    if (ast.kind === _graphql.Kind.STRING) {
      return ast.value; // value from the client query
    }

    return null;
  }

});
exports.Password = Password;
},{}],"models/User.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _typeGraphql = require("type-graphql");

var _UserRole = require("./enums/UserRole");

var _Password = require("./scalars/Password");

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

var _a;

let User = class User extends _typeorm.BaseEntity {};

__decorate([(0, _typeorm.PrimaryGeneratedColumn)(), (0, _typeGraphql.Field)(type => _typeGraphql.ID), __metadata("design:type", String)], User.prototype, "id", void 0);

__decorate([(0, _typeorm.Column)(), (0, _typeGraphql.Field)(), __metadata("design:type", String)], User.prototype, "name", void 0);

__decorate([(0, _typeorm.Column)(), (0, _typeGraphql.Field)(type => _Password.Password), __metadata("design:type", String)], User.prototype, "password", void 0);

__decorate([(0, _typeorm.Column)("varchar"), (0, _typeGraphql.Field)(type => _UserRole.UserRole), __metadata("design:type", typeof (_a = typeof _UserRole.UserRole !== "undefined" && _UserRole.UserRole) === "function" ? _a : Object)], User.prototype, "role", void 0);

User = __decorate([(0, _typeGraphql.ObjectType)(), (0, _typeorm.Entity)()], User);
var _default = User;
exports.default = _default;
},{"./enums/UserRole":"models/enums/UserRole.ts","./scalars/Password":"models/scalars/Password.ts"}],"validators/SafePassword.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SafePassword = void 0;

var _classValidator = require("class-validator");

var _Password = require("../models/scalars/Password");

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

const letters = "abcdefghijklmnopqrstuvwxyz";
const digits = "0123456789";
const specialChars = "!\"§$%&/()=?`{[]}\\´+-.,;:_'*<>|°^~";
let SafePassword = class SafePassword {
  constructor() {
    this.length = false;
    this.lowerCase = false;
    this.upperCase = false;
    this.digit = false;
    this.specialChar = false;
  }

  validate(pw, args) {
    this.length = pw.length >= 8 && pw.length <= 32;
    this.lowerCase = letters.toLowerCase().split("").find(letter => pw.includes(letter)) !== undefined;
    this.upperCase = letters.toUpperCase().split("").find(letter => pw.includes(letter)) !== undefined;
    this.digit = digits.split("").find(digit => pw.includes(digit)) !== undefined;
    this.specialChar = specialChars.split("").find(char => pw.includes(char)) !== undefined;
    return pw === _Password.passwordMask || this.length && this.lowerCase && this.upperCase && this.digit && this.specialChar;
  }

  defaultMessage(args) {
    if (!this.length) return "Password is too short or too long!";
    if (!this.lowerCase) return "Password must contain a lowecase letter!";
    if (!this.upperCase) return "Password must contain an uppercase letter!";
    if (!this.digit) return "Password must contain a digit!";
    if (!this.specialChar) return "Password must contain a special character!";
    return "Something went wrong!";
  }

};
exports.SafePassword = SafePassword;
exports.SafePassword = SafePassword = __decorate([(0, _classValidator.ValidatorConstraint)({
  name: "safePassword",
  async: false
})], SafePassword);
},{"../models/scalars/Password":"models/scalars/Password.ts"}],"resolvers/user/CreateUserInput.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateUserInput = void 0;

var _typeGraphql = require("type-graphql");

var _UserRole = require("../../models/enums/UserRole");

var _Password = require("../../models/scalars/Password");

var _classValidator = require("class-validator");

var _SafePassword = require("../../validators/SafePassword");

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

var _a;

let CreateUserInput = class CreateUserInput {};
exports.CreateUserInput = CreateUserInput;

__decorate([(0, _typeGraphql.Field)(), (0, _classValidator.Length)(3, 12), __metadata("design:type", String)], CreateUserInput.prototype, "name", void 0);

__decorate([(0, _typeGraphql.Field)(type => _Password.Password), (0, _classValidator.Validate)(_SafePassword.SafePassword), __metadata("design:type", String)], CreateUserInput.prototype, "password", void 0);

__decorate([(0, _typeGraphql.Field)(type => _UserRole.UserRole), __metadata("design:type", typeof (_a = typeof _UserRole.UserRole !== "undefined" && _UserRole.UserRole) === "function" ? _a : Object)], CreateUserInput.prototype, "role", void 0);

exports.CreateUserInput = CreateUserInput = __decorate([(0, _typeGraphql.InputType)()], CreateUserInput);
},{"../../models/enums/UserRole":"models/enums/UserRole.ts","../../models/scalars/Password":"models/scalars/Password.ts","../../validators/SafePassword":"validators/SafePassword.ts"}],"resolvers/user/EditUserInput.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditUserInput = void 0;

var _typeGraphql = require("type-graphql");

var _UserRole = require("../../models/enums/UserRole");

var _Password = require("../../models/scalars/Password");

var _classValidator = require("class-validator");

var _SafePassword = require("../../validators/SafePassword");

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

var _a;

let EditUserInput = class EditUserInput {};
exports.EditUserInput = EditUserInput;

__decorate([(0, _typeGraphql.Field)(), __metadata("design:type", String)], EditUserInput.prototype, "id", void 0);

__decorate([(0, _typeGraphql.Field)(), (0, _classValidator.Length)(3, 12), __metadata("design:type", String)], EditUserInput.prototype, "name", void 0);

__decorate([(0, _typeGraphql.Field)(type => _Password.Password), (0, _classValidator.Validate)(_SafePassword.SafePassword), __metadata("design:type", String)], EditUserInput.prototype, "password", void 0);

__decorate([(0, _typeGraphql.Field)(type => _UserRole.UserRole), __metadata("design:type", typeof (_a = typeof _UserRole.UserRole !== "undefined" && _UserRole.UserRole) === "function" ? _a : Object)], EditUserInput.prototype, "role", void 0);

exports.EditUserInput = EditUserInput = __decorate([(0, _typeGraphql.InputType)()], EditUserInput);
},{"../../models/enums/UserRole":"models/enums/UserRole.ts","../../models/scalars/Password":"models/scalars/Password.ts","../../validators/SafePassword":"validators/SafePassword.ts"}],"resolvers/user/LoginUserInput.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoginUserInput = void 0;

var _typeGraphql = require("type-graphql");

var _Password = require("../../models/scalars/Password");

var _classValidator = require("class-validator");

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

let LoginUserInput = class LoginUserInput {};
exports.LoginUserInput = LoginUserInput;

__decorate([(0, _typeGraphql.Field)(), (0, _classValidator.Length)(3, 12), __metadata("design:type", String)], LoginUserInput.prototype, "name", void 0);

__decorate([(0, _typeGraphql.Field)(type => _Password.Password), __metadata("design:type", String)], LoginUserInput.prototype, "password", void 0);

exports.LoginUserInput = LoginUserInput = __decorate([(0, _typeGraphql.InputType)()], LoginUserInput);
},{"../../models/scalars/Password":"models/scalars/Password.ts"}],"libs/bcrypt.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compare = exports.hash = void 0;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const hash = (value, salt = 8) => new Promise((res, rej) => _bcryptjs.default.hash(value, salt, (err, result) => {
  if (err) rej(err);else res(result);
}));

exports.hash = hash;

const compare = (value, hash) => new Promise((res, rej) => _bcryptjs.default.compare(value, hash, (err, result) => {
  if (err) rej(err);else res(result);
}));

exports.compare = compare;
},{}],"services/UserService.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserService = void 0;

var _typedi = require("typedi");

var _server = require("../server");

var _User = _interopRequireDefault(require("../models/User"));

var _bcrypt = require("../libs/bcrypt");

var _Password = require("../models/scalars/Password");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

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

let UserService = class UserService {
  authorize(user, ctx) {
    var _a, _b;

    const expiresInDays = (_a = this.server.options.authExpire) !== null && _a !== void 0 ? _a : 1;

    const token = _jsonwebtoken.default.sign({
      id: user.id
    }, (_b = this.server.options.secret) !== null && _b !== void 0 ? _b : "Graphene", {
      expiresIn: expiresInDays + "d"
    });

    ctx.res.cookie('token', token, {
      path: "/",
      expires: new Date(Date.now() + expiresInDays * 1000 * 60 * 60 * 24),
      secure: false,
      httpOnly: true
    });
    return token;
  }

  checkPassword(user, password) {
    return (0, _bcrypt.compare)(password, user.password);
  }

  create(data) {
    return __awaiter(this, void 0, void 0, function* () {
      Object.assign(data, {
        password: yield (0, _bcrypt.hash)(data.password)
      });
      return _User.default.create(data).save();
    });
  }

  update(user, data) {
    return __awaiter(this, void 0, void 0, function* () {
      Object.assign(user, data, {
        password: !data.password || data.password === _Password.passwordMask ? user.password : yield (0, _bcrypt.hash)(data.password),
        id: user.id
      });
      return user.save();
    });
  }

};
exports.UserService = UserService;

UserService.AuthChecker = ({
  root,
  args,
  context,
  info
}, roles) => __awaiter(void 0, void 0, void 0, function* () {
  if (!context.user.id) return false;
  const user = yield _User.default.findOne(context.user.id);

  if (user) {
    return roles.length === 0 || roles.includes(user.role);
  }

  return false;
});

__decorate([(0, _typedi.Inject)("server"), __metadata("design:type", typeof (_a = typeof _server.GrapheneServer !== "undefined" && _server.GrapheneServer) === "function" ? _a : Object)], UserService.prototype, "server", void 0);

__decorate([(0, _typedi.Inject)("logger"), __metadata("design:type", typeof (_b = typeof _tracer.Tracer !== "undefined" && _tracer.Tracer.Logger) === "function" ? _b : Object)], UserService.prototype, "logger", void 0);

exports.UserService = UserService = __decorate([(0, _typedi.Service)()], UserService);
},{"../server":"server.ts","../models/User":"models/User.ts","../libs/bcrypt":"libs/bcrypt.ts","../models/scalars/Password":"models/scalars/Password.ts"}],"resolvers/user/UserResolver.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeGraphql = require("type-graphql");

var _User = _interopRequireDefault(require("../../models/User"));

var _CreateUserInput = require("./CreateUserInput");

var _EditUserInput = require("./EditUserInput");

var _LoginUserInput = require("./LoginUserInput");

var _server = require("../../server");

var _typedi = require("typedi");

var _UserService = require("../../services/UserService");

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

var _a, _b, _c, _d, _e, _f, _g, _h, _j;

let UserResolver = class UserResolver //implements ResolverInterface<User>
{
  constructor(userService) {
    this.userService = userService;
  }

  users() {
    return _User.default.find();
  }

  user(id) {
    return _User.default.findOne({
      where: {
        id
      }
    });
  }

  createUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.userService.create(data);
    });
  }

  editUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield _User.default.findOne({
        where: {
          id: data.id
        }
      });
      if (!user) throw new Error("User not found: " + data.id);
      return this.userService.update(user, data);
    });
  }

  deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield _User.default.findOne({
        where: {
          id
        }
      });
      if (!user) throw new Error("User not found: " + id);
      return user.remove();
    });
  }

  me(context) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield _User.default.findOne({
        where: {
          id: context.user.id
        }
      });
      if (!user) throw new Error("User not found: " + context.user.id);
      return user;
    });
  }

  editMe(data, context) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield _User.default.findOne({
        where: {
          id: context.user.id
        }
      });
      return this.userService.update(user, data);
    });
  }

  login(data, context) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield _User.default.findOne({
        where: {
          name: data.name
        }
      });
      if (!user || !(yield this.userService.checkPassword(user, data.password))) throw new Error("Credentials invalid");
      return this.userService.authorize(user, context);
    });
  }

  logout(context) {
    return __awaiter(this, void 0, void 0, function* () {
      context.res.clearCookie('token');
      context.user = {};
      return "";
    });
  }

};

__decorate([(0, _typeGraphql.Authorized)("USER", "ADMIN"), (0, _typeGraphql.Query)(returns => [_User.default]), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], UserResolver.prototype, "users", null);

__decorate([(0, _typeGraphql.Authorized)("USER", "ADMIN"), (0, _typeGraphql.Query)(() => _User.default), __param(0, (0, _typeGraphql.Arg)("id")), __metadata("design:type", Function), __metadata("design:paramtypes", [String]), __metadata("design:returntype", void 0)], UserResolver.prototype, "user", null);

__decorate([(0, _typeGraphql.Authorized)("ADMIN"), (0, _typeGraphql.Mutation)(() => _User.default), __param(0, (0, _typeGraphql.Arg)("data")), __metadata("design:type", Function), __metadata("design:paramtypes", [typeof (_a = typeof _CreateUserInput.CreateUserInput !== "undefined" && _CreateUserInput.CreateUserInput) === "function" ? _a : Object]), __metadata("design:returntype", Promise)], UserResolver.prototype, "createUser", null);

__decorate([(0, _typeGraphql.Authorized)("ADMIN"), (0, _typeGraphql.Mutation)(() => _User.default), __param(0, (0, _typeGraphql.Arg)("data")), __metadata("design:type", Function), __metadata("design:paramtypes", [typeof (_b = typeof _EditUserInput.EditUserInput !== "undefined" && _EditUserInput.EditUserInput) === "function" ? _b : Object]), __metadata("design:returntype", Promise)], UserResolver.prototype, "editUser", null);

__decorate([(0, _typeGraphql.Authorized)("ADMIN"), (0, _typeGraphql.Mutation)(() => _User.default), __param(0, (0, _typeGraphql.Arg)("id")), __metadata("design:type", Function), __metadata("design:paramtypes", [String]), __metadata("design:returntype", Promise)], UserResolver.prototype, "deleteUser", null);

__decorate([(0, _typeGraphql.Authorized)("USER", "ADMIN"), (0, _typeGraphql.Query)(() => _User.default), __param(0, (0, _typeGraphql.Ctx)()), __metadata("design:type", Function), __metadata("design:paramtypes", [typeof (_c = typeof _server.GrapheneContext !== "undefined" && _server.GrapheneContext) === "function" ? _c : Object]), __metadata("design:returntype", Promise)], UserResolver.prototype, "me", null);

__decorate([(0, _typeGraphql.Authorized)("USER", "ADMIN"), (0, _typeGraphql.Mutation)(() => _User.default), __param(0, (0, _typeGraphql.Arg)("data")), __param(1, (0, _typeGraphql.Ctx)()), __metadata("design:type", Function), __metadata("design:paramtypes", [typeof (_d = typeof _EditUserInput.EditUserInput !== "undefined" && _EditUserInput.EditUserInput) === "function" ? _d : Object, typeof (_e = typeof _server.GrapheneContext !== "undefined" && _server.GrapheneContext) === "function" ? _e : Object]), __metadata("design:returntype", Promise)], UserResolver.prototype, "editMe", null);

__decorate([(0, _typeGraphql.Mutation)(() => String), __param(0, (0, _typeGraphql.Arg)("data")), __param(1, (0, _typeGraphql.Ctx)()), __metadata("design:type", Function), __metadata("design:paramtypes", [typeof (_f = typeof _LoginUserInput.LoginUserInput !== "undefined" && _LoginUserInput.LoginUserInput) === "function" ? _f : Object, typeof (_g = typeof _server.GrapheneContext !== "undefined" && _server.GrapheneContext) === "function" ? _g : Object]), __metadata("design:returntype", Promise)], UserResolver.prototype, "login", null);

__decorate([(0, _typeGraphql.Authorized)("USER", "ADMIN"), (0, _typeGraphql.Mutation)(type => String), __param(0, (0, _typeGraphql.Ctx)()), __metadata("design:type", Function), __metadata("design:paramtypes", [typeof (_h = typeof _server.GrapheneContext !== "undefined" && _server.GrapheneContext) === "function" ? _h : Object]), __metadata("design:returntype", Promise)], UserResolver.prototype, "logout", null);

UserResolver = __decorate([(0, _typedi.Service)(), (0, _typeGraphql.Resolver)(of => _User.default), __metadata("design:paramtypes", [typeof (_j = typeof _UserService.UserService !== "undefined" && _UserService.UserService) === "function" ? _j : Object])], UserResolver);
var _default = UserResolver;
exports.default = _default;
},{"../../models/User":"models/User.ts","./CreateUserInput":"resolvers/user/CreateUserInput.ts","./EditUserInput":"resolvers/user/EditUserInput.ts","./LoginUserInput":"resolvers/user/LoginUserInput.ts","../../server":"server.ts","../../services/UserService":"services/UserService.ts"}],"models/KeyValue.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeGraphql = require("type-graphql");

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

let KeyValue = class KeyValue {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

};

__decorate([(0, _typeGraphql.Field)(), __metadata("design:type", String)], KeyValue.prototype, "key", void 0);

__decorate([(0, _typeGraphql.Field)(), __metadata("design:type", String)], KeyValue.prototype, "value", void 0);

KeyValue = __decorate([(0, _typeGraphql.ObjectType)(), __metadata("design:paramtypes", [String, String])], KeyValue);
var _default = KeyValue;
exports.default = _default;
},{}],"models/GrapheneConfig.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeGraphql = require("type-graphql");

var _KeyValue = _interopRequireDefault(require("./KeyValue"));

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

var _a, _b;

let GrapheneConfig = class GrapheneConfig {
  constructor(inputRenderers, cellRenderers, hiddenContentTypes) {
    this.inputRenderers = Object.entries(inputRenderers).map(([key, value]) => new _KeyValue.default(key, value));
    this.cellRenderers = Object.entries(cellRenderers).map(([key, value]) => new _KeyValue.default(key, value));
    this.hiddenContentTypes = [...hiddenContentTypes];
  }

};

__decorate([(0, _typeGraphql.Field)(type => [_KeyValue.default]), __metadata("design:type", Array)], GrapheneConfig.prototype, "inputRenderers", void 0);

__decorate([(0, _typeGraphql.Field)(type => [_KeyValue.default]), __metadata("design:type", Array)], GrapheneConfig.prototype, "cellRenderers", void 0);

__decorate([(0, _typeGraphql.Field)(type => [String]), __metadata("design:type", Array)], GrapheneConfig.prototype, "hiddenContentTypes", void 0);

GrapheneConfig = __decorate([(0, _typeGraphql.ObjectType)(), __metadata("design:paramtypes", [typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object, typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object, Array])], GrapheneConfig);
var _default = GrapheneConfig;
exports.default = _default;
},{"./KeyValue":"models/KeyValue.ts"}],"resolvers/grapheneConfig/GrapheneConfigResolver.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeGraphql = require("type-graphql");

var _server = require("../../server");

var _typedi = require("typedi");

var _GrapheneConfig = _interopRequireDefault(require("../../models/GrapheneConfig"));

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

var _a;

let GrapheneConfigResolver = class GrapheneConfigResolver //implements ResolverInterface<User>
{
  grapheneConfig() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.server.clientConfig;
    });
  }

};

__decorate([(0, _typedi.Inject)("server"), __metadata("design:type", typeof (_a = typeof _server.GrapheneServer !== "undefined" && _server.GrapheneServer) === "function" ? _a : Object)], GrapheneConfigResolver.prototype, "server", void 0);

__decorate([(0, _typeGraphql.Authorized)("USER", "ADMIN"), (0, _typeGraphql.Query)(() => _GrapheneConfig.default), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", Promise)], GrapheneConfigResolver.prototype, "grapheneConfig", null);

GrapheneConfigResolver = __decorate([(0, _typedi.Service)(), (0, _typeGraphql.Resolver)(of => _GrapheneConfig.default)], GrapheneConfigResolver);
var _default = GrapheneConfigResolver;
exports.default = _default;
},{"../../server":"server.ts","../../models/GrapheneConfig":"models/GrapheneConfig.ts"}],"../../node_modules/parcel/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../node_modules/parcel/src/builtins/bundle-loader.js":[function(require,module,exports) {
var getBundleURL = require('./bundle-url').getBundleURL;

function loadBundlesLazy(bundles) {
  if (!Array.isArray(bundles)) {
    bundles = [bundles];
  }

  var id = bundles[bundles.length - 1];

  try {
    return Promise.resolve(require(id));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return new LazyPromise(function (resolve, reject) {
        loadBundles(bundles.slice(0, -1)).then(function () {
          return require(id);
        }).then(resolve, reject);
      });
    }

    throw err;
  }
}

function loadBundles(bundles) {
  return Promise.all(bundles.map(loadBundle));
}

var bundleLoaders = {};

function registerBundleLoader(type, loader) {
  bundleLoaders[type] = loader;
}

module.exports = exports = loadBundlesLazy;
exports.load = loadBundles;
exports.register = registerBundleLoader;
var bundles = {};

function loadBundle(bundle) {
  var id;

  if (Array.isArray(bundle)) {
    id = bundle[1];
    bundle = bundle[0];
  }

  if (bundles[bundle]) {
    return bundles[bundle];
  }

  var type = (bundle.substring(bundle.lastIndexOf('.') + 1, bundle.length) || bundle).toLowerCase();
  var bundleLoader = bundleLoaders[type];

  if (bundleLoader) {
    return bundles[bundle] = bundleLoader(getBundleURL() + bundle).then(function (resolved) {
      if (resolved) {
        module.bundle.register(id, resolved);
      }

      return resolved;
    }).catch(function (e) {
      delete bundles[bundle];
      throw e;
    });
  }
}

function LazyPromise(executor) {
  this.executor = executor;
  this.promise = null;
}

LazyPromise.prototype.then = function (onSuccess, onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.then(onSuccess, onError);
};

LazyPromise.prototype.catch = function (onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.catch(onError);
};
},{"./bundle-url":"../../node_modules/parcel/src/builtins/bundle-url.js"}],"server.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GrapheneServer = void 0;

var _express = _interopRequireDefault(require("express"));

var _apolloServerExpress = require("apollo-server-express");

var _graphqlDepthLimit = _interopRequireDefault(require("graphql-depth-limit"));

var _compression = _interopRequireDefault(require("compression"));

var _cors = _interopRequireDefault(require("cors"));

var _typeGraphql = require("type-graphql");

var _UserResolver = _interopRequireDefault(require("./resolvers/user/UserResolver"));

var _typeorm = require("typeorm");

var _path = require("path");

var _User = _interopRequireDefault(require("./models/User"));

var _fs = require("fs");

var _expressJwt = _interopRequireDefault(require("express-jwt"));

var _UserRole = require("./models/enums/UserRole");

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _typedi = require("typedi");

var _UserService = require("./services/UserService");

var _tracer = require("tracer");

var _GrapheneConfig = _interopRequireDefault(require("./models/GrapheneConfig"));

var _GrapheneConfigResolver = _interopRequireDefault(require("./resolvers/grapheneConfig/GrapheneConfigResolver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

const www = (0, _path.join)(__dirname, "..", "..", "ui", "www");
const indexHtml = (0, _path.join)(www, "index.html");
(0, _typeorm.useContainer)(_typedi.Container);

class GrapheneServer {
  constructor() {}

  static create(opts) {
    var _a, _b, _c, _d, _e, _f;

    return __awaiter(this, void 0, void 0, function* () {
      const server = new GrapheneServer();
      server.options = opts !== null && opts !== void 0 ? opts : {};

      _typedi.Container.set("server", server);

      server.logger = (0, _tracer.colorConsole)({
        level: "debug",
        format: ["{{timestamp}} graphene <{{title}}> {{message}}", {
          error: '{{timestamp}} graphene <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}',
          warn: '{{timestamp}} graphene <{{title}}> {{message}} (in {{file}}:{{line}})'
        }]
      });

      _typedi.Container.set("logger", server.logger);

      if (opts === null || opts === void 0 ? void 0 : opts.demoMode) {
        server.logger.info("Running in demo mode");
      }

      const connectionConfig = Object.assign({
        type: "sqlite",
        database: "./db.sqlite3",
        entities: [_User.default, ...((opts === null || opts === void 0 ? void 0 : opts.demoMode) ? [yield require("_bundle_loader")(require.resolve('./models/DemoPage'))] : []), ...((_a = opts === null || opts === void 0 ? void 0 : opts.entities) !== null && _a !== void 0 ? _a : [])],
        synchronize: true
      }, opts === null || opts === void 0 ? void 0 : opts.connection);
      server.logger.info(`Connecting to ${connectionConfig.database}(${connectionConfig.type})`);
      server.orm = yield (0, _typeorm.createConnection)(connectionConfig);
      server.logger.info("Setting up express");
      server.express = (0, _express.default)();
      server.express.use('*', (0, _cors.default)());
      server.express.use((0, _compression.default)());
      server.express.use((0, _cookieParser.default)());
      server.logger.info("Setting up jwt");
      server.express.use((0, _expressJwt.default)({
        secret: (_b = opts === null || opts === void 0 ? void 0 : opts.secret) !== null && _b !== void 0 ? _b : "Graphene",
        credentialsRequired: false,
        getToken: req => {
          var _a, _b, _c;

          if (((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[0]) === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
          } else if ((_b = req.query) === null || _b === void 0 ? void 0 : _b.token) {
            return req.query.token;
          } else if ((_c = req.cookies) === null || _c === void 0 ? void 0 : _c.token) {
            return req.cookies.token;
          }

          return null;
        }
      }));
      server.clientConfig = new _GrapheneConfig.default((_c = opts === null || opts === void 0 ? void 0 : opts.inputRenderers) !== null && _c !== void 0 ? _c : {}, (_d = opts === null || opts === void 0 ? void 0 : opts.cellRenderers) !== null && _d !== void 0 ? _d : {}, ["GrapheneConfig", ...((_e = opts === null || opts === void 0 ? void 0 : opts.hiddenContentTypes) !== null && _e !== void 0 ? _e : [])]);
      server.logger.info("Setting up graphql");
      const resolvers = [_UserResolver.default, ...((opts === null || opts === void 0 ? void 0 : opts.demoMode) ? [yield require("_bundle_loader")(require.resolve('./resolvers/demoPage/DemoPageResolver'))] : []), _GrapheneConfigResolver.default, ...((_f = opts === null || opts === void 0 ? void 0 : opts.resolvers) !== null && _f !== void 0 ? _f : [])];
      server.schema = yield (0, _typeGraphql.buildSchema)({
        resolvers: resolvers,
        emitSchemaFile: true,
        authChecker: _UserService.UserService.AuthChecker,
        container: _typedi.Container
      });
      server.apollo = new _apolloServerExpress.ApolloServer({
        schema: server.schema,
        validationRules: [(0, _graphqlDepthLimit.default)(7)],
        context: ({
          req,
          res
        }) => {
          var _a;

          const user = (_a = req.user) !== null && _a !== void 0 ? _a : {}; //server.logger.debug("context user", user);

          return {
            req,
            res,
            user
          };
        }
      });
      server.apollo.applyMiddleware({
        app: server.express,
        path: '/graphql'
      });
      server.logger.info("Setting up ui");
      server.express.use(_express.default.static(www));
      server.express.use((req, res) => {
        (0, _fs.readFile)(indexHtml, (err, data) => {
          var _a;

          res.send(data.toString().replace("<!--CUSTOM_HEAD-->", (_a = opts === null || opts === void 0 ? void 0 : opts.customHead) !== null && _a !== void 0 ? _a : ""));
        });
      });
      server.logger.info("Checking for admin user");
      yield server.createAdminUser(opts === null || opts === void 0 ? void 0 : opts.adminPassword);
      return server;
    });
  }

  createAdminUser(overridePw) {
    return __awaiter(this, void 0, void 0, function* () {
      const userService = _typedi.Container.get(_UserService.UserService);

      let adminUser = yield _User.default.findOne({
        where: {
          name: "admin"
        }
      });

      if (!adminUser) {
        adminUser = yield userService.create({
          name: "admin",
          role: _UserRole.UserRole.ADMIN,
          password: "admin"
        });
        this.logger.info("Default admin user was created with password: \"admin\"");
        this.logger.info("Please change your password after first login");
      }

      if (overridePw) {
        adminUser = yield userService.update(adminUser, {
          password: overridePw
        });
        this.logger.info("Admin password was overriden");
      }

      return adminUser;
    });
  }

  listen() {
    var _a, _b;

    return __awaiter(this, void 0, void 0, function* () {
      const host = (_a = this.options.hostname) !== null && _a !== void 0 ? _a : "0.0.0.0";
      const port = (_b = this.options.port) !== null && _b !== void 0 ? _b : 1234;
      return new Promise(res => this.express.listen(port, host, () => {
        this.logger.info(`Listening on ${host}:${port}`);
        res();
      }));
    });
  }

}

exports.GrapheneServer = GrapheneServer;
},{"./resolvers/user/UserResolver":"resolvers/user/UserResolver.ts","./models/User":"models/User.ts","./models/enums/UserRole":"models/enums/UserRole.ts","./services/UserService":"services/UserService.ts","./models/GrapheneConfig":"models/GrapheneConfig.ts","./resolvers/grapheneConfig/GrapheneConfigResolver":"resolvers/grapheneConfig/GrapheneConfigResolver.ts","_bundle_loader":"../../node_modules/parcel/src/builtins/bundle-loader.js","./models/DemoPage":[["DemoPage.82dfe6e1.js","models/DemoPage.ts"],"DemoPage.82dfe6e1.js.map","models/DemoPage.ts"],"./resolvers/demoPage/DemoPageResolver":[["DemoPageResolver.b062c7cd.js","resolvers/demoPage/DemoPageResolver.ts"],"DemoPageResolver.b062c7cd.js.map","resolvers/demoPage/DemoPageResolver.ts"]}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _server = require("./server");

Object.keys(_server).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _server[key];
    }
  });
});
},{"./server":"server.ts"}],"models/scalars/RichContent.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichContent = void 0;

var _graphql = require("graphql");

const RichContent = new _graphql.GraphQLScalarType({
  name: "RichContent",
  description: "RichContent scalar type",

  parseValue(value) {
    return value; // value from the client input variables
  },

  serialize(value) {
    return value; // value sent to the client
  },

  parseLiteral(ast) {
    if (ast.kind === _graphql.Kind.STRING) {
      return ast.value; // value from the client query
    }

    return null;
  }

});
exports.RichContent = RichContent;
},{}],"../../node_modules/parcel/src/builtins/loaders/node/js-loader.js":[function(require,module,exports) {
var fs = require('fs');

module.exports = function loadJSBundle(bundle) {
  return new Promise(function (resolve, reject) {
    fs.readFile(__dirname + bundle, 'utf8', function (err, data) {
      if (err) {
        reject(err);
      } else {
        // wait for the next event loop iteration, so we are sure
        // the current module is fully loaded
        setImmediate(function () {
          resolve(data);
        });
      }
    });
  }).then(function (code) {
    new Function('', code)();
  });
};
},{}],0:[function(require,module,exports) {
var b=require("../../node_modules/parcel/src/builtins/bundle-loader.js");b.register("js",require("../../node_modules/parcel/src/builtins/loaders/node/js-loader.js"));
},{}]},{},[0,"index.ts"], null)
//# sourceMappingURL=/index.js.map