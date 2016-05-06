///<reference path="EventDispatcher.ts" />
module lilbits {
    //State class to detect changes
    export class State extends EventDispatcher {
        //require get/set access in order to properly 
        private data: any;
        private oldData: any;

        private id: string;

        //private updateRate: number;
        //private updateRef: number;

        constructor(initialValue: any) {
            
            super();
            this.set(initialValue);
            
        }
        
        cacheAs(myId : string) {
            this.id = myId;
            try {
                var cachedData: any = JSON.parse(localStorage[this.id]);
                this.oldData = this.data = cachedData;
                super.dispatch("change", this);
            } catch (e) {
                //undefined cachedData or unreadable cachedData. Do nothing.
            }
        }

        set(d: any | Promise<any>): void | Promise<any> {
            if (d.then) {
                return d.then((x : any) => {
                    this.data = x;
                    this.handleChanges();
                    return x;
                });
            } else {
                this.data = d;
                this.handleChanges();
            }
        }

        handleChanges(): void {
            if (this.data !== this.oldData) {
                if (this.id) {
                    localStorage[this.id] = JSON.stringify(this.data);
                }
                super.dispatch("change", this);
            }
            this.oldData = this.data;
        }


        get(): any {
            return this.data;
        }
        value: () => any = this.get;
    }


}
