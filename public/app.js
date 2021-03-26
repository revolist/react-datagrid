import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { RevoGrid } from "@revolist/revogrid-react";
import MyReactComponent from "./component";
import "./style.css";
import { defineCustomElements } from "@revolist/revogrid/custom-element";
defineCustomElements();
function adapter(parent, props) {
  let wrapper;
  if (parent.childNodes.length) {
    wrapper = parent.childNodes[0];
    ReactDOM.unmountComponentAtNode(wrapper);
  } else {
    wrapper = document.createElement("span");
    parent.appendChild(wrapper);
  }
  ReactDOM.render(<MyReactComponent val={props.model[props.prop]} />, wrapper);
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          prop: "name",
          name: "First",
          cellTemplate(h, p) {
            return h("span", {
              ref: (el) => adapter(el, p)
            });
          }
        },
        {
          prop: "details",
          name: "Second"
        }
      ],
      source: [
        {
          name: "1",
          details: "Item 1"
        },
        {
          name: "2",
          details: "Item 2"
        }
      ]
    };
  }

  render() {
    return (
        <RevoGrid
        theme="material"
        columns={this.state.columns}
        source={this.state.source}
      />
    );
  }
}
