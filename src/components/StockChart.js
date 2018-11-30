import React from 'react';
import {
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  YAxis,
  LineSeries,
  FlexibleWidthXYPlot,
} from 'react-vis';
export default class Chart extends React.Component {
  render() {
    const {data, isUp} = this.props;

    return (
      <FlexibleWidthXYPlot
        xType="ordinal"
        height={250}>
        <VerticalGridLines tickValues={this.calculateTicks(data)} />
        <HorizontalGridLines />
        <XAxis 
          title="Time"
          tickValues={this.calculateTicks(data)}
          style={{
            // text: {stroke: 'none', display: 'none'}
          }} />
        <YAxis title="Stock Price" />
        <LineSeries 
          data={data}
          style={{stroke: isUp ? 'green' : 'red'}}
          />
      </FlexibleWidthXYPlot>
    )
  }

  calculateTicks = (data) => {
    const tick = Math.floor(data.length / 10);
    const tickValues = [];
    for (var j = 0; j < data.length; j += tick) {
      tickValues.push(data[j].x);
    }

    return tickValues;
  }
}