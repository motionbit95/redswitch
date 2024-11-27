import React, { useEffect, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
const ToastEditor = ({ onChange, ...props }) => {
  const editorRef = useRef();

  const handleChange = () => {
    const editorInstance = editorRef.current.getInstance();
    const html = editorInstance.getHTML();
    // console.log(html);
    onChange(html);
  };

  return (
    <Editor
      {...props}
      ref={editorRef}
      previewStyle="vertical"
      height="400px"
      initialEditType="wysiwyg"
      initalValue={props.initialValue || " "}
      useCommandShortcut={true}
      onChange={handleChange}
      hideModeSwitch={true}
    />
  );
};

export default ToastEditor;
