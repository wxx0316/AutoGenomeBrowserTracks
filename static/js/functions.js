//
function sortTrack(){
  $('#table').DataTable(); 
}

function refresh() {
  location.reload(true)
}

function testAjax(){
  //$.getJSON($SCRIPT_ROOT + '/_return_number',{a:26},function(data){console.log(data.result)})
  $.getJSON($SCRIPT_ROOT + '/_test_minio',{},function(data){console.log(data)})
}

function testUCSC(){
  window.open("http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&hubUrl=http://genome.compbio.cs.cmu.edu:9090/4dn/ma_lab/yuchuan/UCSC_Browser/dataHubTest/hub_1/hub.txt");
}

function configuration(){
  alert('In development. Default parameters are used for visualization.');
}

function sendToUCSC(){
  //var tbody = $('#table').find('tbody').eq(0).find('tr');
  var tbody = document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr");

  //check items selected
  //var n = 0
  //for (var i=0;i<tbody.length;i++){
  //  var box = tbody[i].getElementsByTagName("td")[0].children[0]
  //  if (box.checked){n++}
  //}
  //if (n<=0){
  //  alert("No items selected!")
  //  return
  //}

  var n = 0
  var table = $('#table').DataTable();
  table.rows().every( function (index){
    var row = table.row(index)
    row = row.nodes()[0]
    var box = row.getElementsByTagName("td")[0].children[0]
    //console.log(index)
    //console.log(box)
    if (box.checked){n++}
  });
  if (n<=0){
    alert("No items selected!")
    return
  }


  //check configuration

  //creat track hub
  createTrackhub()
  //testUCSC()
}

function createTrackhub(){
  //var tbody = $('#table').find('tbody').eq(0).find('tr');
  var tbody = document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
  var thead = document.getElementById("table").getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].getElementsByTagName("th");

  //find checked box and send to UCSC browser
 
  var trackStr = '{}';
  var trackObj = JSON.parse(trackStr);

  //var n = 0 
  //for (var i=0;i<tbody.length;i++){
  //  var line = tbody[i].getElementsByTagName('td')
  //  var box = line[0].children[0]
  //  if (box.checked){
  //    //console.log(line[6].innerHTML)

  //    n = n + 1
  //    trackObj["track"+n] = {}
  //    for (var j=1;j<thead.length;j++){
  //      trackObj["track"+n][thead[j].innerHTML] = line[j].innerHTML
  //    }
  //  }
  //}

  var n = 0
  var table = $('#table').DataTable();
  table.rows().every( function (index){
    var row = table.row(index)
    row = row.nodes()[0]
    var line = row.getElementsByTagName('td')
	var box = line[0].children[0]
    
	//console.log(index)
    //console.log(box)
    if (box.checked){
      n = n + 1
      trackObj["track"+n] = {}
      for (var j=1;j<thead.length;j++){
		trackObj["track"+n][thead[j].innerHTML] = line[j].innerHTML
      }
    }
  });
  

  
  //trackStr = JSON.stringify(trackObj);
  //console.log(trackObj)
  trackObj["n"] = n
  trackObj["genome"] = "hg19"

  $.getJSON($SCRIPT_ROOT + '/_createTrackHub',trackObj,function(data){
    console.log(data);
	var track_url = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&hubUrl=" + data.UCSC_url + 
		"&position=chr1&knownGene=hide&pubs=hide&cons100way=hide&wgEncodeRegMarkH3k27ac=hide&gtexGene=hide&wgEncodeRegDnaseClustered=hide" +
		"&wgEncodeRegTfbsClusteredV3=hide&snp147Common=hide&dgvPlus=hide&rmsk=hide"
    //var track_url = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&position=chr1&hgt.hideAll=1&knownGene=pack"+ "&hubUrl=" + data.UCSC_url
	var win = window.open(track_url)
    //var reset_url = "http://genome.ucsc.edu/cgi-bin/cartReset"
    //var win = window.open(reset_url)
    //var win2 = window.open(track_url)
    //if (win == null || typeof(win)=='undefined'){
    //  console.log("Failed to open window.")   
    //} else {
    //  var win2 = window.open(track_url)
    //  win.close()
    //}
    //win.close()
  })

  //console.log(track_url)
  //window.open(track_url)
}

function cleanHubs(){
  var reset_url = "http://genome.ucsc.edu/cgi-bin/cartReset"
  var win = window.open(reset_url)
  win.alert("Resetting the browser user interface settings to their defaults!")
}

function loadTable(){
  var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1y7iJXDp2GBF5bQV-0bvKl-s-T4TD2JJVhDdf_xByNjw/edit#gid=0'
  var body = document.getElementsByTagName("body")[0];
  var myTable = document.createElement("table");
  myTable.id = "table"
  myTable.setAttribute("class","display")
  //myTable.setAttribute("class","table table-striped table-bordered")
  //myTable.setAttribute("class","table table-striped table-bordered")

  //Load table

  sheetrock({
    url: mySpreadsheet,
    //query: "select A,B,C,D,E,F,H,I where A = 'dummy'",
    query: "select A,B,C,D,E,F,G,H,I",
    target: myTable,
    fetchSize: 0,
    reset: true,
    //callback: function (error, options, response) {console.log(error, options, response);}
    callback: function (error, options, response) {
      if(error === null){addCheckbox()}
    }
  });

  body.appendChild(myTable);

  //$("#table").tablesorter( {sortList: [[0,0], [1,0]]} ); 

  //myTable.tablesorter();   
  //$(document).load(function() {
  //  $('#table').DataTable();
  //} );
  $(window).bind("load", function() { 
    $('#table').DataTable();
  });

}

function addCheckbox(){
  //Add checkbox
  var myTable = document.getElementById("table")
  var tbody = myTable.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

  //var tbody = $('#table').find('tbody').eq(0).find('tr');

  for (var i=0;i<tbody.length;i++){
    var cell = tbody[i].getElementsByTagName('td')[0]
    var checkbox = document.createElement("INPUT");
    //console.log('cell')
    checkbox.type = "checkbox";
    cell.innerHTML = "";
    cell.appendChild(checkbox);
    checkbox.id = "Checkbox_" + i
  }

  //Hide location
  var thead = myTable.getElementsByTagName("thead")[0].getElementsByTagName("tr");
  var cels = thead[0].getElementsByTagName("th")
  
  //var cels = $('#table').find('thead').eq(0).find('tr').eq(0).find('th')
  
  //hide dir
  cels[6].style.display = "none"

  for (var i=0;i<tbody.length;i++){
    var cels = tbody[i].getElementsByTagName('td')
    cels[6].style.display = "none"
  }
}







