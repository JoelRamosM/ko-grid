var GridRequest = require("./gridRequest");
function GridDataSourceBase(data) {
    data = data || {};
    var self = this;

    this.gridRequest = ko.observable(new GridRequest());

    this.dataSet = ko.computed(function () {
        return this.gridRequest().data();
    }, this);

    this.selected = ko.observableArray();

    this.onRefresh = new ko.subscribable();

    this.onRefresh.subscribe(function () {
        data.onRefresh(this.gridRequest().data());
    }, this);

    this.next = function () {
        this.gridRequest().currentPage(this.gridRequest().currentPage() + 1);
        this.refresh();
    };
    this.prev = function () {
        this.gridRequest().currentPage(this.gridRequest().currentPage() - 1);
        this.refresh();
    };

    this.goto = function (page) {
        this.gridRequest().currentPage(page);
        this.refresh();
    };
};

module.exports = GridDataSourceBase;

