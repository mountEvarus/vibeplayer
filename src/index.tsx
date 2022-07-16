import * as React from "react"

import * as ReactDom from "react-dom"


ReactDom.render(<p>Test!</p>, document.getElementById("root"))

if (module.hot) {
  module.hot.accept()
}
