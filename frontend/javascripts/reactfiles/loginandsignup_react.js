class LineGap extends React.Component {
    render() {
        return(
            <div className="line-gap">
                <hr/>
            </div>
        );
    }
}
class Button extends React.Component{
    render(){
        return(
            <a href="#" onClick={this.props.onClick}>
                <div className={this.props.className}>
                    <span className="inline-text">
                        {this.props.value}
                    </span>
                </div>
            </a>            
        );
    }
}
class Username extends React.Component {
    render() {
        inputclass = this.props.class + "-child";
        id = (this.props.value === "login")? "username":"newusername";
        return (
            <div className={this.props.class}>
                <input 
                    className={inputclass}
                    type="text"
                    placeholder="username"
                    id = {id}
                />
            </div>
        );
    }
}
class Password extends React.Component {
    render() {
        inputclass = this.props.class + "-child";
        id = (this.props.value === "login")? "password":"newpassword";
        return (
            <div className={this.props.class}>
                <input 
                    className={inputclass}
                    type="password"
                    placeholder="password"
                    id = {id}
                />
            </div>
        );
    }
}
class Submit extends React.Component {
    render() {
        elemclass = this.props.class1 + " " + this.props.class2;
        inputclass = this.props.class1 + "-child " + this.props.class2 + "-child";
        return (
            <div className={elemclass}>
                <input 
                    className={inputclass}
                    type="submit"
                    placeholder="username"
                    value = {this.props.value}
                    onClick = {eval(this.props.value)}
                />
            </div>
        );
    }
}
function LoginSignupForm(props){
    myclass = props.formdata.childrenprops.elemclass;
    myval = props.formdata.childrenprops.value;
    myclass2 = props.formdata.childrenprops.submitclass;
    return(
        <div className={props.formdata.parentclass}>
            <Username class={myclass} value={myval}/>
            <Password class={myclass} value={myval}/>
            <Submit class1={myclass} class2={myclass2} value={myval}/>
        </div>
    );
};
function Box(props){
    return (
        <div
            className={props.class}
        >
            <LoginSignupForm
                    formdata={props.children.formdata}
            />
            <LineGap/>
            <Button
                className={props.children.button.class}
                value={props.children.button.value}
                onClick={(props.type === "login")? opensignupwindow:closesignupwindow}
            />
        </div>
    );
};

function ReactLoginSignup(props){
    let myprops = {
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
                value: (props.type === "login")? "Create New Account" : "Close"
            }
        }
    }
    var newelem = Box(myprops);
    var where = (props.type === "login") ? "home-body-right" : "signup-window";
    ReactDOM.render(
        newelem,
        document.getElementById(where)        
    );
}
