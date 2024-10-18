import Map from 'ol/Map.js';
import View from 'ol/View.js';
import LayerTile from 'ol/layer/Tile';
import SourceXYZ from 'ol/source/XYZ';
import Filter from 'ol-ext/filter/Colorize'
import {defaults as defaultControls, Attribution} from 'ol/control.js';

const attribution = new Attribution({
  collapsible: false
});

// Map
const map = new Map({
  target: 'map',
  controls: defaultControls({
    altShiftDragRotate: false, 
    pinchRotate: false, 
    attribution: false }).extend([attribution]),
  view: new View({
    zoom: 8,
    center: [166326, 5992663]
  })
});
const view = map.getView();

// Layers
import Geoportail from 'ol-ext/layer/Geoportail'
const ign = new Geoportail('GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2')

const filter = new Filter({ operation:'grayscale' });
ign.addFilter(filter);

// Background color for filter
ign.on('precompose', (e) => {
  const ctx = e.context;
	const canvas = ctx.canvas;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,canvas.width,canvas.height);  
});
map.addLayer(ign);

// Search control
import Search from 'ol-ext/control/SearchBAN'
const search = new Search ({ placeholder: 'rechercher...' });
map.addControl (search);
search.on('select', (e) => {
  view.animate({
    center: e.coordinate
  });
});

// Permalink control
import perma from 'ol-ext/control/Permalink'
import param from './param';
map.addControl (new perma());

if (param.debug) {
  console.log(map);
}

export {view}
export default map