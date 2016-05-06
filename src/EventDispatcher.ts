module lilbits {
    export class EventDispatcher {
        private callbacks: { [id: string]: ((event: any) => void)[] } = {};
        on(event: string, callback: (event: any) => void): void {
            if (!(event in this.callbacks)) { this.callbacks[event] = []; }
            this.callbacks[event].push(callback);
        }

        off(event: string, callback: (event: any) => void): void {
            if (event in this.callbacks) {
                delete this.callbacks[event][this.callbacks[event].indexOf(callback)];
            }
        }

        protected dispatch(event: string, data: any) {
            for (var i in this.callbacks[event]) {
                this.callbacks[event][i](data);
            }
        }
    }
}
