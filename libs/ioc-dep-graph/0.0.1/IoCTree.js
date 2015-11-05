define(
    function (require) {

        function IoCTree(ioc) {
            this.ioc = ioc;
            this.children = null;
            this.nodes = [];
            this.links = [];
            var me = this;
            window.addEventListener('message', function (event) {
                if (me.drawWindow === event.source && event.data.type === 'windowReady') {
                    me.draw();
                }
            });
        }

        IoCTree.prototype.updateData = function () {
            var components = this.ioc.getComponentConfig();
            this.nodes = Object.keys(components).map(function (node) {
                return {id: node};
            });

            var process = function (type, source, deps) {
                deps.forEach(function (dep) {
                    this.links.push({
                        source: source,
                        target: findIndexById(this.nodes, dep),
                        relation: type
                    })
                }, this);
            };

            this.nodes.forEach(function (node, index) {
                var config = this.ioc.getComponentConfig(node.id);
                process.call(this, 'arg', index, config.argDeps || []);
                process.call(this, 'setter(auto)', index, config.setterDeps || []);
                process.call(this, 'property', index, config.propDeps || []);
                // TODO: import 配置需要再考虑下怎么展示
                //process.call(this, 'import', index, config.anonyDeps || []);
            }, this);

        };

        IoCTree.prototype.draw = function () {
            this.updateData();
            if (!this.drawWindow || this.drawWindow.closed) {
                this.drawWindow = window.open(require.toUrl('./draw/draw.html'));
            }
            else {
                this.drawWindow.postMessage({
                    nodes: this.nodes,
                    links: this.links
                }, '*');
            }
            this.drawWindow.focus();
        };

        IoCTree.getInstance = function (ioc) {
            this._instance = this._instance || new IoCTree(ioc);
            return this._instance;
        };

        function findIndexById(arr, id) {
            var result = -1;
            arr.some(function (item, index) {
                if (id === item.id) {
                    result = index;
                    return true;
                }
            });

            return result;
        }

        return IoCTree;
    }
);