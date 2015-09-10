define(
    function (require) {
        function empty() {

        }

        var IoC = require('uioc');
        return new IoC({
            components: {
                a: {
                    creator: empty,
                    args: [{$ref: 'b'}, {$ref: 'c'}]
                },
                b: {
                    creator: empty,
                    args: [{$ref: 'c'}],
                    properties: {
                        c: {
                            $ref: 'c'
                        }
                    }
                },
                c: {
                    creator: empty
                }
            }
        });
    }
);