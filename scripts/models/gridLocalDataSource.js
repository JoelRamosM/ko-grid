var GridDataSourceBase = require("./gridDataSource.base");
function GridLocalDataSource(data) {
    data = data || {};
    GridDataSourceBase.bind(this,data).call();
    var self = this;
    this.filterableFields = ko.isObservable(data.filterableFields) ? data.filterableFields : ko.observableArray(data.filterableFields || []);    
    this.localData = ko.isObservable(data.dataSet) ? data.dataSet : ko.observableArray(data.dataSet || []);
    this.localData.subscribe(function(value){
        this.refresh();
    },this);            
};

function _getFirstIndex(gridRequest){
        return (gridRequest().currentPage()-1) * gridRequest().pageLength();
}

GridLocalDataSource.prototype.refresh = function (filter) {   
    var firstIndex = _getFirstIndex(this.gridRequest)
     var pagedData = this.localData().slice(firstIndex,(this.gridRequest().currentPage()* this.gridRequest().pageLength()));
     
     this.gridRequest().totalPages(Math.floor((this.localData().length+this.gridRequest().pageLength()-1)/this.gridRequest().pageLength()));
     this.gridRequest().totalData(this.localData().length);
     this.gridRequest().data(pagedData);    
     this.onRefresh.notifySubscribers();
};
module.exports = GridLocalDataSource;