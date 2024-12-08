// src/LineChart.js

import React, { useEffect, useRef, useState } from 'react';
import { Alert, useTheme2 } from '@grafana/ui';
import * as d3 from 'd3';

const TimeChartWithVersion = ({ data, height, width }) => {
  const series = data.series
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: {} });

  const theme = useTheme2();
  const palette = theme.visualization.palette
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width1 = width - margin.left - margin.right;
    const height1 = height - margin.top - margin.bottom;
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(series, (d) => new Date(d.Time)))
      .range([0, width1]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(series, (d) => d.Value) - 5, d3.max(series, (d) => d.Value) + 5])
      .range([height1, 0]);

    // const line = d3
    //   .line()
    //   .x((d) => xScale(new Date(d.Time)))
    //   .y((d) => yScale(d.Value));

    svg.selectAll('*').remove(); // Clear previous content

    // svg
    //   .append('g')
    //   .attr('transform', `translate(${margin.left},${margin.top})`)
    //   .append('path')
    //   .datum(series)
    //   .attr('fill', 'none')
    //   .attr('stroke', 'steelblue')
    //   .attr('stroke-width', 1.5)
    //   .attr('d', line);

    const gX = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${height - margin.top})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%H:%M:%S')).ticks(d3.timeMin, 1));

    const gY = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`).call(d3.axisLeft(yScale));
    
    svg
      .selectAll('circle')
      .data(series)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(new Date(d.Time)) + margin.left)
      .attr('cy', (d) => yScale(d.Value) + margin.top)
      .attr('r', 4)
      .attr('fill', 'steelblue')
      .on('mouseover', (event, d) => {
        setTooltip({
          visible: true,
          x: event.pageX,
          y: event.pageY,
          data: d,
        });
      })
      .on('mouseout', () => {
        setTooltip({ visible: false, x: 0, y: 0, data: {} });
      });

    return () => {
      svg.selectAll('*').remove();
    };
  }, [data,height,width]);

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
          <div>Time: {(new Date(tooltip.data.Time)).toISOString()}</div>
        </div>
      )}
    </div>
  );
};

export default TimeChartWithVersion;
