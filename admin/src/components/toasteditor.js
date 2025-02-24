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

  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setHTML(props.initialValue || "");
    }
  }, [props.initialValue]);

  return (
    <Editor
      {...props}
      ref={editorRef}
      previewStyle="vertical"
      height="400px"
      initialEditType="wysiwyg"
      initialValue={props.initialValue || " "}
      useCommandShortcut={true}
      onChange={handleChange}
      hideModeSwitch={true}
    />
  );
};

export default ToastEditor;
