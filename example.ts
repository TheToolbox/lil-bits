///<reference path="src/lil-bits.ts" />
module HomePage {
    "use strict";



    export var menus: wdk.DOMSelection = new wdk.DOMSelection(".menu");
    menus.bindView(Views['menu']).noState();

    export var greetings: wdk.DOMSelection = new wdk.DOMSelection('.greeting');
    greetings.bindView(Views['greeting']).bindState(new wdk.State(''));

    window.addEventListener('hashchange', startModules);

    function startModules(hashEvent: HashChangeEvent) {
        
    }

    var components: { [index: string]: Component } = {};


    //components['ApiDocs'] = new Component;






    
}
