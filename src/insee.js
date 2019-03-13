import Ajax from 'ol-ext/util/Ajax'
import element from 'ol-ext/util/element'
import {transform} from 'ol/proj'
import 'ol-ext/source/InseeBin'

import param from './param'
import {view} from './map'
import map from './map'
import calculateGrid from './calculate'
import grid from './bin'

// WAIT
document.body.classList.add('loading');
// Progress bar
const progress = document.querySelectorAll('#loading .progress')[0];

// Indicator selector
const indSel = document.querySelectorAll('#select select')[0];
param.indices.forEach((e, i) => {
  element.create('OPTION', {
    html: e.title,
    value: i,
    parent: indSel
  })
});
indSel.addEventListener('change', e => {
  param.indice = param.indices[e.target.value];
  grid.changed();
});

/** Calculate clustered data
 * @param {*} res data to refine
 * @param {number} s size of the grid (10 or 100)
 * @return {*} refined data
 */
function cluster(res, s) {
  const km = {};
  res.forEach((row) => {
    const id = Math.floor(row[1]/s)+'_'+Math.floor(row[2]/s);
    const k = km[id];
    if (!k) {
      // Create new cell
      km[id] = row.slice();
      km[id][1] = Math.floor(row[1]/s);
      km[id][2] = Math.floor(row[2]/s)
      let coord = [ km[id][1]*s*100+s*50, km[id][2]*s*100+s*50];
      coord = transform(coord, 'EPSG:3035', view.getProjection());
      km[id][0] = coord;
    } else {
      // Add data to existing cell
      for (let j=3; j<row.length; j++) {
        k[j] += row[j];
      }
    }
  });
  const k2 = [];
  for (let i in km) k2.push(km[i]);
  return k2;
}

/** Load data
 */
function loadData () {
  // Percent load
  progress.style.width = Math.round(100 * data.current / data.rows.length) + '%';
  if (data.current < data.rows.length) {
    // Next 20000 features
    const max = Math.min (data.current+20000, data.rows.length);
    for (; data.current<max; data.current++) {
      const row = data.rows[data.current] = data.rows[data.current].split(',');
      for (let j=0; j<row.length; j++) {
        row[j] = parseFloat(row[j]);
      }
      // Coordinate of the center of the square
      let coord = [ row[0]*100+100, row[1]*100+100];
      coord = transform(coord, 'EPSG:3035', view.getProjection());
      row.unshift(coord);
    }
  }
  if (data.current < data.rows.length) {
    // Load next
    setTimeout(loadData, 100);
  } else {
    // Calculate cluster data at 10 and 100
    data.km = cluster(data.rows, 10);
    data.km10 = cluster(data.rows, 100);
    data.cols.unshift('coord');
    data.colNames = {};
    let i=0;
    data.cols.forEach(c => {
      data.colNames[c] = i++;
    });
    // Calculate on moveend
    calculateGrid();
    map.on('moveend', calculateGrid);
    // Finish
    document.body.classList.remove('loading');
    if (param.debug) console.log(data);
  }
}

const data = {
  current: 0,
  rows: [],
  cols: []
};

/* Load INSEE data file */
function loadFiles (current) {
  current = current || 0;
  Ajax.get({
    url: param.dataUrl+'insee-metro-'+current+'.csv',
    dataType: 'text/csv',
    success: (res) => {
      res = res.split('\n');
      if (res.length<100) {
        console.error ('File doesn\'t exists: '+param.dataUrl+'insee-metro-'+current+'.csv');
        return;
      }
      progress.style.width = Math.round(10 * current) + '%';
      if (current===0) data.cols = res.shift().split(',');
      if (!res[res.length-1]) res.pop();
      data.rows = data.rows.concat(res);
      console.log('LOADING: ', data.rows.length);
      current++;
      if (current < 10) {
        // Load naxt
        loadFiles(current);
      } else {
        document.querySelectorAll('#loading p span')[0].textContent = 'Traitement des données';
        // Start loading
        loadData();
      }
    },
    error: (r) => {
      // oops
      console.error(r);
    }
  });
}
loadFiles();

/** Get value
 * @param {Array<number>} row the row to get data
 * @param {string} att attribute name
 */
const getVal = data.val = function(row, att) {
  return row[data.colNames[att]];
}

/** Calculate indice
 * @param {string} what 
 * @param {Array<number>} row
 * @param {string} att
 */ 
data.indice = function (what, row, att) {
  var d = (typeof(att)==='number' ? att : getVal(row, att));
  let val, pc, info;
  switch (what) {
    case 'km': {
      val = Math.round(d * param.surfkm);
      info = 'hab/km²';
      break;
    }
    case 'srf': {
      val = Math.round(d / getVal(row,'ind_r'));
      info = '€/hab';
      break;
    }
    case 'srfm': {
      val = Math.round(d / getVal(row,'men'));
      info = '€/men';
      break;
    }
    case 'hab': {
      val = Math.round(d * getVal(row,'ind_c') / getVal(row,'ind_r') * param.surfkm);
      pc = Math.round(d / getVal(row,'ind_r') * 1000)/10;
      info = 'hab/km²';
      break;
    }
    case 'men': {
      val = Math.round(d * getVal(row,'ind_c') / getVal(row,'ind_r') * param.surfkm);
      if (att !== 'men') {
        pc = Math.round(d / getVal(row,'men') * 1000)/10;
      }
      info = 'men/km²';
      break;
    }
  }
  return { val: val, pc: pc, info: info };
}

export default data
