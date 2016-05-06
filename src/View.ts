module lilbits {
    "use strict";
    export interface View {
        (context: any): string
    };
    
}
declare var Views : {[index: string]: lilbits.View};
