var GridRemoteDataSource = require("../../models/gridRemoteDataSource");
var GridLocalDataSource = require("../../models/gridLocalDataSource");
var apiBuilder = require("../../models/api/ApiGridBuilder");

function gridDataSourceFac(data) {
    return data.url ? new GridRemoteDataSource(data) : new GridLocalDataSource(data);
}

function GridViewModel(params) {
    params = params || {};
    var self = this;
    this.name = ko.observable(params.name);
    this.identityProp = ko.observable(params.identityProp)
    this.onRefresh = new ko.subscribable();

    this.onRefreshCallback = function (data) {
        this.onRefresh.notifySubscribers(data);
    }
    this.isMultiSelect = ko.observable(params.isMultiSelect);

    this.rowDoubleClickAction = params.rowDoubleClickAction || params.defaultAction || function () { };

    this.collumns = ko.observableArray(params.collumns);


    this.dataSource = ko.observable(gridDataSourceFac({ url: params.url, dataSet: params.data, defaultAction: params.defaulAction, onRefresh: this.onRefreshCallback.bind(this) }));

    this.selectedRows = ko.observableArray([]);
    //TODO: selected rows on current page
    this.totalPages = ko.computed(function () {
        return this.dataSource().gridRequest().totalPages();
    }, this);

    this.currentPage = ko.computed(function () {
        return this.dataSource().gridRequest().currentPage();
    }, this);

    this.dataSourceDescription = ko.computed(function () {
        var firstIndexInPage = (this.dataSource().gridRequest().currentPage() - 1) * this.dataSource().gridRequest().pageLength()+1;
        var lastIndexInPage = (firstIndexInPage + this.dataSource().gridRequest().data().length-1);
        return "Mostrando de " + firstIndexInPage + " para " + lastIndexInPage + ". Total: " + this.dataSource().gridRequest().totalData() + " itens";        
    }, this);

    this.checkAll = ko.computed({
        read: function () {
            return this.selectedRows().length === this.dataSource().dataSet().length;
        },
        write: function (value) {
            if (value) {
                self.selectedRows.removeAll();
                this.dataSource().dataSet().forEach(function (item) {
                    self.selectedRows.push(item['id'] || item['Id']);
                });
            } else {
                this.selectedRows.removeAll();
            }
        },
        owner: this
    });

    params.gridAPI && ko.isObservable(params.gridAPI) ? params.gridAPI(apiBuilder(this)) : params.gridAPI = apiBuilder(this);

    this.dataSource().refresh();
};

GridViewModel.prototype._getDataValue = function (data, prop) {
    var splited = prop.split('.');
    var value = data[splited[0]];
    if (splited.length > 1)
        return this._getDataValue(value, splited.slice(1).join('.'))
    return value;
};
GridViewModel.prototype.defaultAction = function (rowObject) {
    this.defaulActionCallback && this.defaulActionCallback(rowObject[this.identityProp()] || rowObject["id"] || rowObject["Id"]);
}

GridViewModel.prototype.refresh = function () {
    this.dataSource().refresh();
}
GridViewModel.prototype.filter = function (filter) {
    this.dataSource().refresh(filter);
}

GridViewModel.prototype.goToPage = function (pageNumber) {
    this.dataSource().goto(pageNumber);
};

GridViewModel.prototype.next = function () {
    this.dataSource().next();
};

GridViewModel.prototype.prev = function () {
    this.dataSource().prev();
};

module.exports = GridViewModel;