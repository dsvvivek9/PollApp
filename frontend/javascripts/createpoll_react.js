var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LineGap = function (_React$Component) {
    _inherits(LineGap, _React$Component);

    function LineGap() {
        _classCallCheck(this, LineGap);

        return _possibleConstructorReturn(this, (LineGap.__proto__ || Object.getPrototypeOf(LineGap)).apply(this, arguments));
    }

    _createClass(LineGap, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "line-gap" },
                React.createElement("hr", null)
            );
        }
    }]);

    return LineGap;
}(React.Component);

var PollTitle = function (_React$Component2) {
    _inherits(PollTitle, _React$Component2);

    function PollTitle() {
        _classCallCheck(this, PollTitle);

        return _possibleConstructorReturn(this, (PollTitle.__proto__ || Object.getPrototypeOf(PollTitle)).apply(this, arguments));
    }

    _createClass(PollTitle, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "createpoll-title" },
                React.createElement("input", {
                    className: "createpoll-title-input",
                    type: "text",
                    id: "polltitle",
                    placeholder: "what is your poll title?"
                })
            );
        }
    }]);

    return PollTitle;
}(React.Component);

function OptionElem() {
    return React.createElement("input", {
        className: "createpoll-options-elements",
        onClick: eval("addOrRemoveOptions"),
        placeholder: "Type here options you want to add!"
    });
}

var PollOptions = function (_React$Component3) {
    _inherits(PollOptions, _React$Component3);

    function PollOptions() {
        _classCallCheck(this, PollOptions);

        return _possibleConstructorReturn(this, (PollOptions.__proto__ || Object.getPrototypeOf(PollOptions)).apply(this, arguments));
    }

    _createClass(PollOptions, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "createpoll-options", id: "createpoll-options" },
                React.createElement(OptionElem, null),
                React.createElement(OptionElem, null)
            );
        }
    }]);

    return PollOptions;
}(React.Component);

var Buttons = function (_React$Component4) {
    _inherits(Buttons, _React$Component4);

    function Buttons() {
        _classCallCheck(this, Buttons);

        return _possibleConstructorReturn(this, (Buttons.__proto__ || Object.getPrototypeOf(Buttons)).apply(this, arguments));
    }

    _createClass(Buttons, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "createpoll-window-buttons" },
                React.createElement(
                    "span",
                    {
                        className: "createpoll-discard-changes",
                        onClick: eval("discardChanges")
                    },
                    "Discard"
                ),
                React.createElement(
                    "span",
                    {
                        className: "createpoll-submit-button-text",
                        onClick: eval("createNewPoll")
                    },
                    "Create Poll"
                )
            );
        }
    }]);

    return Buttons;
}(React.Component);

function CreatePollBox() {
    return React.createElement(
        "div",
        null,
        React.createElement(PollTitle, null),
        React.createElement(LineGap, null),
        React.createElement(PollOptions, null),
        React.createElement(Buttons, null)
    );
};
function createpollcall() {
    var newelem = CreatePollBox();
    var createWindowBox = document.getElementById("createpoll-main-body");
    ReactDOM.render(newelem, createWindowBox);
}