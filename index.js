/** Main index
 * Test ol-ext extension with parcel bundler
 */
import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'

/* Force fullpage reload on module changes 
 * to prevent side effects on the map.
 */
if (module.hot) {
  module.hot.accept(function () {
    location.reload();
  });
}
/* end of hot reload */

import './src/map'

import './src/insee'
import './src/select'