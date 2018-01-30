/**
 * Created by WIN10 on 18.07.2017.
 */
var veri, dataCollection = [], resultData = [];
var center = [39.920672525793215,32.85397052764893];
var zoom =18;
var map = L.map('map').setView(center,zoom);
var basemap = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    attribution: 'Foursquare Data Collection Tool | Ali KILIÇ',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);
map.on("mousemove", mapMouseMove);
map.on("click", mapClick);
var userFsqInfoData={
    client_id:"S30KAEP05JHQ20WULGEB4F1RQZLELKJKHPGEPRKPJNTKTIZD",
    client_secret:"OHJL5OHTROSEL5Z3YI2MACXIMGEFXE2C12I2Y25AD4UNRIS4",
    oauth_token:"SFEWG2ZF1O1LJUYLMHKMHT3WL3UJPS2WEZMS2JYA2EXHLZZX"
};

var searchCircle = L.circle([0, 0], {
    color: '#03a9f4',
    fillColor: '#03a9f4',
    fillOpacity: 0.2,
    radius: 50
}).addTo(map);

function mapMouseMove(e) {
    searchCircle.setLatLng(L.latLng(e.latlng.lat, e.latlng.lng));
}

function setSearchCircle(e) {
    searchCircle.setRadius(parseInt(e.value));
}
function mapClick(e) {
    var a = "";
    var cat1 = $("#category").val();
    var cat2 = $("#category2").val();
    var r = parseInt($("#radius").val());
    if (cat2 !== "") {
        a = cat2;
    } else {
        a = cat1;
    }
    getData(e.latlng.lat, e.latlng.lng, r, a);
}

function getData(lat, lng, r, c) {
    r = parseInt(r);
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    var d = new Date();
    var y = d.getFullYear();
    var m =  d.getMonth()+1;
    var dx = d.getDate();
    if(m<=9){m = '0'+m;}
    if(dx<=9){dx = '0'+dx;}
    var timeText =y+''+m+''+dx;

    var data = {
        client_id: userFsqInfoData.client_id || "S30KAEP05JHQ20WULGEB4F1RQZLELKJKHPGEPRKPJNTKTIZD",
        client_secret: userFsqInfoData.client_secret || "OHJL5OHTROSEL5Z3YI2MACXIMGEFXE2C12I2Y25AD4UNRIS4",
        v: timeText,
        limit: "5000",
        radius: r,
        oauth_token: userFsqInfoData.oauth_token || "SFEWG2ZF1O1LJUYLMHKMHT3WL3UJPS2WEZMS2JYA2EXHLZZX",
        categoryId: c,
        lat: lat,
        lng: lng
    };

    $.ajax({
        type: 'POST', url: "php/getData.php",
        data: data,
        success: function (c) {
            if(c!==""){
                data = JSON.parse(c);
                var data = data.response.venues;
                addToList(data,lat,lng,r);
            }else{
                alert("Please Check Your Foursquare API Information");
            }

        }
    });
}

function addToList(data,lat,lng,r) {
    var tablos = $("#table");
    var num = tablos[0].children.length;
    var otherNum = 0;
    for (var i = 0; i < data.length; i++) {
        var i2 = i + 1;
        var d = data[i];
        var id = d.id;
        var name = d.name;
        var type = d.categories[0].name;
        var tel = d.contact.phone;
        if (typeof tel == "undefined") {tel = "Nan";}
        var point = 0;
        var state = d.location.state;
        var city = d.location.city;
        if (typeof state == "undefined") {state = "Nan";}
        if (typeof city == "undefined") {city = "Nan";}
        var adress = d.location.formattedAddress[0];
        if (typeof adress == "undefined") {adress = "Nan";}
        var latitude = parseFloat(d.location.lat);
        var longitude = parseFloat(d.location.lng);
        lat = parseFloat(lat);
        lng = parseFloat(lng);
        var checkin = d.stats.checkinsCount;
        var source = "foursquare";

        if (dataCollection.indexOf(id) == -1) {
            otherNum++;
            dataCollection.push(id);
            resultData.push({
                id: id,
                name: name,
                point: point,
                tel: tel,
                checkin:checkin,
                type: type,
                state: state,
                city: city,
                adress: adress,
                latitude: latitude,
                longitude: longitude,
                source: source
            });
            $("#exportTable").append('<tr>' +
                '<td id="data' + id + '">' + dataCollection.length + '</td>' +
                '<td>' + id + '</td>' +
                '<td>' + name + '</td>' +
                '<td>' + point + '</td>' +
                '<td>' + tel + '</td>' +
                '<td>' + checkin + '</td>' +
                '<td>' + type + '</td>' +
                '<td>' + state + '</td>' +
                '<td>' + city + '</td>' +
                '<td>' + adress + '</td>' +
                '<td>' + latitude + '</td>' +
                '<td>' + longitude + '</td>' +
                '<td>' + source + '</td>' +
                '</tr>');
            num++;
        }

    }
    if (otherNum > 0) {
        L.circle([lat, lng], {radius: r,fillColor: "#8BC34A",color: "#8BC34A",fillOpacity: 0.2}).addTo(map);
    } else {
        L.circle([lat, lng], {radius: r,fillColor: "#FF9800",color: "#FF9800",fillOpacity: 0.2}).addTo(map);
    }
    L.marker(new L.LatLng(lat, lng), {icon: L.divIcon({className: "textLabelclass",html: otherNum})}).addTo(map);
    var lastNum = tablos[0].children.length;
    $("#found").html(lastNum);
}

function excellDownload() {
    var time = Date.now();
    var tablo = $("#exportTable")[0].outerHTML;
    var dataStr = "data:text/xlsx;charset=utf-8," + encodeURIComponent(tablo);
    var elm = document.createElement('a');
    elm.setAttribute("href",     dataStr     );
    elm.setAttribute("download", 'foursquare_poi_data_alikilic_'+time+".xlsx");
    elm.click();

}
function  mysqlDownload() {
    var mytime = sqlTime("sqlDateTime");
    var j = $("#exportTable")[0].children.length;
    var j2=j-1;
    var time = Date.now();

    var text = 'SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\n' +
        'SET time_zone = "+00:00";\n';
    text = text+'CREATE TABLE IF NOT EXISTS poi_alikilic (\n' +
        '  num int(11) NOT NULL AUTO_INCREMENT,\n' +
        '  id text COLLATE utf8_turkish_ci NOT NULL,\n' +
        '  name text COLLATE utf8_turkish_ci NOT NULL,\n' +
        '  point double NOT NULL,\n' +
        '  tel text COLLATE utf8_turkish_ci NOT NULL,\n' +
        '  checkin int(11) NOT NULL,\n' +
        '  type text COLLATE utf8_turkish_ci NOT NULL,\n' +
        '  state text COLLATE utf8_turkish_ci NOT NULL,\n' +
        '  city text COLLATE utf8_turkish_ci NOT NULL,\n' +
        '  adress text COLLATE utf8_turkish_ci NOT NULL,\n' +
        '  latitude double NOT NULL,\n' +
        '  longitude double NOT NULL,\n' +
        '  source text COLLATE utf8_turkish_ci NOT NULL,\n' +
        '  date datetime NOT NULL,\n' +
        '  geoloc point NOT NULL,\n' +
        '  PRIMARY KEY (num),\n' +
        '  UNIQUE KEY num (num),\n' +
        '   SPATIAL INDEX(geoloc)\n'+
        ') ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci AUTO_INCREMENT='+j+' ; \n';
    var data = resultData;
    var i=0;
    var i2=i+1;
    if(j>0){
        if(j>0 && j<2){
            for(prop in data){
                var insert = 'INSERT INTO poi_alikilic(id, name, point, tel, checkin, type, state, city, adress, latitude, longitude, source, date, geoloc) VALUES \n';
                var values = "('"+strChange(data[prop]["id"])+"','"+strChange(data[prop]["name"])+"','"+strChange(data[prop]["point"])+"','"+strChange(data[prop]["tel"])+"','"+strChange(data[prop]["checkin"])+"','"+strChange(data[prop]["type"])+"','"+strChange(data[prop]["state"])+"','"+strChange(data[prop]["city"])+"','"+strChange(data[prop]["adress"])+"','"+strChange(data[prop]["latitude"])+"','"+strChange(data[prop]["longitude"])+"','foursquare','"+mytime+"',GEOMFROMTEXT('POINT("+strChange(data[prop]["longitude"])+" "+strChange(data[prop]["latitude"])+")',4326))";
                text=text+insert+' '+values+'';
            }
        }else{
            for(prop in data){
                var insert = 'INSERT INTO poi_alikilic(id, name, point, tel, checkin, type, state, city, adress, latitude, longitude, source, date, geoloc) VALUES \n';
                var values = "('"+strChange(data[prop]["id"])+"','"+strChange(data[prop]["name"])+"','"+strChange(data[prop]["point"])+"','"+strChange(data[prop]["tel"])+"','"+strChange(data[prop]["checkin"])+"','"+strChange(data[prop]["type"])+"','"+strChange(data[prop]["state"])+"','"+strChange(data[prop]["city"])+"','"+strChange(data[prop]["adress"])+"','"+strChange(data[prop]["latitude"])+"','"+strChange(data[prop]["longitude"])+"','foursquare','"+mytime+"',GEOMFROMTEXT('POINT("+strChange(data[prop]["longitude"])+" "+strChange(data[prop]["latitude"])+")',4326))";

                if(i%5==0){
                    var i2=0;
                    if(i==0){
                        text=text+' '+insert+' '+values+', \n';
                    }else{
                        text=text+' '+insert+' '+values+', \n';
                    }
                }else{
                    i2++;
                    if(i2%4==0){
                        text=text+values+'; \n';
                    }else{
                        var datassayi = data.length-1;
                        if(i==datassayi){
                            text=text+values+'; \n';
                        }else{
                            text=text+values+', \n';
                        }

                    }

                }
                i++;
            }
        }

    }

    var dataStr = "data:text/sql;charset=utf-8," + encodeURIComponent(text);
    var elm = document.createElement('a');
    elm.setAttribute("href",     dataStr     );
    elm.setAttribute("download", 'foursquare_poi_data_mysql_alikilic.sql');
    elm.click();
}

function sqlTime(tur){
    var mytime = '';
    var d = new Date();
    var y = d.getFullYear();
    var m =  d.getMonth()+1;
    var dx = d.getDate();
    var h = d.getHours();
    var mi = d.getMinutes();
    var s = d.getSeconds();
    if(tur=="sqlDateTime"){
        if(m<=9){m = '0'+m;}
        if(dx<=9){dx = '0'+dx;}
        if(h<=9){h = '0'+h;}
        if(mi<=9){mi = '0'+mi;}
        if(s<=9){s = '0'+s;}
        mytime= y+'-'+m+'-'+dx+' '+h+':'+mi+':'+s;
    }
    return mytime;
}

function  strChange(text) {
    text=''+text;
    text = replaceAll(text,"'", " ");
    text = replaceAll(text,'"', " ");
    text = replaceAll(text,'é', "e");
    return text;

}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function postgresqlDownload() {
    var mytime = sqlTime("sqlDateTime");
    var j = $("#exportTable")[0].children.length;
    var j2=j-1;
    var time = Date.now();

    var text = 'CREATE SEQUENCE poi_seq;\n';
    text = text+'CREATE TABLE IF NOT EXISTS poi_alikilic (\n' +
        'num smallint NOT NULL DEFAULT nextval(\'poi_seq\')' +
        'id INT NOT NULL,\n' +
        'name TEXT,\n' +
        'point double precision,\n' +
        'tel TEXT,\n' +
        'checkin int,\n' +
        'type TEXT,\n' +
        'state TEXT,\n' +
        'city TEXT,\n' +
        'adress TEXT,\n' +
        'latitude double precision NOT NULL,\n' +
        'longitude double precision NOT NULL,\n' +
        'source TEXT,\n' +
        'date datetime default NULL,\n' +
        'geoloc geography(POINT,4326) NOT NULL,\n' +
        'PRIMARY KEY(num,id)\n' +
        'UNIQUE(num));\n';
    var data = resultData;
    var i=0;
    var i2=i+1;
    if(j>0){
        if(j>0 && j<2){
            for(prop in data){
                var insert = 'INSERT INTO poi_alikilic(id, name, point, tel, checkin, type, state, city, adress, latitude, longitude, source, date, geoloc) VALUES \n';
                var values = "('"+strChange(data[prop]["id"])+"','"+strChange(data[prop]["name"])+"','"+strChange(data[prop]["point"])+"','"+strChange(data[prop]["tel"])+"','"+strChange(data[prop]["checkin"])+"','"+strChange(data[prop]["type"])+"','"+strChange(data[prop]["state"])+"','"+strChange(data[prop]["city"])+"','"+strChange(data[prop]["adress"])+"','"+strChange(data[prop]["latitude"])+"','"+strChange(data[prop]["longitude"])+"','foursquare','"+mytime+"',ST_GeomFromText('POINT("+strChange(data[prop]["longitude"])+" "+strChange(data[prop]["latitude"])+")',4326))";
                text=text+insert+' '+values+'';
            }
        }else{
            for(prop in data){
                var insert = 'INSERT INTO poi_alikilic(id, name, point, tel, checkin, type, state, city, adress, latitude, longitude, source, date, geoloc) VALUES \n';
                var values = "('"+strChange(data[prop]["id"])+"','"+strChange(data[prop]["name"])+"','"+strChange(data[prop]["point"])+"','"+strChange(data[prop]["tel"])+"','"+strChange(data[prop]["checkin"])+"','"+strChange(data[prop]["type"])+"','"+strChange(data[prop]["state"])+"','"+strChange(data[prop]["city"])+"','"+strChange(data[prop]["adress"])+"','"+strChange(data[prop]["latitude"])+"','"+strChange(data[prop]["longitude"])+"','foursquare','"+mytime+"',ST_GeomFromText('POINT("+strChange(data[prop]["longitude"])+" "+strChange(data[prop]["latitude"])+")',4326))";

                if(i%5==0){
                    var i2=0;
                    if(i==0){
                        text=text+' '+insert+' '+values+', \n';
                    }else{
                        text=text+' '+insert+' '+values+', \n';
                    }
                }else{
                    i2++;
                    if(i2%4==0){
                        text=text+values+'; \n';
                    }else{
                        var datassayi = data.length-1;
                        if(i==datassayi){
                            text=text+values+'; \n';
                        }else{
                            text=text+values+', \n';
                        }

                    }

                }
                i++;
            }
        }

    }

    var dataStr = "data:text/sql;charset=utf-8," + encodeURIComponent(text);
    var elm = document.createElement('a');
    elm.setAttribute("href",     dataStr     );
    elm.setAttribute("download", 'foursquare_poi_data_postgresql_alikilic.sql');
    elm.click();
}


function  oracleDownload() {
    var mytime = sqlTime("sqlDateTime");
    var j = $("#exportTable")[0].children.length;
    var j2=j-1;
    var time = Date.now();

    var text = 'CREATE SEQUENCE poi_seq\n' +
        ' START WITH     1000\n' +
        ' INCREMENT BY   1\n' +
        ' NOCACHE\n' +
        ' NOCYCLE;\n';
    text = text+'CREATE TABLE poi_alikilic (\n' +
        'num number(10) NOT NULL  PRIMARY KEY,' +
        'id varchar2(50) NOT NULL,\n' +
        'name varchar2(200),\n' +
        'point BINARY_FLOAT,\n' +
        'tel varchar2(14),\n' +
        'checkin number(10),\n' +
        'type varchar2(50),\n' +
        'state varchar2(50),\n' +
        'city varchar2(50),\n' +
        'adress varchar2(200),\n' +
        'latitude BINARY_FLOAT,\n' +
        'longitude BINARY_FLOAT,\n' +
        'source varchar2(20),\n' +
        'poitime TIMESTAMP,\n' +
        'geoloc SDO_GEOMETRY);\n';
    var data = resultData;
    var i=0;
    var i2=i+1;
    for(prop in data){
        var insert = 'INSERT INTO poi_alikilic(num,id, name, point, tel, checkin, type, state, city, adress, latitude, longitude, source, poitime, geoloc) VALUES ';
        var values = "(poi_seq.NEXTVAL,'"+strChange(data[prop]["id"])+"','"+strChange(data[prop]["name"])+"','"+strChange(data[prop]["point"])+"','"+strChange(data[prop]["tel"])+"','"+strChange(data[prop]["checkin"])+"','"+strChange(data[prop]["type"])+"','"+strChange(data[prop]["state"])+"','"+strChange(data[prop]["city"])+"','"+strChange(data[prop]["adress"])+"','"+strChange(data[prop]["latitude"])+"','"+strChange(data[prop]["longitude"])+"','foursquare',CURRENT_TIMESTAMP,SDO_GEOMETRY('POINT("+strChange(data[prop]["longitude"])+" "+strChange(data[prop]["latitude"])+")',4326));";
        var total = insert+''+values+'\n';
        text=text+total;
    }

    var dataStr = "data:text/sql;charset=utf-8," + encodeURIComponent(text);
    var elm = document.createElement('a');
    elm.setAttribute("href",     dataStr     );
    elm.setAttribute("download", 'foursquare_poi_data_oracle_alikilic.sql');
    elm.click();
}

function geojsonDownload() {
    var mytime = sqlTime("sqlDateTime");
    var fc = {
        type: "FeatureCollection",
        features: []
    };
    var i=1;
    var data = resultData;
    for(prop in data){
        var properties = {
            num:i,
            id:strChange(data[prop]["id"]),
            name:strChange(data[prop]["name"]),
            point:strChange(data[prop]["point"]),
            tel:strChange(data[prop]["tel"]),
            checkin:strChange(data[prop]["checkin"]),
            type:strChange(data[prop]["type"]),
            state:strChange(data[prop]["state"]),
            city:strChange(data[prop]["city"]),
            adress:strChange(data[prop]["adress"]),
            source:'foursquare',
            time : mytime
        };
        var geojson = {
            "type": "Feature",
            "properties": properties,
            "geometry": {
                "type": "Point",
                "coordinates": [
                    parseFloat(data[prop]["longitude"]),
                    parseFloat(data[prop]["latitude"])
                ]
            }
        };
        fc.features.push(geojson);
        i++;
    }
    var text = JSON.stringify(fc);
    var dataStr = "data:text/geojson;charset=utf-8," + encodeURIComponent(text);
    var elm = document.createElement('a');
    elm.setAttribute("href",     dataStr     );
    elm.setAttribute("download", 'foursquare_poi_data_geojson_alikilic.geojson');
    elm.click();

}
var titletextDialog;
function fsqAPIInfo() {
    var html = '<div class="input-group">' +
        '<span class="input-group-addon">client_id</span>' +
        '<input type="text" id="clientid" value="'+userFsqInfoData.client_id+'" class="form-control" placeholder="client_id"></div><br>' +
        '<div class="input-group">' +
        '<span class="input-group-addon">client_secret</span>' +
        '<input type="text" id="clientsecret" value="'+userFsqInfoData.client_secret+'" class="form-control" placeholder="client_secret"></div><br>' +
        '<div class="input-group">' +
        '<span class="input-group-addon">oauth_token</span>' +
        '<input type="text" id="oauthtoken" value="'+userFsqInfoData.oauth_token+'" class="form-control" placeholder="oauth_token"></div>';

    titletextDialog = new BootstrapDialog.show({
        title: 'Write Your Foursquare API Information',
        cssClass:"",
        message: html,
        onshow: function(titletextDialog) {
            // dialog.getButton('button-a').disable();

        },
        buttons: [{
            id: 'btn-ok',
            icon: 'glyphicon glyphicon-floppy-saved',
            label: 'Save',
            cssClass: 'btn-success',
            data: {
                js: 'btn-confirm',
                'user-id': '3'
            },
            autospin: false,
            action: updateFsqAPIInfo
        },{
            id: 'btn-close',
            icon: 'glyphicon glyphicon-remove',
            label: 'Close',
            cssClass: 'btn-danger',
            data: {
                js: 'btn-confirm',
                'user-id': '3'
            },
            autospin: false,
            action: function(titletextDialog){
                titletextDialog.close();
            }
        }]
    });
}

function updateFsqAPIInfo() {
    var clientid = $("#clientid").val();
    var clientsecret = $("#clientsecret").val();
    var oauthtoken = $("#oauthtoken").val();
    if(clientid!=="" && clientsecret!=="" && oauthtoken!==""){
        userFsqInfoData.client_id = clientid;
        userFsqInfoData.client_secret = clientsecret;
        userFsqInfoData.oauth_token = oauthtoken;
        titletextDialog.close();
    }else{
        alert("Please write all Foursquare API information");
    }
}