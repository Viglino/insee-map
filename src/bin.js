/** Create bin source
 */
import Vector from 'ol/layer/Vector'
import SourceVector from 'ol/source/Vector'
import InseeBin from 'ol-ext/source/InseeBin'
import style from './style'

import map from './map'

// Vector source that contains the insee data
const source = new SourceVector();

// Bin source to collect the data
const sourceBin = new InseeBin({ 
  source: source,
  listenChange: false,
  size: 200,
  attributions: 'statistiques <a href="https://www.insee.fr/fr/statistiques/2520034" target="_new">&copy; Insee</a>'
});

const grid = new Vector({ 
  renderMode: 'image',
  source: sourceBin,
  style: style
});
map.addLayer(grid);

export {source}
export {sourceBin}
export default grid;
