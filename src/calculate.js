import {source} from './bin'
import {sourceBin} from './bin'
import map from './map'
import {buffer}  from 'ol/extent'
import {containsCoordinate}  from 'ol/extent'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import param from './param'
import data from './insee'

/**
 * Calculate Grid data on move
 * @param {*} data 
 */
function calculateGrid() {
  source.clear(true);
  const zoom = map.getView().getZoom();
  if (zoom>12) {
    sourceBin.setSize(200);
    param.valmax = 70;
  } else {
    var fac = Math.pow(2,Math.round((12-zoom)/1.1));
    param.valmax = 70 * fac;
    sourceBin.setSize(1000*fac);
  }
  // console.log('calculating')
  const s = sourceBin.getSize();
  const extent = buffer(map.getView().calculateExtent(), s);
  const rows = s >= 10000 ? data.km10 : s >= 1000 ? data.km : data.rows;
  param.surfkm = 1000*1000/(s*s);
  rows.forEach (r => {
    const coord = r[0];
    if (containsCoordinate(extent, coord)) {
      const bin = sourceBin.getBinAt(coord);
      if (bin) {
        const d = bin.get('features')[0].get('data');
        for (let i=3; i<d.length; i++) d[i] += r[i];
      } else {
        const f = new Feature(new Point(coord));
        f.set('data', r.slice());
        source.addFeature(f);
      }
    }
  });
  // console.log('FEATURES: ', source.getFeatures().length);
}

export default calculateGrid