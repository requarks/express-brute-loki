"use strict";

/**
 * EXPRESS-BRUTE-LOKI
 * A Loki.js session store for express-brute
 * MIT Licensed
 */

var AbstractClientStore = require('express-brute/lib/AbstractClientStore'),
 		lokijs = require('lokijs'),
		util = require('util'),
    		moment = require('moment'),
		_ = require('lodash');

var LokiStore = module.exports = function (options) {

	AbstractClientStore.apply(this, arguments);

	let self = this;

	this.autosave = options.autosave || true;
	this.storePath = options.path || './brute-store.db';
	this.ttl = options.ttl || null;

	this.client = new lokijs(this.storePath, {
		env: 'NODEJS',
		autosave: self.autosave,
		autosaveInterval: 5000
	});

	// Setup error logging
		
	if(options.logErrors){
		if(typeof options.logErrors != 'function'){
			options.logErrors = function (err) {
				console.error('Warning: express-brute-loki reported a client error: ' + err);
			};
		}
		this.logger = options.logErrors;	
	} else {
		this.logger = _.noop;
	}

	// Get / Create collection

	this.client.loadDatabase({}, () => {
		self.collection = self.client.getCollection('Brute');
		if(_.isNil(self.collection)) {
			self.collection = self.client.addCollection('Brute', {
				indices: ['sid'],
				ttlInterval: self.ttl
			});
		}
		self.collection.on('error', (err) => {
			return self.logger(err);
		});
	});

};

LokiStore.prototype = Object.create(AbstractClientStore.prototype);

/**
 * Set / Update a bruteforce entry
 *
 * @param      {String}    key       The key
 * @param      {Object}    value     The value
 * @param      {Function}  lifetime  The lifetime in seconds
 * @param      {Function}  fn        The callback function
 * @return     {Void}  Void
 */
LokiStore.prototype.set = function (key, value, lifetime, fn) {
	if(!fn) { fn = _.noop; }

	lifetime = lifetime ? moment().add('seconds', lifetime).toDate() : null;

	let s = this.collection.find({ sid: key });

	if(s[0] && s[0].content) {
		s[0].content = value;
		s[0].expires = lifetime;
		this.collection.update(s[0]);
	} else {
		this.collection.insert({
			sid: key,
			content: value,
			expires: lifetime
		});
	}

	fn.apply(this, arguments);
};

/**
 * Get a bruteforce entry
 *
 * @param      {String}    key     The key
 * @param      {Function}  fn      The callback function
 * @return     {Void}    Void
 */
LokiStore.prototype.get = function (key, fn) {
	if(!fn) { fn = _.noop; }

	let s = this.collection.find({ sid: key });

	if(s[0] && s[0].content) {
		if(s[0].expires && s[0].expires < new Date()) {
			this.reset(key, null);
			return fn();
		}
		fn(null, s[0].content);
	} else {
		fn();
	}
};

/**
 * Remove bruteforce entry from list
 *
 * @param      {String}    key     The key
 * @param      {Function}  fn      The callback function
 * @return     {Void} Void
 */
LokiStore.prototype.reset = function (key, fn) {
	if(!fn) { fn = _.noop; }

	this.collection.remove({ sid: key });

	fn.apply(this, arguments);
};
