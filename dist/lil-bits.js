var lilbits;
(function (lilbits) {
    class EventDispatcher {
        constructor() {
            this.callbacks = {};
        }
        on(event, callback) {
            if (!(event in this.callbacks)) {
                this.callbacks[event] = [];
            }
            this.callbacks[event].push(callback);
        }
        off(event, callback) {
            if (event in this.callbacks) {
                delete this.callbacks[event][this.callbacks[event].indexOf(callback)];
            }
        }
        dispatch(event, data) {
            for (var i in this.callbacks[event]) {
                this.callbacks[event][i](data);
            }
        }
    }
    lilbits.EventDispatcher = EventDispatcher;
})(lilbits || (lilbits = {}));
var lilbits;
(function (lilbits) {
    "use strict";
    ;
})(lilbits || (lilbits = {}));
///<reference path="EventDispatcher.ts" />
var lilbits;
(function (lilbits) {
    //State class to detect changes
    class State extends lilbits.EventDispatcher {
        constructor(initialValue) {
            super();
            this.value = this.get;
            this.set(initialValue);
        }
        cacheAs(myId) {
            this.id = myId;
            try {
                var cachedData = JSON.parse(localStorage[this.id]);
                this.oldData = this.data = cachedData;
                super.dispatch("change", this);
            }
            catch (e) {
            }
        }
        set(d) {
            if (d.then) {
                return d.then((x) => {
                    this.data = x;
                    this.handleChanges();
                    return x;
                });
            }
            else {
                this.data = d;
                this.handleChanges();
            }
        }
        handleChanges() {
            if (this.data !== this.oldData) {
                if (this.id) {
                    localStorage[this.id] = JSON.stringify(this.data);
                }
                super.dispatch("change", this);
            }
            this.oldData = this.data;
        }
        get() {
            return this.data;
        }
    }
    lilbits.State = State;
})(lilbits || (lilbits = {}));
///<reference path="State.ts" />
///<reference path="View.ts" />
var lilbits;
(function (lilbits) {
    var emptyState = new lilbits.State('');
    class DOMSelection extends lilbits.EventDispatcher {
        constructor(sel) {
            super();
            this.selection = [];
            this.selectors = [];
            //convert to array
            this.add(sel);
        }
        add(sel) {
            if (typeof sel === "string") {
                this.selection = this.selection.concat(Array.prototype.slice.call(document.querySelectorAll(sel)));
                this.selectors.push(sel);
            }
            else if (typeof sel === "object" && "nodeType" in sel) {
                this.selection.push(sel); //must be Element
            }
            else {
                this.selection.push(Array.prototype.slice.call(sel));
            }
            return this;
        }
        update() {
            for (var i in this.selectors) {
                var newRoots = document.querySelectorAll(this.selectors[i]);
                for (var j in newRoots) {
                    if (this.selection.indexOf(newRoots[j]) < 0) {
                        this.selection.push(newRoots[j]);
                    }
                }
            }
            return this;
        }
        bindView(v) {
            if (!v) {
                throw new Error("Cannot bind empty view...");
            }
            this.view = v;
            if (this.state) {
                this.render();
            }
            return this;
        }
        noState() {
            this.bindState(emptyState);
            return this;
        }
        bindState(s) {
            if (!s) {
                throw new Error("Cannot bind empty state...");
            }
            if (this.state) {
                this.state.off('change', this.render.bind(this));
            }
            ;
            this.state = s;
            this.state.on('change', this.render.bind(this));
            if (this.view) {
                this.render();
            }
            return this;
        }
        render() {
            for (var i in this.selection) {
                this.selection[i].innerHTML = this.view(this.state.value());
            }
            return this;
        }
    }
    lilbits.DOMSelection = DOMSelection;
})(lilbits || (lilbits = {}));
///<reference path="EventDispatcher.ts" />
///<reference path="View.ts" />
///<reference path="State.ts" />
///<reference path="DOMSelection.ts" />
////<reference path="Component.ts" /> 
//# sourceMappingURL=lil-bits.js.map