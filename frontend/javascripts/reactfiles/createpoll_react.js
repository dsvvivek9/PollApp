class LineGap extends React.Component {
    render() {
        return(
            <div className="line-gap">
                <hr/>
            </div>
        );
    }
}
class PollTitle extends React.Component {
    render() {
        return(
            <div className="createpoll-title">
                <input
                    className="createpoll-title-input"
                    type="text"
                    id="polltitle"
                    placeholder="what is your poll title?"
                >
                </input>
            </div>
        );
    }
}
function OptionElem(){
    return(
        <input
            className="createpoll-options-elements"
            onClick={eval("addOrRemoveOptions")}
            placeholder="Type here options you want to add!"
        >
        </input>
    );
}
class PollOptions extends React.Component {
    render() {
        return(
            <div className="createpoll-options" id="createpoll-options">
                <OptionElem/>
                <OptionElem/>
            </div>
        );
    }
}
class Buttons extends React.Component {
    render() {
        return(
            <div className="createpoll-window-buttons">
                <span
                    className="createpoll-discard-changes"
                    onClick={eval("discardChanges")}
                >
                    Discard
                </span>
                <span
                    className="createpoll-submit-button-text"
                    onClick={eval("createNewPoll")}
                >
                    Create Poll
                </span>
            </div>
        );
    }
}
function CreatePollBox(){
    return(
        <div>
            <PollTitle/>
            <LineGap/>
            <PollOptions/>
            <Buttons/>
        </div>
    );
};
function createpollcall(){
    let newelem = CreatePollBox();
    let createWindowBox = document.getElementById("createpoll-main-body");
    ReactDOM.render(
        newelem,
        createWindowBox
    );
}