var app = {};

app.init = function() {
  function startDrawing(map) {
    map.data.setDrawingMode('LineString');
  }

  function stopDrawing(map) {
    map.data.setDrawingMode(null);
  }

  function showDrawing(map) {
    map.data.setStyle({
      strokeWeight: 5,
      strokeColor: '#e50000',
      editable: true,
      zIndex: 1
    });
  }

  function clearDrawing(map) {
    map.data.forEach(function(feature) {
      map.data.remove(feature);
    });
  }

  function toGeoJson(map) {
    var geojson;
    map.data.toGeoJson(function(data) {
      if (data.features && data.features.length) {
        geojson = JSON.stringify(data, null, 2);
      }
    });
    return geojson;
  }

  function saveGeoJson(geojson, filename) {
    if (geojson && filename) {
      var blob = new Blob([geojson], {type: "application/json"});
      saveAs(blob, filename + ".json");
    } else {
      alert('Empty geojson!');
    }
  }

  function checkFileReaderApi() {
    if (!window.File && !window.FileReader && !window.FileList && !window.Blob) {
      alert('The File APIs are not fully supported in this browser.');
    }
  }

  function handleFileSelect(evt, callback) {
    var geojson, filename, extension;
    var file = evt.target.files[0];
    var name = file.name;
    var regexAll = /[^\\]*\.(\w+)$/;
    var all = name.match(regexAll);
    if (all.length) {
      extension = all[1];
    }
    if (extension !== 'json' && extension !== 'geojson') {
      alert('Unsupported file extension. (.json or .geojson only)');
    } else {
      var filename = all[0].split('.' + extension)[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        var jsonObject = JSON.parse(e.target.result);
        if (jsonObject.features && jsonObject.features.length) {
          geojson = jsonObject;
        } else {
          alert('Empty geojson!');
        }
        callback(geojson, filename);
      };
      reader.onerror = function(e) {
        switch(evt.target.error.code) {
          case evt.target.error.NOT_FOUND_ERR:
            alert('File Not Found!');
            break;
          case evt.target.error.NOT_READABLE_ERR:
            alert('File is not readable!');
            break;
          case evt.target.error.ABORT_ERR:
            alert('File upload has been aborted!');
            break;
          default:
            alert('An error occurred reading this file.');
        };
        callback(geojson, filename);
      };
      reader.readAsText(file);
    }
  }

  function toggleDisable(btns, disable) {
    if (!disable) {
      btns.forEach(function(btn) {
        btn.attr('disabled', disable);
      });
    }
  }

  function initInteractions(map) {
    var loadBtnProxy = $('.pix-upload-flight-proxy');
    var loadBtn = $('.pix-upload-flight');
    var newPlanBtn = $('.pix-new-plan');
    var newPlanIpt = $('input[type=text]');
    var pixPlanTr = $('.pix-plan-name');

    var startBtn = $('.pix-start-editing');
    var saveBtn = $('.pix-save-flight');
    var resetBtn = $('.pix-reset-flight');
    var btnGroup = [startBtn, saveBtn, resetBtn];
    var currentTbl = $('.pix-current-flight');

    var toggleCls = 'pix-down';
    // Load an existing plan
    loadBtnProxy.click(function() {
      loadBtn.click();
    });
    loadBtn.change(function(evt) {
      handleFileSelect(evt, function(geojson, filename) {
        if (geojson && filename) {
          clearDrawing(map);
          map.data.addGeoJson(geojson);
          pixPlanTr.html(filename);
          toggleDisable(btnGroup, false);
          currentTbl.addClass(toggleCls);
        }
      });
    });
    // Create a new plan
    newPlanBtn.click(function() {
      var val = newPlanIpt.val();
      if (val) {
        clearDrawing(map);
        pixPlanTr.html(val);
        newPlanIpt.val('');
        toggleDisable(btnGroup, false);
        currentTbl.addClass(toggleCls);
      } else {
        alert('Please enter a name for the new line.');
      }
    });

    startBtn.click(function() {
      var el = $(this);
      $(el).toggleClass(toggleCls);
      if (el.hasClass(toggleCls)) {
        el.html('Stop Drawing');
        startDrawing(map);
      } else {
        el.html('Start Drawing');
        stopDrawing(map);
      }
    });
    saveBtn.click(function() {
      var filename = pixPlanTr.html();
      saveGeoJson(toGeoJson(map), filename);
    });
    resetBtn.click(function() {
      clearDrawing(map);
    });
  }

  function initMap() {
    checkFileReaderApi();

    var mapEl = $('#map')[0];
    var map = new google.maps.Map(mapEl, {
      center: {lat: 46.517342, lng: 6.562015},
      zoom: 16
    });
    showDrawing(map);
    initInteractions(map);
  }

  initMap();
};

$(window).load(function() {
  app.init();
});
