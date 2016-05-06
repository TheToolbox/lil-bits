///<reference path="State.ts" />
///<reference path="View.ts" />


module lilbits {
    var emptyState = new State('');
    
    export class DOMSelection extends EventDispatcher {
        private selection: Element[] = [];
        private selectors: string[] = [];
        private view: View;
        private state: State;

        constructor(sel: string) {
            super();
            //convert to array
            this.add(sel);
        }

        add(sel: string | NodeListOf<Element> | Element): DOMSelection {
            if (typeof sel === "string") {
                this.selection = this.selection.concat(
                    Array.prototype.slice.call(document.querySelectorAll(sel))
                );
                this.selectors.push(sel);
            } else if (typeof sel === "object" && "nodeType" in sel) {
                this.selection.push(<Element>sel); //must be Element
            } else {
                this.selection.push(Array.prototype.slice.call(<NodeListOf<Element>>sel));
            }
            return this;
        }

        update(): DOMSelection {
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

        bindView(v: View): DOMSelection {
            if (!v) { throw new Error("Cannot bind empty view..."); }
            this.view = v;
            if (this.state) {
                this.render();
            }
            return this;
        }

        noState(): DOMSelection {
            this.bindState(emptyState);
            return this;
        }

        bindState(s: State): DOMSelection {
            if (!s) { throw new Error("Cannot bind empty state..."); }
            if (this.state) { this.state.off('change', this.render.bind(this)) };
            this.state = s;
            this.state.on('change', this.render.bind(this));
            if (this.view) {
                this.render();
            }
            return this;
        }

        render(): DOMSelection {
            for (var i in this.selection) {
                this.selection[i].innerHTML = this.view(this.state.value());
            }
            return this;
        }
    }
}

