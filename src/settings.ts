import IDispatcher from "@/interfaces/idispatcher";
import IResolver from "@/interfaces/iresolver";
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
    resolver: IResolver = new Resolver();

    /**
     * The dispatcher instance
     * (default - Internal dispatcher )
     * @type {IDispatcher}
     * @memberof MediatrSettings
     */
    dispatcher: IDispatcher = new Dispatcher();
}

export default new MediatrSettings();
