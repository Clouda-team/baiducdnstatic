define(
    function (require) {
        var IoCTree = require('ioc-dep-graph/IoCTree');
        var ioc = require('common/ioc');
        return IoCTree.getInstance(ioc);
    }
);