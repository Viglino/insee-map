import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import data from './insee'
import param from './param'

/* Force fullpage reload on module changes 
 * to prevent side effects on the map.
 */
if (module.hot) {
  module.hot.accept(function () {
    location.reload();
  });
}
/* end of hot reload */

// Fill color
const fill = new Style({
  fill: new Fill({ color: param.colorMin })
});

// Style function based on indicator
function styleFn(fg, res) {
  // Calculate indicator
  const row = fg.get('features')[0].get('data');
  let ind = (data.indice(param.indice.what, row, param.indice.att)).val;
  ind = (ind-param.indice.min) / (param.indice.max-param.indice.min);
  ind *= param.indice.fac * Math.max(1, res/param.indice.res);

  // Set color
  const color = [];
  for (let i=0; i<3; i++){
    color.push(param.colorMax[i]*ind + param.colorMin[i]*(1-ind));
  }
  color.push(.7);
  fill.getFill().setColor(color);
  return fill;
}

export default styleFn
