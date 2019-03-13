import Select from 'ol/interaction/Select'
import element from 'ol-ext/util/element'
import {click} from 'ol/events/condition'
import map from './map'
import param from './param';
import data from './insee'

// Show panel on click
const panel = document.getElementById('panel');
panel.addEventListener('click', e => {
  document.body.classList.toggle('panel');
});

// Selection interaction
const select = new Select({
  condition: click,
});
map.addInteraction(select);

// Show info on select
select.on('select', (e) => {
  element.setHTML(panel,'');
  // Something selected
  if (e.selected.length) {
    document.body.classList.add('panel');
    map.updateSize();
    // Get data for the current feature
    const f = e.selected[0].get('features');
    const p = f[0].get('data');
    // Display info
    const addLine = function(t, att, what) {
      let v = data.indice(what, p, att);
      element.create('LI', {
        html: '<b>'+t+':</b> '+v.val.toLocaleString()+' '+v.info+(v.pc?' ('+v.pc+'%)':''),
        parent: panel
      }); 
    }
    element.create('LI', {
      html: '<b>Population:</b> '+data.val(p,'ind_c')+' hab.',
      parent: panel
    }); 
    addLine('Population', 'ind_c', 'km');
    addLine('Revenus', 'ind_srf', 'srf');
    addLine('Revenus', 'ind_srf', 'srfm');
    addLine('Ménages', 'men', 'men');
    addLine('Bas revenu', 'men_basr', 'men');
    addLine('Proriétaire', 'men_prop', 'men');
    addLine('Hab. collectif', 'men_coll', 'men');
    addLine('Personne seule', 'men_1ind', 'men');
    if (/s2.\csv$/.test(param.url)) {
      const a15 = data.val(p,'ind_age1') + data.val(p,'ind_age2') + data.val(p,'ind_age3') + data.val(p,'ind_age4');
      addLine('15 ans et -', a15, 'hab');
      addLine('15-25 ans', data.val(p,'ind_r' - data.val(p,'ind_age6') - a15, 'hab'));
    } else {
      addLine('15 ans et -', 'ind_a15', 'hab');
      addLine('15-25 ans', 'ind_a15_25', 'hab');
    }
    addLine('25-65 ans', data.val(p,'ind_age6') - data.val(p,'ind_age7'), 'hab');
    addLine('65 ans et +', 'ind_age7', 'hab');
    if (param.debug) {
      for (var i=3; i<p.length; i++) {
        element.create('LI', {
          html: '<b>'+data.cols[i]+':</b> '+p[i],
          parent: panel
        }); 
      }
    }
  } else {
    document.body.classList.remove('panel');
    map.updateSize();
  }
});
