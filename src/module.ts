import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { ChartPanel } from './components/ChartPanel';

export const plugin = new PanelPlugin<SimpleOptions>(ChartPanel).setPanelOptions((builder) => {
  return builder
    .addTextInput({
      path: 'version',
      name: 'Version Label',
      description: 'Label that contains label value',
      defaultValue: 'version',
    });
});
