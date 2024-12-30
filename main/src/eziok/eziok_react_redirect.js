import React, { Component } from "react";

class eziok_redirect extends Component {
  componentDidMount() {
    // 인증결과 확인
    const script = document.createElement("script");
    const resultData = document.createTextNode(
      "redirectData = new URLSearchParams(location.search).get('data');" +
        "try {" +
        "redirectData = JSON.parse(redirectData);" +
        "document.querySelector('#result').value = JSON.stringify(redirectData, null, 4);" +
        "} catch (error) {" +
        "document.querySelector('#result').value = redirectData;" +
        "}"
    );

    script.appendChild(resultData);
    document.body.appendChild(script);
  }

  render() {
    return (
      <main>
        <div>
          <div>
            <textarea id="result" rows="20"></textarea>
          </div>
        </div>
      </main>
    );
  }
}

export default eziok_redirect;
