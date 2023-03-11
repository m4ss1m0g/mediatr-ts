import type IDispatcher from "@/interfaces/idispatcher";
import type IResolver from "@/interfaces/iresolver";
import Dispatcher from "@/models/dispatcher";
import Resolver from "@/models/resolver";

/**
 * Contains the settings for the MediatR lib
 *
 * @class MediatrSettings
 */
class MediatrSettings {
    /**
     * The resolver instance
     * (default - Internal container)
     * @type {IResolver}
     * @memberof MediatrSettings
     */
    resolver: IResolver;

    /**
     * The dispatcher instance
     * (default - Internal dispatcher )
     * @type {IDispatcher}
     * @memberof MediatrSettings
     */
    dispatcher: IDispatcher;

    constructor() {
        this.resolver = new Resolver();
        this.dispatcher = new Dispatcher();
    }
}

const mediatorSettings = new MediatrSettings();
export default mediatorSettings;