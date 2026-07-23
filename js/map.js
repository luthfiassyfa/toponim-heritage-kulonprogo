// =====================================================
// MAP
// =====================================================

var map = L.map("map",{
    zoomControl:true
}).setView([-7.83,110.16],11);

// =====================================================
// BASEMAP
// =====================================================

var osm = L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
    maxZoom:19,
    attribution:'© OpenStreetMap'
}).addTo(map);


var satellite = L.tileLayer(
'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
{
    maxZoom:19,
    attribution:'Esri World Imagery'
});

L.control.layers({
    "OpenStreetMap":osm,
    "Google Satellite":satellite
},null,{
    collapsed:false
}).addTo(map);

// =====================================================
// LAYER GROUP
// =====================================================

var batasLayer = L.layerGroup().addTo(map);

var tetapLayer = L.markerClusterGroup().addTo(map);

var baruLayer = L.markerClusterGroup().addTo(map);

var hilangLayer = L.markerClusterGroup().addTo(map);

// =====================================================
// VARIABEL GLOBAL
// =====================================================

var batasGeoJSON;

var tetapGeoJSON;

var baruGeoJSON;

var hilangGeoJSON;

var semuaMarker=[];

// =====================================================
// STYLE BATAS
// =====================================================

function styleBatas(feature){

    return{

        color:"#555",

        weight:2,

        fillOpacity:0

    };

}

// =====================================================
// MARKER
// =====================================================

function markerHijau(latlng){

    return L.circleMarker(latlng,{

        radius:6,

        color:"#ffffff",

        weight:1,

        fillColor:"#28a745",

        fillOpacity:1

    });

}

function markerKuning(latlng){

    return L.circleMarker(latlng,{

        radius:6,

        color:"#ffffff",

        weight:1,

        fillColor:"#ffc107",

        fillOpacity:1

    });

}

function markerMerah(latlng){

    return L.circleMarker(latlng,{

        radius:6,

        color:"#ffffff",

        weight:1,

        fillColor:"#dc3545",

        fillOpacity:1

    });

}

// =====================================================
// LOAD BATAS KAPANEWON
// =====================================================

fetch("data/Kecamatan_kulonprogo.geojson")

.then(res=>res.json())

.then(data=>{

    batasGeoJSON=L.geoJSON(data,{

        style:styleBatas

    });

    batasLayer.addLayer(batasGeoJSON);

});

// =====================================================
// LOAD TOPONIM TETAP
// =====================================================

fetch("data/Toponim Tetap baru.geojson")

.then(res=>res.json())

.then(data=>{

    tetapGeoJSON=L.geoJSON(data,{

        pointToLayer:function(feature,latlng){

            return markerHijau(latlng);

        },

        onEachFeature:function(feature,layer){

            layer.bindPopup(

                "<b>"+feature.properties.NAMOBJ+"</b><br>"+

                "Kategori : Toponim Tetap<br>"+

                "Kapanewon : "+feature.properties.KECAMATAN

            );

            semuaMarker.push({

                nama:feature.properties.NAMOBJ,

                kecamatan:feature.properties.KECAMATAN,

                kategori:"Tetap",

                layer:layer

            });

        }

    });

    tetapLayer.addLayer(tetapGeoJSON);

});

// =====================================================
// LOAD TOPONIM BARU
// =====================================================

fetch("data/Toponim Baru baru.geojson")

.then(res=>res.json())

.then(data=>{

    baruGeoJSON=L.geoJSON(data,{

        pointToLayer:function(feature,latlng){

            return markerKuning(latlng);

        },

        onEachFeature:function(feature,layer){

            layer.bindPopup(

                "<b>"+feature.properties.NAMOBJ+"</b><br>"+

                "Kategori : Toponim Baru<br>"+

                "Kapanewon : "+feature.properties.KECAMATAN

            );

            semuaMarker.push({

                nama:feature.properties.NAMOBJ,

                kecamatan:feature.properties.KECAMATAN,

                kategori:"Baru",

                layer:layer

            });

        }

    });

    baruLayer.addLayer(baruGeoJSON);

});

// =====================================================
// LOAD TOPONIM HILANG
// =====================================================

fetch("data/Toponim Hilang baru.geojson")

.then(res=>res.json())

.then(data=>{

    hilangGeoJSON=L.geoJSON(data,{

        pointToLayer:function(feature,latlng){

            return markerMerah(latlng);

        },

        onEachFeature:function(feature,layer){

            layer.bindPopup(

                "<b>"+feature.properties.NAMOBJ_2+"</b><br>"+

                "Kategori : Toponim Hilang<br>"+

                "Kapanewon : "+feature.properties.KAPANEWON

            );

            semuaMarker.push({

                nama:feature.properties.NAMOBJ_2,

                kecamatan:feature.properties.KAPANEWON,

                kategori:"Hilang",

                layer:layer

            });

        }

    });

    hilangLayer.addLayer(hilangGeoJSON);

});

// =====================================================
// FILTER + SEARCH
// =====================================================

const kategoriFilter = document.getElementById("kategoriFilter");
const kecamatanFilter = document.getElementById("kecamatanFilter");
const searchInput = document.getElementById("searchInput");

// ===========================
// ISI DROPDOWN KAPANEWON
// ===========================

const daftarKapanewon = [
"Samigaluh",
"Girimulyo",
"Kalibawang",
"Kokap",
"Nanggulan",
"Pengasih",
"Sentolo",
"Lendah",
"Galur",
"Panjatan",
"Wates",
"Temon"
];

daftarKapanewon.forEach(function(nama){

    let option=document.createElement("option");

    option.value=nama;

    option.textContent=nama;

    kecamatanFilter.appendChild(option);

});

// =====================================================
// FUNGSI FILTER
// =====================================================

function updateFilter(){

    let kategori = kategoriFilter.value;

    let kecamatan = kecamatanFilter.value;

    tetapLayer.clearLayers();
    baruLayer.clearLayers();
    hilangLayer.clearLayers();

    // -------------------------
    // TOPONIM TETAP
    // -------------------------

    if(kategori=="Semua" || kategori=="Tetap"){

        tetapGeoJSON.eachLayer(function(layer){

            if(kecamatan=="Semua" ||
               layer.feature.properties.KECAMATAN==kecamatan){

                tetapLayer.addLayer(layer);

            }

        });

    }

    // -------------------------
    // TOPONIM BARU
    // -------------------------

    if(kategori=="Semua" || kategori=="Baru"){

        baruGeoJSON.eachLayer(function(layer){

            if(kecamatan=="Semua" ||
               layer.feature.properties.KECAMATAN==kecamatan){

                baruLayer.addLayer(layer);

            }

        });

    }

    // -------------------------
    // TOPONIM HILANG
    // -------------------------

    if(kategori=="Semua" || kategori=="Hilang"){

        hilangGeoJSON.eachLayer(function(layer){

            if(kecamatan=="Semua" ||
               layer.feature.properties.KAPANEWON==kecamatan){

                hilangLayer.addLayer(layer);

            }

        });

    }

// ===============================
// HIGHLIGHT + ZOOM
// ===============================

highlightKapanewon(kecamatan);

}

kategoriFilter.addEventListener("change",updateFilter);

kecamatanFilter.addEventListener("change",updateFilter);

// =====================================================
// SEARCH
// =====================================================

searchInput.addEventListener("keyup",function(e){

    if(e.key!="Enter") return;

    let keyword=this.value.toLowerCase();

    let ketemu=false;

    semuaMarker.forEach(function(item){

        if(item.nama.toLowerCase()==keyword){

            map.setView(item.layer.getLatLng(),17);

            item.layer.openPopup();

            ketemu=true;

        }

    });

    if(!ketemu){

        alert("Toponim tidak ditemukan");

    }

});

// =======================
// STYLE BATAS
// =======================

function styleBatas(feature){

    return{
        color:"#555",
        weight:2,
        fillOpacity:0
    };

}

// =======================
// HIGHLIGHT KAPANEWON
// =======================

function highlightKapanewon(nama){

    batasGeoJSON.eachLayer(function(layer){

        if(nama=="Semua"){

            layer.setStyle({
                color:"#555",
                weight:2
            });

            map.fitBounds(batasGeoJSON.getBounds());

        }

        else if(
            layer.feature.properties.KECAMATAN.toUpperCase() ==
            nama.toUpperCase()
        ){

            layer.setStyle({
                color:"#0066ff",
                weight:5
            });

            map.fitBounds(layer.getBounds(),{
                padding:[40,40]
            });

        }

        else{

            layer.setStyle({
                color:"#999",
                weight:1
            });

        }

    });

}
