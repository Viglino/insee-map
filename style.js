import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import grid from './bin'
import param from './param'

// Fill color
const fill = new Style({
  fill: new Fill({ color: param.colorMin })
});

// Style function based on indicator
function styleFn(fg) {
  const s = grid.getSource().getSize();
  // Calculate indicator
  let fac=0, ind = 0;
  switch (param.indice) {
    case 'ind_c': {
      fg.get('features')[0].get('data').forEach((d) => {
        ind += d[param.indices[param.indice].index];
      });
      ind *= param.valmax / (s*s);
      break;
    }
    case 'ind_srf': {
      fg.get('features')[0].get('data').forEach((d) => {
        ind += d[param.indices[param.indice].index];
        fac += d[9];
      });
      ind *= param.valmax / fac / (s*s);
      break;
    }
  }
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