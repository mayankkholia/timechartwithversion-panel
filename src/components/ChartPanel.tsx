import React from 'react';
import { PanelData, PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { PanelDataErrorView } from '@grafana/runtime';
import TimeChartWithVersion from './TimeChartWithVersion.jsx';
import {groupseries,combine_grouped_data} from '../utils.js'

interface Props extends PanelProps<SimpleOptions> {}

const parse_data = (data: PanelData, options: SimpleOptions) => {
  let grouped_data = groupseries(data.series, options.version);
  grouped_data = combine_grouped_data(grouped_data);
  return {
    from_ts: data.timeRange.from,
    to_ts: data.timeRange.to,
    series: grouped_data,
  };
};

export const ChartPanel: React.FC<Props> = ({ options, data, width, height, fieldConfig, id }) => {
  if (data.series.length === 0) {
    return <PanelDataErrorView fieldConfig={fieldConfig} panelId={id} data={data} needsStringField />;
  }
  return <TimeChartWithVersion data={parse_data(data, options)} height={height} width={width} />;
};
