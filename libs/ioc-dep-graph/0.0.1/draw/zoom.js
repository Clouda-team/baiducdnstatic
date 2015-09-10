define(
    function () {
        var highlightSourceColor = '#18ffff';
        var highlightTargetColor = '#7fff00';
        var highlightTextColor = '#f40';
        var focusNode = null;

        window.zoom = {
            run: function (force, svg, g, nodeCircle, nodeText, edgesText, edgesLine, links) {
                var w = window.innerWidth;
                var h = window.innerHeight;
                links.forEach(function (d) {
                    this.linkedByIndex[d.source.index + ',' + d.target.index] = true;
                }, this);

                var zoom = d3.behavior.zoom().scaleExtent([0.1, 7]);
                zoom.on('zoom', function () {
                    g.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
                });

                nodeCircle
                    .on('dblclick.zoom', function (d) {
                        d3.event.stopPropagation();
                        var dcx = (window.innerWidth / 2 - d.x * zoom.scale());
                        var dcy = (window.innerHeight / 2 - d.y * zoom.scale());
                        zoom.translate([dcx, dcy]);
                        g.attr('transform', 'translate(' + dcx + ',' + dcy + ')scale(' + zoom.scale() + ')');
                    })
                    .on('mousedown', function (d) {
                        d3.event.stopPropagation();
                        if (focusNode) {
                            resetFocus.call(this, focusNode);
                            resetColor.call(this, focusNode);
                        }

                        if (focusNode === d) {
                            focusNode = null;
                        }
                        else {
                            focusNode = d;
                            highlight.call(this, d);
                            setFocus.call(this, d);
                        }
                    }.bind(this))
                    .on('mouseover', function (d) {
                        if (focusNode) {
                            return;
                        }
                        highlight.call(this, d)
                    }.bind(this))
                    .on('mouseout', function (d) {
                        if (focusNode) {
                            return;
                        }
                        resetColor.call(this, d)
                    }.bind(this));

                svg.call(zoom);

                function highlight(d) {
                    //显示连接线上的文字
                    edgesText.style('fill-opacity', function (edge) {
                        if (edge.source === d || edge.target === d) {
                            return 1.0;
                        }
                    });

                    // 高亮连接线
                    edgesLine.style('stroke', function (edge) {
                        if (edge.source === d) {
                            return highlightSourceColor;
                        }

                        if (edge.target === d) {
                            return highlightTargetColor;
                        }
                    });

                    // 高亮关联节点
                    nodeCircle.style('fill', function (node) {
                        var relation = this.getRelation(node, d);
                        if (relation === 'target') {
                            return highlightTargetColor;
                        }

                        if (relation === 'source') {
                            return highlightSourceColor;
                        }

                        if (relation === 'self') {
                            return '#f40';
                        }
                    }.bind(this));

                    // 高亮文字
                    nodeText.style('fill', function (node) {
                        if (node.id === d.id) {
                            return highlightTextColor;
                        }
                    });
                }

                function resetColor(d) {
                    //隐去连接线上的文字
                    edgesText.style('fill-opacity', function (edge) {
                        if (edge.source === d || edge.target === d) {
                            return 0.0;
                        }
                    });

                    edgesLine.style('stroke', function (edge) {
                        if (edge.source === d || edge.target === d) {
                            return '#888';
                        }
                    });

                    nodeCircle.style('fill', function (node) {
                        var relation = this.getRelation(node, d);
                        if (relation === 'target' || relation === 'source' || relation === 'self') {
                            return '#03a9f4';
                        }
                    }.bind(this));

                    nodeText.style('fill', function (node) {
                        if (node.id === d.id) {
                            return '#000';
                        }
                    });
                }

                function setFocus(d) {
                    nodeCircle.style('opacity', function (node) {
                        return this.getRelation(d, node) === 'unRelated' ? .1 : 1;
                    }.bind(this));

                    nodeText.style('opacity', function (node) {
                        return node.id === d.id ? 1 : .1;
                    });

                    edgesLine.style('opacity', function (edge) {
                        return edge.source.id == d.id || edge.target.id == d.id ? 1 : 0;
                    });
                }

                function resetFocus() {
                    nodeCircle.style('opacity', 1);
                    nodeText.style('opacity', 1);
                    edgesLine.style('opacity', 1);
                }

                d3.select(window).on('resize', resize);

                function resize() {
                    var width = window.innerWidth, height = window.innerHeight;
                    svg.attr('width', width).attr('height', height);

                    force.size([force.size()[0] + (width - w) / zoom.scale(), force.size()[1] + (height - h)
                    / zoom.scale()]).resume();
                    w = width;
                    h = height;
                }
            },
            linkedByIndex: {},
            getRelation: function isConnected(a, b) {
                if (this.linkedByIndex[a.index + ',' + b.index]) {
                    return 'target';
                }

                if (this.linkedByIndex[b.index + ',' + a.index]) {
                    return 'source';
                }

                if (a.index === b.index) {
                    return 'self';
                }

                return 'unRelated';
            }

        };
    }
);