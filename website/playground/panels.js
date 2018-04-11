import CodeMirror from "codemirror";
import React from "react";

class CodeMirrorPanel extends React.Component {
  constructor() {
    super();
    this._textareaRef = React.createRef();
    this._codeMirror = null;
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { mode, rulerColumn: column, rulerColor: color } = this.props;
    this._codeMirror = CodeMirror.fromTextArea(
      this._textareaRef.current,
      Object.assign({ mode, rulers: [{ column, color }] }, this.props.options)
    );
    this._codeMirror.on("change", this.handleChange);
    this._codeMirror.setValue(this.props.value || "");
  }

  componentWillUnmount() {
    this._codeMirror && this._codeMirror.toTextArea();
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== this._codeMirror.getValue()) {
      this._codeMirror.setValue(this.props.value);
    }
    if (this.props.mode !== prevProps.mode) {
      this._codeMirror.setOption("mode", this.props.mode);
    }
    if (this.props.rulerColumn !== prevProps.rulerColumn) {
      const { rulerColumn: column, rulerColor: color } = this.props;
      this._codeMirror.setOption("rulers", [{ column, color }]);
    }
  }

  handleChange(doc, change) {
    if (change.origin !== "setValue") {
      this.props.onChange(doc.getValue());
    }
  }

  render() {
    return (
      <div className="editor input">
        <textarea ref={this._textareaRef} />
      </div>
    );
  }
}

export function InputPanel({ mode, rulerColumn, value, onChange }) {
  return (
    <CodeMirrorPanel
      options={{
        lineNumbers: true,
        keyMap: "sublime",
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        tabWidth: 2
      }}
      mode={mode}
      rulerColumn={rulerColumn}
      rulerColor="#eeeeee"
      value={value}
      onChange={onChange}
    />
  );
}

export function OutputPanel({ mode, rulerColumn, value }) {
  return (
    <CodeMirrorPanel
      options={{
        readOnly: true,
        lineNumbers: true
      }}
      mode={mode}
      rulerColumn={rulerColumn}
      rulerColor="#444444"
      value={value}
    />
  );
}

export function DebugPanel({ value }) {
  return (
    <CodeMirrorPanel
      options={{ readOnly: true, lineNumbers: false, mode: "jsx" }}
      value={value}
    />
  );
}
