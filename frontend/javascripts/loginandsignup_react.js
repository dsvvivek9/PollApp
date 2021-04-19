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

var Button = function (_React$Component2) {
    _inherits(Button, _React$Component2);

    function Button() {
        _classCallCheck(this, Button);

        return _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).apply(this, arguments));
    }

    _createClass(Button, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "a",
                { href: "#", onClick: this.props.onClick },
                React.createElement(
                    "div",
                    { className: this.props.className },
                    React.createElement(
                        "span",
                        { className: "inline-text" },
                        this.props.value
                    )
                )
            );
        }
    }]);

    return Button;
}(React.Component);

var Username = function (_React$Component3) {
    _inherits(Username, _React$Component3);

    function Username() {
        _classCallCheck(this, Username);

        return _possibleConstructorReturn(this, (Username.__proto__ || Object.getPrototypeOf(Username)).apply(this, arguments));
    }

    _createClass(Username, [{
        key: "render",
        value: function render() {
            inputclass = this.props.class + "-child";
            id = this.props.value === "login" ? "username" : "newusername";
            return React.createElement(
                "div",
                { className: this.props.class },
                React.createElement("input", {
                    className: inputclass,
                    type: "text",
                    placeholder: "username",
                    id: id
                })
            );
        }
    }]);

    return Username;
}(React.Component);

var Password = function (_React$Component4) {
    _inherits(Password, _React$Component4);

    function Password() {
        _classCallCheck(this, Password);

        return _possibleConstructorReturn(this, (Password.__proto__ || Object.getPrototypeOf(Password)).apply(this, arguments));
    }

    _createClass(Password, [{
        key: "render",
        value: function render() {
            inputclass = this.props.class + "-child";
            id = this.props.value === "login" ? "password" : "newpassword";
            return React.createElement(
                "div",
                { className: this.props.class },
                React.createElement("input", {
                    className: inputclass,
                    type: "password",
                    placeholder: "password",
                    id: id
                })
            );
        }
    }]);

    return Password;
}(React.Component);

var Submit = function (_React$Component5) {
    _inherits(Submit, _React$Component5);

    function Submit() {
        _classCallCheck(this, Submit);

        return _possibleConstructorReturn(this, (Submit.__proto__ || Object.getPrototypeOf(Submit)).apply(this, arguments));
    }

    _createClass(Submit, [{
        key: "render",
        value: function render() {
            elemclass = this.props.class1 + " " + this.props.class2;
            inputclass = this.props.class1 + "-child " + this.props.class2 + "-child";
            return React.createElement(
                "div",
                { className: elemclass },
                React.createElement("input", {
                    className: inputclass,
                    type: "submit",
                    placeholder: "username",
                    value: this.props.value,
                    onClick: eval(this.props.value)
                })
            );
        }
    }]);

    return Submit;
}(React.Component);

function LoginSignupForm(props) {
    myclass = props.formdata.childrenprops.elemclass;
    myval = props.formdata.childrenprops.value;
    myclass2 = props.formdata.childrenprops.submitclass;
    return React.createElement(
        "div",
        { className: props.formdata.parentclass },
        React.createElement(Username, { "class": myclass, value: myval }),
        React.createElement(Password, { "class": myclass, value: myval }),
        React.createElement(Submit, { class1: myclass, class2: myclass2, value: myval })
    );
};
function Box(props) {
    return React.createElement(
        "div",
        {
            className: props.class
        },
        React.createElement(LoginSignupForm, {
            formdata: props.children.formdata
        }),
        React.createElement(LineGap, null),
        React.createElement(Button, {
            className: props.children.button.class,
            value: props.children.button.value,
            onClick: props.type === "login" ? opensignupwindow : closesignupwindow
        })
    );
};

function ReactLoginSignup(props) {
    var myprops = {
        class: props.type + "-window-box",
        type: props.type,
        children: {
            formdata: {
                parentclass: props.type + "-form",
                childrenprops: {
                    elemclass: props.type + "-form-elements",
                    submitclass: "submit-button",
                    value: props.type
                }
            },
            button: {
                class: "my-action-button",
                value: props.type === "login" ? "Create New Account" : "Close"
            }
        }
    };
    var newelem = Box(myprops);
    var where = props.type === "login" ? "home-body-right" : "signup-window";
    ReactDOM.render(newelem, document.getElementById(where));
}