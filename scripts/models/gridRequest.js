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