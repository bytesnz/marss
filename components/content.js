"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const config_1 = require("../app/lib/config");
const react_helmet_1 = require("react-helmet");
//const oldRequire = require
const markdown_1 = require("./markdown");
// TODO Show previous content until new content is loaded
// TODO Add loading status while loading
class ContentComponent extends React.Component {
    constructor(props) {
        super(props);
        this.checkContent(props);
    }
    componentWillReceiveProps(newProps) {
        this.checkContent(newProps);
    }
    correctId(contentId, id) {
        if (contentId === id) {
            return true;
        }
        else if (contentId === (id ? id + '/index' : 'index')) {
            return true;
        }
        return false;
    }
    checkContent(props) {
        const { actions } = props;
        const route = props.location;
        let { content } = props;
        const id = route.pathname.slice(config_1.default.baseUri.length);
        if (content && content.data && !this.correctId(content.data.id, id)) {
            //actions.content.clearContent();
            content = null;
        }
        if (content === null) {
            actions.content.fetchContent(id);
        }
    }
    render() {
        let { content } = this.props;
        const route = this.props.location;
        const id = route.pathname.slice(config_1.default.baseUri.length);
        // Don't show content if it is not for the routed id
        if (content && content.data && !this.correctId(content.data.id, id)) {
            content = null;
        }
        if (!content) {
            return null;
        }
        if (content.error) {
            if (id.startsWith(config_1.default.tagsUri)) {
                return null;
            }
            if (content.error.code === 404) {
                return (React.createElement("section", null,
                    React.createElement(react_helmet_1.Helmet, null,
                        React.createElement("title", null, "Four Oh Four")),
                    React.createElement("h1", null, "Four Oh Four!"),
                    React.createElement("p", null, "You've gone into the unknown. Please try navigating back to the light.")));
            }
            return (React.createElement("section", null,
                React.createElement(react_helmet_1.Helmet, null,
                    React.createElement("title", null, "Error")),
                React.createElement("h1", null,
                    content.error.code,
                    " Error"),
                React.createElement("p", null, "There has been an error accessing the page you wanted. Please try again.")));
        }
        if (!content.data) {
            return null;
        }
        const attributes = content.data.attributes || {};
        return (React.createElement("article", null,
            React.createElement("header", null,
                React.createElement("h1", null, attributes.title),
                (attributes.date && attributes.date.toDateString) ?
                    (React.createElement("time", { dateTime: attributes.date.toDateString() }, attributes.date.toDateString()))
                    : null),
            React.createElement(markdown_1.Markdown, { source: content.data.body }),
            React.createElement("footer", null)));
    }
}
exports.Content = react_redux_1.connect((state) => ({
    content: state ? state.content : null
}))(ContentComponent);
