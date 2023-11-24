import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      price_stock1: 'float',
      price_stock2: 'float',
      ratio: 'float',
      upper_bound: 'float',
      lower_bound: 'float',
      timestamp: 'date',
      trigger_alert: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);

      // create attributes object containing all configurations for graph
      // the attribute values are derived from schema object
      const attributes = {
        "view": 'y_line',
        "row-pivots": '["timestamp"]',
        "columns": '["ratio", "lower_bound", "upper_bound", "trigger_alert"]',
        "aggregates": JSON.stringify({
          price_stock1: 'avg',
          price_stock2: 'avg',
          ratio: 'avg',
          upper_bound: 'avg',
          lower_bound: 'avg',
          timestamp: 'distinct count',
          trigger_alert: 'avg',
        })
      }
      Object.entries(attributes).forEach((entry)=> {
        let [prop, val] = entry
        elem.setAttribute(prop, val)
      })
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ] as unknown as TableData);
    }
  }
}

export default Graph;
