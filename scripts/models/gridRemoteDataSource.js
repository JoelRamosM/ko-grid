var GridDataSourceBase = require("./gridDataSource.base");
var ajaxRequest = require("./ajax-request");
function GridRemoteDataSource(data) {
    data = data || {};
    GridDataSourceBase.bind(this,data).call();
    var self = this;    
    this.url = ko.isObservable(data.url) ? data.url : ko.observable(data.url || "");
    this.urlNotInformed = ko.computed(function () {
        return !this.url();
    }, this);   
};

GridRemoteDataSource.prototype.refresh = function (filter) {
    var self = this;
    filter = filter || {};
    var gridRequest = ko.toJS(this.gridRequest());
    delete gridRequest["data"];

    for (var prop in filter) {
        if (filter.hasOwnProperty(prop))
            gridRequest[prop] = filter[prop];
    }
    var params = $.param(gridRequest);

    ajaxRequest.get(this.url(), params,
        function (response) {
            self.gridRequest(new GridRequest(response));
            self.onRefresh.notifySubscribers();
        });
};
module.exports = GridRemoteDataSource;

