Ext.Loader.setConfig({ enabled: true });
// if your page is located directly above the Ext JS folder:
Ext.Loader.setPath('Ext', './extjs/src');
Ext.Loader.setPath('Ext.ux', './extjs/examples/ux');
 
Ext.require([
    'Ext.loader.*',

    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.layout.container.Border',
    'Ext.grid.PagingScroller',
    'Ext.Array.*'
]);  



var PackageStore;

var socket;
var testData = [];

var PlugBuildApp = Ext.application({
    name: 'PlugBuild',

    appFolder: '/static/PlugBuild',
    controllers: [
        'Packages'
    ],
    launch: function() {
        go();
    }
});




function go() {
    console.log("executing api request");
    Ext.Ajax.request({
        url: '/static/data/packages.json',
        success: function(response){
            var text = response.responseText;
            var packageListObject = Ext.JSON.decode(text);
            //console.dir(packageListObject);
            for ( var key in packageListObject) {
                var npackage = packageListObject[key];
                testData.push(npackage);
            }
            plugBuildInit();
        }
    });
}


function plugBuildInit() {
    console.log("PlugBuild UI 1.0 Initialized with ExtJS toolkit");
    Ext.get('loading').remove();
    Ext.get('loading-mask').fadeOut({remove:true});
                
    Ext.create('Ext.container.Viewport', {
        layout:'border',
        defaults: {
            collapsible: true,
            split: true,
            bodyStyle: 'padding:15px'
        },
        items: [{
            title: 'Console',
            region: 'south',
            height: 150,
            minSize: 75,
            maxSize: 250,
            cmargins: '5 0 0 0'
        },{
            title: 'Status',
            region:'east',
            margins: '5 0 0 0',
            cmargins: '5 5 0 0',
            width: 400,
            minSize: 100,
            maxSize: 400
        },{
            title: 'Packages',
            xtype: 'packagelist',
            collapsible: false,
            region:'center',
            margins: '0 0 0 0',
            bodyStyle: 'padding: 0px', 
        }]
    });
    var records = [];
    Ext.Array.each(testData, function(opackage,index,packages) {
        var nPackage = Ext.create('PlugBuild.model.Package', {
            package: opackage.package,
            repo: opackage.repo,
            v7_fail: opackage.v7_fail,
            v7_done: opackage.v7_done,
            v5_fail: opackage.v5_fail,
            v5_done: opackage.v5_done
        });
        records.push(nPackage);
    });
    PackageStore.cacheRecords(records);

    PackageStore.guaranteeRange(0, 49);
}

function pingSocket() {
	socket.send(JSON.stringify({ command: "echo", stuff: "dont use the word polish, just say crimsonred, mkay?"}));
}

function openConnection() { 
    feed = io.connect('https://archlinuxarm.org:7050', {secure: true});
    feed.on('connect', function () {
        console.log('socket.io connected');
        feed.emit('hi!');
    });
    feed.on('echo',function(data){ 
        console.log("opened socket");
        console.log(data);
        feed.emit('echo',{stuff:'client'});
    });
    feed.on('disconnect',function(){
        console.log('socket.io closed');
    });
}

function closeConnection() {
    
}




