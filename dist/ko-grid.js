(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require("./extensions/doubleClickBindHandler.js");
require("./extensions/formatterBindHandler.js");
require("./components/register-all.js");
},{"./components/register-all.js":11,"./extensions/doubleClickBindHandler.js":12,"./extensions/formatterBindHandler.js":13}],2:[function(require,module,exports){
ko.components.register("crud-bar", {
    viewModel: require("./ViewModel.js"),
    template: require("./Template.html")
});
},{"./Template.html":3,"./ViewModel.js":4}],3:[function(require,module,exports){
module.exports = "﻿<div classs=\"btn-group\">\n    <!--ko if: newActionVisible-->\n    <button class=\"btn btn-primary\" data-bind=\"click: $data.new, enable: newActionEnabled\">\n        <span class=\"fa fa-plus\" aria-hidden=\"true\"></span> Novo\n    </button>\n    <!--/ko-->\n    <!--ko if: editActionVisible-->\n    <button class=\"btn btn-primary\" data-bind=\"click: $data.edit, enable: editActionEnable\">\n        <span class=\"fa fa-edit\" aria-hidden=\"true\"></span> Editar\n    </button>\n    <!--/ko-->\n    <!--ko if: deleteActionVisible-->\n    <button class=\"btn btn-danger\" type=\"button\" data-bind=\"click: $data.delete, enable: deleteActionEnable\">\n        <span class=\"fa fa-remove\" aria-hidden=\"true\"></span> Excluir\n        <span class=\"badge\" data-bind=\"visible:selectedCountBadge, text: selectedCountBadge\"></span>\n    </button>\n    <!--/ko-->\n    <!--ko if: customActions().length-->\n    <!--ko foreach: customActions-->\n    <button class=\"btn\" type=\"button\" data-bind=\"click: $data.action, css:$data.btnClass\">\n        <span data-bind=\"css:$data.iconClass\" aria-hidden=\"true\"></span>\n        <span data-bind=\"text: text\"></span>\n    </button>\n    <!--/ko-->\n    <!--/ko-->\n</div>";

},{}],4:[function(require,module,exports){
var apiBuilder = require("../../models/api/ApiCrudBarBuilder");
function CrudBarViewModel(params) {
    this.onNew = new ko.subscribable();
    this.onEdit = new ko.subscribable();
    this.onDelete = new ko.subscribable();

    this.selectedCountBadge = ko.observable(0);

    this.newActionVisible = ko.observable(params.withNewAction || (params.withNewAction == undefined || params.withNewAction == null));
    this.newActionEnabled = ko.observable(params.newActionEnable || (params.newActionEnable == undefined || params.newActionEnable == null));

    this.editActionVisible = ko.observable(params.withEditAction || (params.withEditAction == undefined || params.withEditAction == null));
    this.editActionEnable = ko.observable(params.editActionEnable || (params.editActionEnable == undefined || params.editActionEnable == null));;

    this.deleteActionVisible = ko.observable(params.withDeleteAction || (params.withDeleteAction == undefined || params.withDeleteAction == null));
    this.deleteActionEnable = ko.observable(params.deleteActionEnable || (params.deleteActionEnable == undefined || params.deleteActionEnable == null));

    this.customActions = ko.observableArray(params.customActions);

    this.onNew.subscribe(function () {
        params.onNew && params.onNew();
    }, this);

    this.onEdit.subscribe(function () {
        params.onEdit && params.onEdit();
    }, this);

    this.onDelete.subscribe(function () {
        params.onDelete && params.onDelete();
    }, this);

    params.crudBarAPI && ko.isObservable(params.crudBarAPI) ? params.crudBarAPI(apiBuilder(this)) : params.crudBarAPI = apiBuilder(this);

};

CrudBarViewModel.prototype.setSelectedCount = function (count) {
    this.selectedCountBadge(count);
};

CrudBarViewModel.prototype.new = function () {
    this.onNew.notifySubscribers();
};

CrudBarViewModel.prototype.disableNew = function () {
    this.newActionEnabled(false);
};
CrudBarViewModel.prototype.enableNew = function () {
    this.newActionEnabled(true);
};
CrudBarViewModel.prototype.delete = function () {
    this.onDelete.notifySubscribers();
};
CrudBarViewModel.prototype.disableDelete = function () {
    this.deleteActionEnable(false);
};
CrudBarViewModel.prototype.enableDelete = function () {
    this.deleteActionEnable(true);
};

CrudBarViewModel.prototype.edit = function () {
    this.onEdit.notifySubscribers();
};

CrudBarViewModel.prototype.disableEdit = function () {
    this.editActionEnable(false);
};
CrudBarViewModel.prototype.enableEdit = function () {
    this.editActionEnable(true);
};

module.exports = CrudBarViewModel;
},{"../../models/api/ApiCrudBarBuilder":15}],5:[function(require,module,exports){
ko.components.register("grid", {
    viewModel: require("./ViewModel.js"),
    template: require("./Template.html")
});
},{"./Template.html":6,"./ViewModel.js":7}],6:[function(require,module,exports){
module.exports = "<!--ko if: dataSource().dataSet().length == 0 -->\n<div data-bind=\"html: emptyTemplate\"></div>\n<!--/ko-->\n<div class=\"panel  panel-default\" data-bind=\"visible: dataSource().dataSet().length > 0 \">\n    <table role=\"grid\" class=\"table  table-hover table-bordered ko-grid_table\" data-bind=\"if: dataSource().dataSet().length > 0\">\n        <thead class=\"ko-grid_thead\">\n            <tr class=\"ko-grid_head-row\">\n                <!--ko if: isMultiSelect-->\n                <td class=\"col-sm-1 text-center ko-grid_th-check-all\"><input type=\"checkbox\" data-bind=\"checked: checkAll\" /></td>\n                <!--/ko-->\n                <!--ko foreach: columns-->\n                <th class=\"ko-grid_th\" data-bind=\"text:title\"></th>\n                <!--/ko-->\n            </tr>\n        </thead>\n        <tbody class=\"ko-grid_tbody\" data-bind=\"foreach: dataSource().dataSet\">\n            <tr role=\"row\" class=\"odd ko-grid_row\" data-bind=\"doubleClick: $parent.rowDoubleClickAction.bind($parent)\" title=\"De dois cliques na linha para editar item.\">\n                <!--ko if: $parent.isMultiSelect-->\n                <td class=\"col-sm-1 text-center ko-grid_check-collumn\"><input type=\"checkbox\" data-bind=\"value:$data['id'] || $data['Id'] || $data[$parent.identityProp()], checked:$parent.selectedRows\"\n                    /></td>\n                <!--/ko-->\n                <!--ko foreach: $parent.columns-->\n                <td class=\"ko-grid_collumn\" data-bind=\"text: $parents[1]._getDataValue($parent,$data.prop), formatter: $data.format\"></td>\n                <!--/ko-->\n            </tr>\n        </tbody>\n        <tfoot>\n            <tr data-bind=\"if: hasAggregates\" class=\"active ko-grid_row-footer_aggregate\">\n                <!--ko if: isMultiSelect-->\n                <td class=\"col-sm-1 text-center\"></td>\n                <!--/ko-->\n                <!--ko foreach: columns-->\n                <td class=\"ko-grid_collumn\" data-bind=\"text: $parent._getAggregate($data), formatter: $data.format\"></td>\n                <!--/ko-->\n            </tr>\n        </tfoot>\n    </table>\n    <div class=\"row ko-grid_row-footer\" data-bind=\"if: dataSource().dataSet().length > 0\" style=\"bottom: 0;position: relative;width: 100%;margin-top: 7px;margin-bottom: 5px;\">\n        <div class=\"col-md-7\" style=\"border:none;position: relative;left: 0;\">\n            <page-control class=\"ko-grid_page-control\" params=\"{totalPages: totalPages, currentPage: currentPage, onGoTo: goToPage.bind($data), onNext: next.bind($data), onPrev:prev.bind($data)}\"></page-control>\n        </div>\n        <div class=\"col-md-5 text-right ko-grid_description\" style=\"border:none;position: relative;right: 0; top:7px\">\n            <span data-bind=\"text: dataSourceDescription\"></span>\n        </div>\n    </div>\n</div>";

},{}],7:[function(require,module,exports){
var GridRemoteDataSource = require("../../models/gridRemoteDataSource");
var GridLocalDataSource = require("../../models/gridLocalDataSource");
var apiBuilder = require("../../models/api/ApiGridBuilder");

function gridDataSourceFac(data) {
    return data.url ? new GridRemoteDataSource(data) : new GridLocalDataSource(data);
}

var emptyTemplate = "<div class='bs-callout bs-callout-info'><h4>Sem Dados</h4></div>";

function GridViewModel(params) {
    params = params.config || {};
    var self = this;
    this.name = ko.observable(params.name);
    this.identityProp = ko.observable(params.identityProp)
    this.onRefresh = new ko.subscribable();

    this.onRefreshCallback = function (data) {
        this.onRefresh.notifySubscribers(data);
    }
    this.isMultiSelect = ko.observable(params.isMultiSelect);

    this.hasAggregates = ko.observable(params.hasAggregates);

    this.rowDoubleClickAction = params.rowDoubleClickAction || params.defaultAction || function () { };

    this.columns = ko.observableArray(params.columns);

    this.emptyTemplate = ko.observable(params.emptyTemplate || emptyTemplate);

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
        var firstIndexInPage = (this.dataSource().gridRequest().currentPage() - 1) * this.dataSource().gridRequest().pageLength() + 1;
        var lastIndexInPage = (firstIndexInPage + this.dataSource().gridRequest().data().length - 1);
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

GridViewModel.prototype._getAggregate = function (data) {
    if (data.aggregate)
        return this.dataSource().getAggregate({ column: data.prop, aggregate: data.aggregate });
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
},{"../../models/api/ApiGridBuilder":16,"../../models/gridLocalDataSource":18,"../../models/gridRemoteDataSource":19}],8:[function(require,module,exports){
ko.components.register("page-control", {
    viewModel: require("./ViewModel.js"),
    template: require("./Template.html")
});
},{"./Template.html":9,"./ViewModel.js":10}],9:[function(require,module,exports){
module.exports = "<nav data-bind=\"visible: totalPages()>1\">\n    <ul class=\"pagination pagination-sm\" style=\"margin:0;\">\n        <li data-bind=\"css:{'disabled':!prevPageEnable()}\" style=\"cursor:pointer;\">\n            <a class=\"glyphicon glyphicon-step-backward ko-grid__pagination_first-icon\" data-bind=\"click:first\"></a>\n        </li>\n        <li data-bind=\"css:{'disabled':!prevPageEnable()}\" style=\"cursor:pointer;\">\n            <a aria-label=\"Previous\" class=\"glyphicon glyphicon-backward ko-grid__pagination_prev-icon\" data-bind=\"click:prev\"></a>\n        </li>\n        <!--<li data-bind=\"css:{'disabled':!prevPageEnable()},visible: ellipisisPrev\"><span>...</span></li>-->\n        <!--ko foreach: pages-->\n        <li data-bind=\"css:{'active': $data.current}\" style=\"cursor:pointer;\">\n            <a style=\"top:1px;\" data-bind=\"text:$data.value, click: $parent.goTo.bind($parent,$data.value)\"></a>\n        </li>\n        <!--/ko-->\n        <li data-bind=\"css:{'disabled':!nextPageEnable()},visible: ellipisisNext\"><span style=\"top:1px;\">...</span></li>\n        <li data-bind=\"css:{'disabled':!nextPageEnable()}\" style=\"cursor:pointer;\">\n            <a class=\"glyphicon glyphicon-forward ko-grid__pagination_next-icon\" data-bind=\"click:next\"></a>\n        </li>\n        <li data-bind=\"css:{'disabled':!nextPageEnable()}\" style=\"cursor:pointer;\">\n            <a class=\"glyphicon glyphicon-step-forward ko-grid__pagination_last-icon\" data-bind=\"click:last\"></a>\n        </li>\n    </ul>\n</nav>";

},{}],10:[function(require,module,exports){
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

PageControlViewModel.prototype.last = function () {
    if (!this.nextPageEnable()) return;
    this.goTo(this.pages().length);
};

PageControlViewModel.prototype.prev = function (page) {
    if (!this.prevPageEnable()) return;
    this.onPrev.notifySubscribers(page);
};

PageControlViewModel.prototype.first = function () {
    if (!this.prevPageEnable()) return;
    this.goTo(1);
};

PageControlViewModel.prototype.goTo = function (page) {
    this.onGoTo.notifySubscribers(page);
};

module.exports = PageControlViewModel;
},{}],11:[function(require,module,exports){
require("./page-control/Register");
require("./grid/Register");
require("./crud-bar/Register");
//ko.applyBindings({});
},{"./crud-bar/Register":2,"./grid/Register":5,"./page-control/Register":8}],12:[function(require,module,exports){
ko.bindingHandlers["doubleClick"] = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var handler = valueAccessor.bind(bindingContext)();
        ko.utils.registerEventHandler(element, "dblclick", function (e) {
            handler(viewModel, e);
        });
    }
};
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
function ApiCrudBarBuilder(gridScope) {
    return {
        disableNewAction: gridScope.disableNew.bind(gridScope),
        enableNewAction: gridScope.enableNew.bind(gridScope),
        disableDeleteAction: gridScope.disableDelete.bind(gridScope),
        enableDeleteAction: gridScope.enableDelete.bind(gridScope),
        disableEditAction: gridScope.disableEdit.bind(gridScope),
        enableEditAction: gridScope.enableEdit.bind(gridScope),
        setSelectedBadge: gridScope.setSelectedCount.bind(gridScope)
    };
};

module.exports = ApiCrudBarBuilder;
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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


},{"./gridRequest":20}],18:[function(require,module,exports){
var GridDataSourceBase = require("./gridDataSource.base");
function GridLocalDataSource(data) {
    data = data || {};
    GridDataSourceBase.bind(this, data).call();
    var self = this;
    this.filterableFields = ko.isObservable(data.filterableFields) ? data.filterableFields : ko.observableArray(data.filterableFields || []);
    this.localData = ko.isObservable(data.dataSet) ? data.dataSet : ko.observableArray(data.dataSet || []);
    this.localData.subscribe(function (value) {
        this.refresh();
    }, this);
};

function _getFirstIndex(gridRequest) {
    return (gridRequest().currentPage() - 1) * gridRequest().pageLength();
}

GridLocalDataSource.prototype.refresh = function (filter) {
    var firstIndex = _getFirstIndex(this.gridRequest)
    var pagedData = this.localData().slice(firstIndex, (this.gridRequest().currentPage() * this.gridRequest().pageLength()));

    this.gridRequest().totalPages(Math.floor((this.localData().length + this.gridRequest().pageLength() - 1) / this.gridRequest().pageLength()));
    this.gridRequest().totalData(this.localData().length);
    this.gridRequest().data(pagedData);
    this.onRefresh.notifySubscribers();
};
GridLocalDataSource.prototype.getAggregate = function (options) {
    if (options.aggregate != "sum") return 0;
    return this.gridRequest().data().map(function (data) {
        return Number.parseFloat(ko.isObservable(data[options.column]) ? data[options.column]() : data[options.column]) || 0;
    }).reduce(function (prev, next) { return next + prev; });
};
module.exports = GridLocalDataSource;
},{"./gridDataSource.base":17}],19:[function(require,module,exports){
var GridDataSourceBase = require("./gridDataSource.base");
var GridRequest = require("./gridRequest");
var ajaxRequest = require("./ajax-request");
function GridRemoteDataSource(data) {
    data = data || {};
    GridDataSourceBase.bind(this, data).call();
    var self = this;
    this.url = ko.isObservable(data.url) ? data.url : ko.observable(data.url || "");
    this.urlNotInformed = ko.computed(function () {
        return !this.url();
    }, this);
};

GridRemoteDataSource.prototype.getAggregate = function (options) {
    if (options.aggregate != "sum") return 0;
    var agregates = this.gridRequest().aggregates().filter(function (item) {
        return item.column == options.column;
    });
    return (agregates.length && aggregate[0].value) || 0;
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


},{"./ajax-request":14,"./gridDataSource.base":17,"./gridRequest":20}],20:[function(require,module,exports){
function GridRequest(data) {
    data = data || {};
    this.pageLength = ko.observable(data.pageLength || data.PageLength || 10);
    this.query = ko.observable(data.query || data.Query || "");
    this.currentPage = ko.observable(data.currentPage || data.CurrentPage || 1);
    this.totalPages = ko.observable(data.totalPages || data.TotalPages || 1);
    this.totalData = ko.observable(data.totalData || data.TotalData || 0);
    this.data = ko.observableArray(data.data || data.Data || []);
    this.aggregates = ko.observableArray(data.aggregates || []);
}
module.exports = GridRequest;
},{}]},{},[1]);
