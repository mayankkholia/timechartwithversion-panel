import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { PanelDataErrorView } from '@grafana/runtime';
import TimeChartWithVersion from './TimeChartWithVersion.jsx';
interface Props extends PanelProps<SimpleOptions> {}

const parse_data = (data,options) => {
  console.log(data,'data')
  console.log(options,'options')
  const result = [];
  const field_names = data.series[0].fields.map((field) => field.name);
  for (let k = 0 ; k<data.series.length;k++){
    let raw = data.series[k].fields;
    for (let i = 0; i < data.series[k].fields[0].values.length; i++) {
      let temp_dict = {}
      for(let j = 0; j < field_names.length; j++){
          temp_dict["labels"] = raw[j].labels
          temp_dict[raw[j].name] = raw[j].values[i];
      }
      result.push(temp_dict);
    }
  }
  console.log(result,'result')
  return {
    from_ts: data.timeRange.from,
    to_ts: data.timeRange.to,
    series: result,
  };
};

export const ChartPanel: React.FC<Props> = ({ options, data, width, height, fieldConfig, id }) => {
  if (data.series.length === 0) {
    return <PanelDataErrorView fieldConfig={fieldConfig} panelId={id} data={data} needsStringField />;
  }
  return <TimeChartWithVersion data={parse_data(data,options)} height={height} width={width} />;
};
