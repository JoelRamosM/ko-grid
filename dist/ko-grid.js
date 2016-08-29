(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
ko.components.register("grid", {
    viewModel: require("./ViewModel.js"),
    template: require("./Template.html")
});
},{"./Template.html":2,"./ViewModel.js":3}],2:[function(require,module,exports){
module.exports = "﻿<div class=\"box ko-grid_box\">\r\n    <div class=\"box-body ko-grid_box-body\">\r\n        <div class=\"dataTables_wrapper form-inline dt-bootstrap ko-grid_dataTables_wrapper\">\r\n            <div class=\"row\">\r\n                <div class=\"col-sm-12\">\r\n                    <table role=\"grid\" class=\"table table-bordered table-hover dataTable ko-grid_table\">\r\n                        <thead class=\"ko-grid_thead\">\r\n                            <tr class=\"ko-grid_head-row\">\r\n                                <!--ko if: isMultiSelect-->\r\n                                <td class=\"col-sm-1 text-center ko-grid_th-check-all\"><input type=\"checkbox\" data-bind=\"checked: checkAll\" /></td>\r\n                                <!--/ko-->\r\n                                <!--ko foreach: collumns-->\r\n                                <th class=\"ko-grid_th\" data-bind=\"text:title\"></th>\r\n                                <!--/ko-->\r\n                            </tr>\r\n                        </thead>\r\n                        <tbody class=\"ko-grid_tbody\" data-bind=\"foreach: dataSource().dataSet\">\r\n                            <tr role=\"row\" class=\"odd ko-grid_row\" data-bind=\"doubleClick: $parent.rowDoubleClickAction.bind($parent)\" title=\"De dois cliques na linha para editar item.\">\r\n                                <!--ko if: $parent.isMultiSelect-->\r\n                                <td class=\"col-sm-1 text-center ko-grid_check-collumn\"><input type=\"checkbox\" data-bind=\"value:$data.id, checked:$parent.selectedRows\" /></td>\r\n                                <!--/ko-->\r\n                                <!--ko foreach: $parent.collumns-->\r\n                                <td class=\"ko-grid_collumn\" data-bind=\"text: $parent[$data.prop], formatter: $data.format\"></td>\r\n                                <!--/ko-->\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"col-sm-5 ko-grid_description\"><span data-bind=\"text: dataSourceDescription\"></span></div>\r\n                <div class=\"col-sm-7\"><page-control class=\"right ko-grid_page-control\" params=\"{totalPages: totalPages, currentPage: currentPage, onGoTo: goToPage.bind($data), onNext: next.bind($data), onPrev:prev.bind($data)}\"></page-control></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";

},{}],3:[function(require,module,exports){
var GridDataSource = require("../../models/gridDataSource");
var apiBuilder = require("../../models/api/ApiGridBuilder");
function GridViewModel(params) {
    params = params || {};
    var self = this;
    this.name = ko.observable(params.name);
    this.identityProp = ko.observable(params.identityProp)
    this.onRefresh = new ko.subscribable();

    this.onRefreshCallback = function (data) {
        this.onRefresh.notifySubscribers(data);
    }
    this.isMultiSelect = ko.observable(params.isMultiSelect || (params.isMultiSelect == undefined || params.isMultiSelect == null));

    this.rowDoubleClickAction = params.rowDoubleClickAction||params.defaultAction;

    this.collumns = ko.observableArray(params.collumns);

    this.dataSource = ko.observable(new GridDataSource({ url: params.url, defaultAction: params.defaulAction, onRefresh: this.onRefreshCallback.bind(this) }));

    this.selectedRows = ko.observableArray([]);
    //TODO: selected rows on current page
    this.totalPages = ko.computed(function () {
        return this.dataSource().gridRequest().totalPages();
    }, this);

    this.currentPage = ko.computed(function () {
        return this.dataSource().gridRequest().currentPage();
    }, this);

    this.dataSourceDescription = ko.computed(function () {
        return "Mostrando " + this.dataSource().dataSet().length + " de " + this.dataSource().gridRequest().totalData() + ".";
    }, this);

    this.checkAll = ko.computed({
        read: function () {
            return this.selectedRows().length === this.dataSource().dataSet().length;
        },
        write: function (value) {
            if (value) {
                self.selectedRows.removeAll();
                this.dataSource().dataSet().forEach(function (item) {
                    self.selectedRows.push(item.id);
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

GridViewModel.prototype.defaultAction = function (rowObject) {
    this.defaulActionCallback && this.defaulActionCallback( rowObject[this.identityProp()] || rowObject["id"] || rowObject["Id"]);
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
},{"../../models/api/ApiGridBuilder":11,"../../models/gridDataSource":12}],4:[function(require,module,exports){
ko.components.register("page-control", {
    viewModel: require("./ViewModel.js"),
    template: require("./Template.html")
});
},{"./Template.html":5,"./ViewModel.js":6}],5:[function(require,module,exports){
module.exports = "﻿<div class=\"dataTables_paginate paging_simple_numbers\" data-bind=\"visible: totalPages()>1\">\r\n    <ul class=\"pagination\">\r\n        <li data-bind=\"css:{'disabled':!prevPageEnable()}\"><a aria-label=\"Previous\" data-bind=\"click:prev\"><span aria-hidden=\"true\">&laquo;</span></a></li>\r\n        <!--<li data-bind=\"css:{'disabled':!nextPageEnable()},visible: ellipisisPrev\"><span>...</span></li>-->\r\n        <!--ko foreach: pages-->\r\n        <li data-bind=\"css:{'active': $data.current}\"><a data-bind=\"text:$data.value, click: $parent.goTo.bind($parent,$data.value)\"> <span class=\"sr-only\"></span></a></li>\r\n        <!--/ko-->\r\n        <li data-bind=\"css:{'disabled':!nextPageEnable()},visible: ellipisisNext\"><span>...</span></li>\r\n        <li data-bind=\"css:{'disabled':!nextPageEnable()}\"><a aria-label=\"Next\" data-bind=\"click:next\"><span aria-hidden=\"true\">&raquo;</span></a></li>\r\n    </ul>\r\n</div>";

},{}],6:[function(require,module,exports){
function PageControlViewModel(params) {
    this.totalPages = ko.isObservable(params.totalPages) ? params.totalPages : ko.observable(params.totalPages);
    this.currentPage = ko.isObservable(params.currentPage) ? params.currentPage : ko.observable(params.currentPage);
    this.controlSize = ko.observable(params.controlSize || 5);

    this.pages = ko.computed(function () {
        var result = [];

        if (this.totalPages() <= this.controlSize())
            for (var i = 0; i < this.totalPages() ; i++)
                result.push({ value: i + 1, current: (i + 1) === this.currentPage() });

        else if (this.currentPage() > this.controlSize())
            for (var i = (this.currentPage() - this.controlSize()) + 1 ; i <= this.currentPage() ; i++)
                result.push({ value: i, current: (i) === this.currentPage() });
        else
            for (var i = 0; i < this.controlSize() ; i++)
                result.push({ value: i + 1, current: (i + 1) === this.currentPage() });

        return result;
    }, this);

    this.prevPageEnable = ko.computed(function () {
        return this.currentPage() > 1;
    }, this);

    this.nextPageEnable = ko.computed(function () {
        return this.currentPage() < this.totalPages();
    }, this);

    this.ellipisisNext = ko.computed(function () {
        return (this.totalPages() > this.controlSize()) && (this.totalPages() - this.currentPage()) > 0;
    }, this);

    this.ellipisisPrev = ko.computed(function () {
        return (this.currentPage() - this.controlSize()) > 0;
    }, this);

    this.onNextCallback = params.onNext;
    this.onPrevCallback = params.onPrev;
    this.onGoToCallback = params.onGoTo;
    this.onChangeCallback = params.onChange;

    this.onChange = new ko.subscribable();
    this.onGoTo = new ko.subscribable();
    this.onNext = new ko.subscribable();
    this.onPrev = new ko.subscribable();

    this.onChange.subscribe(function (page) {
        this.onChangeCallback && this.onChangeCallback(page);
    }, this);
    this.onNext.subscribe(function (page) {
        this.onChange.notifySubscribers(page);
        this.onNextCallback && this.onNextCallback(page);
    }, this);
    this.onPrev.subscribe(function (page) {
        this.onChange.notifySubscribers(page);
        this.onPrevCallback && this.onPrevCallback(page);
    }, this);
    this.onGoTo.subscribe(function (page) {
        this.onChange.notifySubscribers(page);
        this.onGoToCallback && this.onGoToCallback(page);
    }, this);


};

PageControlViewModel.prototype.next = function (page) {
    if (!this.nextPageEnable()) return;
    this.onNext.notifySubscribers(page);
};
PageControlViewModel.prototype.prev = function (page) {
    if (!this.prevPageEnable()) return;
    this.onPrev.notifySubscribers(page);
};


PageControlViewModel.prototype.goTo = function (page) {
    this.onGoTo.notifySubscribers(page);
};

module.exports = PageControlViewModel;
},{}],7:[function(require,module,exports){
require("./page-control/Register");
require("./grid/Register");
ko.applyBindings({});
},{"./grid/Register":1,"./page-control/Register":4}],8:[function(require,module,exports){
ko.bindingHandlers["doubleClick"] = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var handler = valueAccessor.bind(bindingContext)();
        ko.utils.registerEventHandler(element, "dblclick", function (e) {
            handler(viewModel, e);
        });
    }
};
},{}],9:[function(require,module,exports){
ko.bindingHandlers["formatter"] = {
    init: function () {

    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var format = ko.unwrap(valueAccessor());
        var text = ko.unwrap(allBindings.get("text")) || "";
        var nvalue;
        
        if(typeof format ==="function"){
            $(element).text(format(text));
            return;
        }        
        if(typeof format !=="string")
            return;
        
        //Brazilian person or company identifier      
        if (format === "cpfcnpj") {
            if (text.length === 11)
                nvalue = text.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
            else if (text.length === 14)
                nvalue = text.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
            $(element).text(nvalue);
            return;
        }
        if (format === "date") {
            var dtStr = moment(text).format("DD/MM/YYYY");
            $(element).text(dtStr);
            return;
        }
        if (format === "dateTime") {
            var dtStr = moment(text).format("DD/MM/YYYY HH:mm");
            $(element).text(dtStr);
            return;
        }        
    }

};
},{}],10:[function(require,module,exports){
function request(method, url, params, done, fail, aways) {
    var xhr = $.ajax({ method: method, url: url, data: params })
                  .done(done)
                  .fail(fail)
                  .always(aways);
    return xhr;
};
module.exports = {

    get: function (url, params, done, fail, aways) {
        return request("GET", url, params, done, fail, aways);
    },
    _delete: function (url, params, done, fail, aways) {
        return request("DELETE", url, params, done, fail, aways);
    }

};
},{}],11:[function(require,module,exports){
function ApiGridBuilder(gridScope) {
    return {
        applyFilter: gridScope.filter.bind(gridScope),
        refresh: gridScope.refresh.bind(gridScope),
        onRefresh: gridScope.onRefresh,
        selectedRows: gridScope.selectedRows,
        dataSource: gridScope.dataSource
    };
};

module.exports = ApiGridBuilder;
},{}],12:[function(require,module,exports){
var GridRequest = require("./gridRequest");
var ajaxRequest = require("./ajax-request");
function GridDataSource(data) {
    data = data || {};
    var self = this;

    this.url = ko.isObservable(data.url) ? data.url : ko.observable(data.url || "");
    this.urlNotInformed = ko.computed(function () {
        return !this.url();
    }, this);

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

GridDataSource.prototype.next = function () {
    this.gridRequest().currentPage(this.gridRequest().currentPage() + 1);
    this.refresh();
};
GridDataSource.prototype.prev = function () {
    this.gridRequest().currentPage(this.gridRequest().currentPage() - 1);
    this.refresh();
};

GridDataSource.prototype.goto = function (page) {
    this.gridRequest().currentPage(page);
    this.refresh();
};

GridDataSource.prototype.refresh = function (filter) {
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
module.exports = GridDataSource;


},{"./ajax-request":10,"./gridRequest":13}],13:[function(require,module,exports){
function GridRequest(data) {
    data = data || {};
    this.pageLength = ko.observable(data.pageLength || data.PageLength || 10);
    this.query = ko.observable(data.query || data.Query || "");
    this.currentPage = ko.observable(data.currentPage || data.CurrentPage || 1);
    this.totalPages = ko.observable(data.totalPages || data.TotalPages || 1);
    this.totalData = ko.observable(data.totalData || data.TotalData || 0);
    this.data = ko.observableArray(data.data || data.Data || []);
}
module.exports = GridRequest;
},{}],14:[function(require,module,exports){
require("./extensions/doubleClickBindHandler.js");
require("./extensions/formatterBindHandler.js");
require("./components/register-all.js");
},{"./components/register-all.js":7,"./extensions/doubleClickBindHandler.js":8,"./extensions/formatterBindHandler.js":9}]},{},[14]);
