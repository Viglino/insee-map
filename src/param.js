/** App parameters
 */
const param = {
  dataUrl: '../data/',
  debug: false,
  indices: [
    { att: 'ind_c', title: 'Population', what:'km', max: 110000, min: 0, fac:8, res:100 },
    { att: 'ind_srf', title: 'Revenu €', what:'srf', max: 35000, min: 14000, fac:5, res:1200 }
  ],
  indice: { att: 'ind_c', title: 'Population', what:'km', max: 110000, min: 0, fac:8, res:100 },
  colorMin: [255,255,192],
  colorMax: [192,0,0]
}

if (param.debug) {
  console.log(param);
}

export default param
