function getRandomColor() {
    let r, g, b;
    
    // Ensure the color is bright enough (values should not be too dark).
    // We'll set a minimum value for R, G, and B to ensure it's bright enough for dark backgrounds.
    r = Math.floor(Math.random() * 128) + 128; 
    g = Math.floor(Math.random() * 128) + 128;
    b = Math.floor(Math.random() * 128) + 128;

    return `rgb(${r}, ${g}, ${b})`;
}

export const generateRandomColorArray = (n)=> {
    let colors = [];
    for (let i = 0; i < n; i++) {
        colors.push(getRandomColor());
    }
    return colors;
}

const filter_by_key = (object_to_filter, key_to_filter) => {
  const { [key_to_filter]: removed, ...filteredObject } = object_to_filter;
  return filteredObject;
};

export const combine_grouped_data = (grouped_data) => {
  let combined_data = [];
  for (const series of grouped_data) {
    for (let k = 0; k < series.length; k++) {
      let raw = series[k].fields;
      const field_names = series[0].fields.map((field) => field.name);
      for (let i = 0; i < series[k].fields[0].values.length; i++) {
        let temp_dict = {};
        for (let j = 0; j < field_names.length; j++) {
          temp_dict['labels'] = raw[j].labels;
          temp_dict[raw[j].name] = raw[j].values[i];
        }
        combined_data.push(temp_dict);
      }
    }
  }
  return combined_data;
};

export const groupseries = (series, version_label) => {
  const grouped = {};
  for (let series_idx = 0; series_idx < series.length; series_idx++) {
    let label = Object.values(filter_by_key(series[series_idx].fields[1].labels, version_label)).sort().join('|');
    if (label in grouped) {
      grouped[label].push(series[series_idx]);
    } else {
      grouped[label] = [series[series_idx]];
    }
  }
  return Object.values(grouped);
};
