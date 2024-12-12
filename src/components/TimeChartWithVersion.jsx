import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

import { generateRandomColorArray } from 'utils';

const TimeChartWithVersion = ({ data, height, width }) => {
  const series = data.series;

  const svgRef = useRef();
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: {} });
  const from_ts = new Date(data.from_ts);
  const to_ts = new Date(data.to_ts);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width1 = width - margin.left - margin.right;
    const height1 = height - margin.top - margin.bottom;
    
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(series[0], (d) => new Date(d.Time)))
      .range([0, width1]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(series[0], (d) => d.Value) - 5, d3.max(series[0], (d) => d.Value) + 5])
      .range([height1, 0]);

    svg.selectAll('*').remove(); // Clear previous content
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const gX = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${height - margin.top})`)
      .call(d3.axisBottom(xScale).tickFormat(timeFormat).ticks(tickSize, tickInterval));

    const gY = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`).call(d3.axisLeft(yScale));

    const colors = generateRandomColorArray(series.length);

    // Loop through each series and create separate circles for each
    series.forEach((s, i) => {
      const group = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`); // Create a group for each series to separate them

      let line = d3
        .line()
        .x((d) => xScale(new Date(d.Time)))
        .y((d) => yScale(d.Value));
      group
        .append('g')
        .append('path')
        .datum(series[i])
        .attr('fill', 'none')
        .attr('stroke', colors[i])
        .attr('stroke-width', 1.5)
        .attr('d', line);
      group
        .selectAll('circle')
        .data(s)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(new Date(d.Time)))
        .attr('cy', (d) => yScale(d.Value))
        .attr('r', 4)
        .attr('fill', colors[i]) // Use the color for this series
        .on('mouseover', (event, d) => {
          setTooltip({
            visible: true,
            x: event.layerX + 10,
            y: event.layerY + 10,
            data: d,
          });
        })
        .on('mouseout', () => {
          setTooltip({ visible: false, x: 0, y: 0, data: {} });
        });
    });

    return () => {
      svg.selectAll('*').remove();
    };
  }, [data, height, width]);

  return (
    <div>
      <svg ref={svgRef} width={width} height={height}></svg>
      {tooltip.visible && (
        <div
          style={{
            position: 'absolute',
            top: tooltip.y,
            left: tooltip.x,
            background: 'black',
            border: '1px solid black',
            padding: '5px',
            pointerEvents: 'none',
          }}
        >
          <div>Labels: {JSON.stringify(tooltip.data.labels)}</div>
          <div>Time: {new Date(tooltip.data.Time).toISOString()}</div>
        </div>
      )}
    </div>
  );
};

export default TimeChartWithVersion;
