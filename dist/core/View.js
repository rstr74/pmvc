'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _Observer = require('../patterns/observer/Observer');

var _Observer2 = _interopRequireDefault(_Observer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 *
 * @class puremvc.View
 *
 * A Multiton View implementation.
 *
 * In PureMVC, the View class assumes these responsibilities
 *
 * - Maintain a cache of {@link puremvc.Mediator Mediator}
 *   instances.
 *
 * - Provide methods for registering, retrieving, and removing
 *   {@link puremvc.Mediator Mediator}.
 *
 * - Notifiying {@link puremvc.Mediator Mediator} when they are registered or
 *   removed.
 *
 * - Managing the observer lists for each {@link puremvc.Notification Notification}
 *   in the application.
 *
 * - Providing a method for attaching {@link puremvc.Observer Observer} to an
 *   {@link puremvc.Notification Notification}'s observer list.
 *
 * - Providing a method for broadcasting a {@link puremvc.Notification Notification}.
 *
 * - Notifying the {@link puremvc.Observer Observer}s of a given
 *   {@link puremvc.Notification Notification} when it broadcast.
 *
 * This View implementation is a Multiton, so you should not call the
 * constructor directly, but instead call the static Multiton
 * Factory #getInstance method.
 *
 * @param {string} key
 * @constructor
 * @throws {Error}
 *  if instance for this Multiton key has already been constructed
 */

var View = function () {

  /**
   * Remove a View instance
   *
   * @return {void}
   */
  View.removeView = function removeView(key) {
    delete View.instanceMap[key];
  };

  /**
   * @ignore
   * The internal map used to store multiton View instances
   *
   * @type Array
   * @protected
   */


  /**
   * @ignore
   * The error message used if an attempt is made to instantiate View directly
   *
   * @type string
   * @protected
   * @const
   * @static
   */


  /**
   * @ignore
   * The Views internal mapping of mediator names to mediator instances
   *
   * @type Array
   * @protected
   */


  /**
   * @ignore
   * The Views internal mapping of Notification names to Observer lists
   *
   * @type Array
   * @protected
   */


  /**
   * @ignore
   * The Views internal multiton key.
   *
   * @type string
   * @protected
   */

  function View(key) {
    _classCallCheck(this, View);

    this.mediatorMap = {};
    this.observerMap = {};
    this.multitonKey = null;

    if (View.instanceMap[key]) {
      throw new Error(View.MULTITON_MSG);
    }

    this.multitonKey = key;
    View.instanceMap[this.multitonKey] = this;
    this.initializeView();
  }

  /**
   * @protected
   * Initialize the Singleton View instance
   *
   * Called automatically by the constructor, this is your opportunity to
   * initialize the Singleton instance in your subclass without overriding the
   * constructor
   *
   * @return {void}
   */


  View.prototype.initializeView = function initializeView() {
    return this;
  };

  /**
   * View Singleton Factory method.
   * Note that this method will return null if supplied a null
   * or undefined multiton key.
   *
   * @return {puremvc.View}
   *  The Singleton instance of View
   */


  View.getInstance = function getInstance(key) {
    if (!key) {
      return null;
    }

    if (!View.instanceMap[key]) {
      return new View(key);
    }

    return View.instanceMap[key];
  };

  /**
   * Register an Observer to be notified of Notifications with a given name
   *
   * @param {string} notificationName
   *  The name of the Notifications to notify this Observer of
   * @param {puremvc.Observer} observer
   *  The Observer to register.
   * @return {void}
   */


  View.prototype.registerObserver = function registerObserver(notificationName, observer) {
    if (!this.observerMap[notificationName]) {
      this.observerMap[notificationName] = [];
    }
    this.observerMap[notificationName].push(observer);

    return this;
  };

  /**
   * Notify the Observersfor a particular Notification.
   *
   * All previously attached Observers for this Notification's
   * list are notified and are passed a reference to the INotification in
   * the order in which they were registered.
   *
   * @param {puremvc.Notification} notification
   *  The Notification to notify Observers of
   * @return {void}
   */


  View.prototype.notifyObservers = function notifyObservers(notification) {
    if (this.observerMap[notification.getName()]) {
      // Get a reference to the observers list for this notification name
      var observerArray = this.observerMap[notification.getName()];

      // Copy observers from reference array to working array,
      // since the reference array may change during the notification loop
      var observers = [];
      var observer = void 0;
      var i = void 0;
      for (i = 0; i < observerArray.length; i++) {
        observer = observerArray[i];
        observers.push(observer);
      }

      // Notify Observers from the working array
      for (i = 0; i < observers.length; i++) {
        observer = observers[i];
        observer.notifyObserver(notification);
      }
    }

    return this;

    // var observers = this.observerMap[notification.getName()];
    // if (observers && observers.length) {
    //   var i = -1;
    //   while (++i < observers.length) {
    //     observers[i].notifyObserver(notification);
    //   }
    // }


    // for (var i = 0; i < observerArray.length; i++) {
    //   observer = observerArray[i];
    //   observers.push(observer);
    // }

    // for (var i = 0; i < observers.length; i++) {
    //   observer = observers[i];
    //   observer.notifyObserver(notification);
    // }
  };

  /**
   * Remove the Observer for a given notifyContext from an observer list for
   * a given Notification name
   *
   * @param {string} notificationName
   *  Which observer list to remove from
   * @param {Object} notifyContext
   *  Remove the Observer with this object as its notifyContext
   * @return {void}
   */


  View.prototype.removeObserver = function removeObserver(notificationName, notifyContext) {
    // SIC
    var observers = this.observerMap[notificationName];
    for (var i = 0; i < observers.length; i++) {
      if (observers[i].compareNotifyContext(notifyContext) === true) {
        observers.splice(i, 1);
        break;
      }
    }

    if (observers.length === 0) {
      delete this.observerMap[notificationName];
    }

    return this;
  };

  /**
   * Register a Mediator instance with the View.
   *
   * Registers the Mediator so that it can be retrieved by name,
   * and further interrogates the Mediator for its
   * {@link puremvc.Mediator#listNotificationInterests interests}.
   *
   * If the Mediator returns any Notification
   * names to be notified about, an Observer is created encapsulating
   * the Mediator instance's
   * {@link puremvc.Mediator#handleNotification handleNotification}
   * method and registering it as an Observer for all Notifications the
   * Mediator is interested in.
   *
   * @param {puremvc.Mediator}
   *  a reference to the Mediator instance
   */


  View.prototype.registerMediator = function registerMediator(mediator) {
    if (this.mediatorMap[mediator.getMediatorName()]) {
      return this;
    }

    mediator.initializeNotifier(this.multitonKey);
    // register the mediator for retrieval by name
    this.mediatorMap[mediator.getMediatorName()] = mediator;

    // get notification interests if any
    var interests = mediator.listNotificationInterests();

    // register mediator as an observer for each notification
    if (interests.length > 0) {
      // create observer referencing this mediators handleNotification method
      var observer = new _Observer2.default(mediator.handleNotification, mediator);
      for (var i = 0; i < interests.length; i++) {
        this.registerObserver(interests[i], observer);
      }
    }

    mediator.onRegister();

    return this;
  };

  /**
   * Retrieve a Mediator from the View
   *
   * @param {string} mediatorName
   *  The name of the Mediator instance to retrieve
   * @return {puremvc.Mediator}
   *  The Mediator instance previously registered with the given mediatorName
   */


  View.prototype.retrieveMediator = function retrieveMediator(mediatorName) {
    return this.mediatorMap[mediatorName];
  };

  /**
   * Remove a Mediator from the View.
   *
   * @param {string} mediatorName
   *  Name of the Mediator instance to be removed
   * @return {puremvc.Mediator}
   *  The Mediator that was removed from the View
   */


  View.prototype.removeMediator = function removeMediator(mediatorName) {
    var mediator = this.mediatorMap[mediatorName];
    if (mediator) {
      // for every notification the mediator is interested in...
      var interests = mediator.listNotificationInterests();
      for (var i = 0; i < interests.length; i++) {
        // remove the observer linking the mediator to the notification
        // interest
        this.removeObserver(interests[i], mediator);
      }

      // remove the mediator from the map
      delete this.mediatorMap[mediatorName];

      // alert the mediator that it has been removed
      mediator.onRemove();
    }

    return mediator;
  };

  /**
   * Check if a Mediator is registered or not.
   *
   * @param {string} mediatorName
   * @return {boolean}
   *  Whether a Mediator is registered with the given mediatorname
   */


  View.prototype.hasMediator = function hasMediator(mediatorName) {
    return !!this.mediatorMap[mediatorName];
  };

  return View;
}();

View.instanceMap = {};
View.MULTITON_MSG = 'View instance for this Multiton key already constructed!';
exports.default = View;
module.exports = exports['default'];