

/**
 * @author PureMVC JS Native Port by Sönke Kluth
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 *
 * @class Controller
 *
 * In PureMVC, the Controller class follows the 'Command and Controller'
 * strategy, and assumes these responsibilities:
 *
 * - Remembering which
 * {@link SimpleCommand SimpleCommand}s
 * or
 * {@link MacroCommand MacroCommand}s
 * are intended to handle which
 * {@link Notification Notification}s
 * - Registering itself as an
 * {@link Observer Observer} with
 * the {@link View View} for each
 * {@link Notification Notification}
 * that it has an
 * {@link SimpleCommand SimpleCommand}
 * or {@link MacroCommand MacroCommand}
 * mapping for.
 * - Creating a new instance of the proper
 * {@link SimpleCommand SimpleCommand}s
 * or
 * {@link MacroCommand MacroCommand}s
 * to handle a given
 * {@link Notification Notification}
 * when notified by the
 * {@link View View}.
 * - Calling the command's execute method, passing in the
 * {@link Notification Notification}.
 *
 * Your application must register
 * {@link SimpleCommand SimpleCommand}s
 * or {@link MacroCommand MacroCommand}s
 * with the Controller.
 *
 * The simplest way is to subclass
 * {@link Facade Facade},
 * and use its
 * {@link Facade#initializeController initializeController}
 * method to add your registrations.
 *
 * @constructor
 * This Controller implementation is a Multiton, so you should not call the
 * constructor directly, but instead call the static #getInstance factory method,
 * passing the unique key for this instance to it.
 * @param {string} key
 * @throws {Error}
 *  If instance for this Multiton key has already been constructed
 */

import Notification from '../patterns/observer/Notification';
import Observer from '../patterns/observer/Observer';
import View from './View';

export default class Controller {

  /**
   * Multiton key to Controller instance mappings
   *
   * @static
   * @protected
   * @type {Object}
   */
  static instanceMap: Object = {};


  /**
   * @ignore
   *
   * Message constants
   * @static
   * @protected
   * @type {string}
   */
  static MULTITON_MSG: string = 'controller key for this Multiton key already constructed';

  /**
   * Local reference to the Controller's View
   *
   * @protected
   * @type {View}
   */
  view: View;

  /**
   * The Controller's multiton key
   *
   * @protected
   * @type {string}
   */
  multitonKey: string;


  /**
   * Note name to command constructor mappings
   *
   * @protected
   * @type {Object}
   */
  commandMap: Object = {};


  constructor(key: string) {
    if (Controller.instanceMap[key]) {
      throw new Error(Controller.MULTITON_MSG);
    }


    /**
     * The Controller's multiton key
     *
     * @protected
     * @type {string}
     */
    this.multitonKey = key;

    Controller.instanceMap[this.multitonKey] = this;

    this.initializeController();
  }

  /**
   * @protected
   *
   * Initialize the multiton Controller instance.
   *
   * Called automatically by the constructor.
   *
   * Note that if you are using a subclass of View
   * in your application, you should *also* subclass Controller
   * and override the initializeController method in the
   * following way.
   *
   *     MyinitializeController ()
   *     {
   *         this.view= MyView.getInstance(this.multitonKey);
   *     };
   *
   * @return {void}
   */

  initializeController(): void {
    this.view = View.getInstance(this.multitonKey);
  }

  /**
   * The Controllers multiton factory method.
   * Note that this method will return null if supplied a null
   * or undefined multiton key.
   *
   * @param {string} key
   *  A Controller's multiton key
   * @return {Controller}
   *  the Multiton instance of Controller
   */
  static getInstance(key: string): Controller {
    if (!key) {
      return null;
    }

    if (!Controller.instanceMap[key]) {
      return new Controller(key);
    }

    return Controller.instanceMap[key];
  }

  /**
   * If a SimpleCommand or MacroCommand has previously been registered to handle
   * the given Notification then it is executed.
   *
   * @param {Notification} note
   * @return {void}
   */
  executeCommand(note: Notification): void {
    if (!note) {
      return;
    }
    const CommandClassRef: Class = this.commandMap[note.getName()];
    if (!CommandClassRef) {
      return;
    }

    const commandInstance = new CommandClassRef();
    commandInstance.initializeNotifier(this.multitonKey);
    commandInstance.execute(note);
  }

  /**
   * Register a particular SimpleCommand or MacroCommand class as the handler for
   * a particular Notification.
   *
   * If an command already been registered to handle Notifications with this name,
   * it is no longer used, the new command is used instead.
   *
   * The Observer for the new command is only created if this the irst time a
   * command has been regisered for this Notification name.
   *
   * @param {string} notificationName
   *  the name of the Notification
   * @param {Function} CommandClassRef
   *  a command constructor
   * @return {void}
   */
  addCommand(notificationName: string, CommandClassRef: Class): void {
    if (!this.commandMap[notificationName]) {
      this.view.registerObserver(notificationName, new Observer(this.executeCommand, this));
    }

    this.commandMap[notificationName] = CommandClassRef;
  }

  /**
   * Check if a command is registered for a given Notification
   *
   * @param {string} notificationName
   * @return {boolean}
   *  whether a Command is currently registered for the given notificationName.
   */
  hasCommand(notificationName: string): boolean {
    return !!this.commandMap[notificationName];
  }

  /**
   * Remove a previously registered command to
   * {@link Notification Notification}
   * mapping.
   *
   * @param {string} notificationName
   *  the name of the Notification to remove the command mapping for
   * @return {void}
   */
  removeCommand(notificationName: string): void {
    if (this.hasCommand(notificationName)) {
      this.view.removeObserver(notificationName, this);
      delete this.commandMap[notificationName];
    }
  }

  /**
   * @static
   * Remove a Controller instance.
   *
   * @param {string} key
   *  multitonKey of Controller instance to remove
   * @return {void}
   */
  static removeController(key: string): void {
    delete this.instanceMap[key];
  }

}
