import "./style.css";

import "@babel/polyfill";
import React from "react";
import { createRoot } from "react-dom/client";
import { RevoGrid } from "../src/revogrid";
import { defineCustomElements } from "@revolist/revogrid/loader";
import MyReactComponent from "./component";
defineCustomElements();


function adapter(parent, props) {
  let wrapper;
  if (parent.childNodes.length) {
    wrapper = parent.childNodes[0];
    wrapper.remove();
  }
  
  wrapper = document.createElement("span");
  parent.appendChild(wrapper);
  
  const root = createRoot(wrapper);
  root.render(<MyReactComponent val={props.model[props.prop]} />);

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
