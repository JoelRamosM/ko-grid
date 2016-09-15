var GridRequest = require("./gridRequest");

function GridLocalDataSource(data) {
    data = data || {};
    var self = this;
    this.filterableFields = ko.isObservable(data.filterableFields) ? data.filterableFields : ko.observableArray(data.filterableFields || []);
    
    this.localData = ko.isObservable(data.dataSet) ? data.dataSet : ko.observableArray(data.dataSet || []);
    
    this.gridRequest = ko.observable(new GridRequest());

    this.dataSet = ko.computed(function () {
        return this.gridRequest().data();
    }, this);

    this.selected = ko.observableArray();

    this.onRefresh = new ko.subscribable();

    this.onRefresh.subscribe(function () {
        data.onRefresh(this.gridRequest().data());
    }, this);
};

GridLocalDataSource.prototype.next = function () {
    this.gridRequest().currentPage(this.gridRequest().currentPage() + 1);
    this.refresh();
};
GridLocalDataSource.prototype.prev = function () {
    this.gridRequest().currentPage(this.gridRequest().currentPage() - 1);
    this.refresh();
};

GridLocalDataSource.prototype.goto = function (page) {
    this.gridRequest().currentPage(page);
    this.refresh();
};

GridLocalDataSource.prototype.refresh = function (filter) {
    
};
module.exports = GridLocalDataSource;