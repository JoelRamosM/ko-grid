var GridRequest = require("./gridRequest");
var GridDataSourceBase = require("./gridDataSource.base");
function GridLocalDataSource(data) {
    data = data || {};
    GridDataSourceBase.bind(this,data).call();
    var self = this;
    this.filterableFields = ko.isObservable(data.filterableFields) ? data.filterableFields : ko.observableArray(data.filterableFields || []);    
    this.localData = ko.isObservable(data.dataSet) ? data.dataSet : ko.observableArray(data.dataSet || []);            
};

GridLocalDataSource.prototype.refresh = function (filter) {   
     var pagedData = this.localData().slice((this.gridRequest().currentPage()* (this.gridRequest().pageLength()-1))+1,(this.gridRequest().currentPage()* this.gridRequest().pageLength()));
     this.gridRequest().data(pagedData);    
     this.onRefresh.notifySubscribers();
};
module.exports = GridLocalDataSource;