"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var urlJoin = require("join-path");
var config_1 = require("../app/lib/config");
var menuItem = function (item, index) {
    if (item.children) {
        return (React.createElement("li", { key: index },
            React.createElement("span", null, item.label),
            React.createElement("ul", null, item.map(menuItem))));
    }
    else if (item.link) {
        return (React.createElement("li", { key: index },
            React.createElement(react_router_dom_1.Link, { to: urlJoin('/', config_1.default.baseUri, item.link) }, item.label)));
    }
    return null;
};
exports.Menu = function () {
    if (config_1.default.menu) {
        return (React.createElement("nav", null,
            React.createElement("ul", null, config_1.default.menu.map(menuItem))));
    }
    return null;
};
//# sourceMappingURL=menu.js.map