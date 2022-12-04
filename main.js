import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import {Fill, Stroke, Style} from 'ol/style';
import {Draw, Modify, Snap} from 'ol/interaction';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {get,transform} from 'ol/proj';
import {OSM, Vector as VectorSource} from 'ol/source';




const style = new Style({
    fill: new Fill({
      color: '#eeeeee',
    }),
});
const raster = new TileLayer({
    source: new OSM(),
  });
  
const source = new VectorSource();
const vector = new VectorLayer({
    source: source,
    style: {
      'fill-color': 'rgba(0,255,0,0.3)',
      'stroke-color': '#0000FF',
      'stroke-width': 2,
      'circle-radius': 7,
      'circle-fill-color': '#0000FF',
    },
  });

  const vectorLayer = new VectorLayer({
    background: '#000000', // for background color
    source: new VectorSource({
      url: 'assets/geojson.json',
      format: new GeoJSON(),
    }),
    style: function (feature) {
      const color = feature.get('COLOR') || '#90EE90';
      style.getFill().setColor(color);
      return style;
    },
  });

// -----added 
const extent = get('EPSG:3857').getExtent().slice();
extent[0] += extent[0];
extent[2] += extent[2];
//-----

  const map = new Map({
    layers: [vectorLayer,vector],
    target: 'map',
    view: new View({
      center: transform([90.19530825000014,24.988718323000086], 'EPSG:4326', 'EPSG:3857'),
      zoom:16,
    }),
  });

  const modify = new Modify({source: source});
  map.addInteraction(modify);
  let draw, snap; // global so we can remove them later
  const typeSelect = document.getElementById('type');
  
  function addInteractions() {
    draw = new Draw({
      source: source,
      type: typeSelect.value,
    });
    map.addInteraction(draw);
    snap = new Snap({source: source});
    map.addInteraction(snap);
  }
  typeSelect.onchange = function () {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteractions();
  };
  
  addInteractions();







