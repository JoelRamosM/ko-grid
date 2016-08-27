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