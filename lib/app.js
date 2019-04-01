var snmp = require('net-snmp');

/**
 * Create the SNMP session
 *
 * @param   object  options
 */
function ups(options) {
  this.options = options;

  if (typeof options.host === "undefined") {
    throw "Please define a host";
  }

  this.session = snmp.createSession(this.options.host, "private", {
    version: snmp.Version1,
    timeout: parseInt(this.options.timeout) || 5000
  });
  
  this.oids = {
    '1.3.6.1.4.1.318.1.1.1.1.1.1.0': 'model',
    '1.3.6.1.4.1.318.1.1.1.2.2.2.0': 'temperature',
    '1.3.6.1.4.1.318.1.1.1.3.2.1.0': 'inputVoltage',
    '1.3.6.1.4.1.318.1.1.1.3.2.4.0': 'inputFrequency',
    '1.3.6.1.4.1.318.1.1.1.4.2.1.0': 'outputVoltage',
    '1.3.6.1.4.1.318.1.1.1.4.2.2.0': 'outputFrequency',
    '1.3.6.1.4.1.318.1.1.1.4.2.3.0': 'outputLoadPercentage',
    '1.3.6.1.4.1.318.1.1.1.4.2.4.0': 'outputLoad',
    '1.3.6.1.4.1.318.1.1.1.2.2.1.0': 'batteryCapacity',
    '1.3.6.1.4.1.318.1.1.1.2.1.1.0': 'batteryStatus',
    '1.3.6.1.4.1.318.1.1.1.2.2.3.0': 'batteryRunTime',
    '1.3.6.1.4.1.318.1.1.1.3.2.5.0': 'lastFailCause',
    '1.3.6.1.4.1.318.1.1.1.2.2.4.0': 'batteryReplaceIndicator',
    '1.3.6.1.4.1.318.1.1.1.7.2.4.0': 'lastDiagnosticsTestDate',
    '1.3.6.1.4.1.318.1.1.1.7.2.3.0': 'lastDiagnosticsTestResult'
  };
}

module.exports = ups;

ups.status = {};

/**
 * Battery status' int to string
 */
ups.status.batteryStatus = {
  1: 'unknown',
  2: 'batteryNormal',
  3: 'batteryLow',
  4: 'batteryInFaultCondition'
}

/**
 * Reasons for last fail cause
 */
ups.status.lastFailCause = {
  1: 'noTransfer',
  2: 'highLineVoltage',
  3: 'brownout',
  4: 'blackout',
  5: 'smallMomentarySag',
  6: 'deepMomentarySag',
  7: 'smallMomentarySpike',
  8: 'largeMomentarySpike',
  9: 'selfTest',
  10: 'rateOfVoltageChange'
}

/**
 * Battery indicator
 */
ups.status.batteryReplaceIndicator = {
  1: 'noBatteryNeedsReplacing',
  2: 'batteryNeedsReplacing'
}

/**
 * Diagnostics test results
 */
ups.status.lastDiagnosticsTestResult = {
  1: 'ok',
  2: 'failed',
  3: 'invalidTest',
  4: 'testInProgress'
}

/**
 * Get all oids
 *
 * @param   function  callback
 */
ups.prototype.getAll = function(callback)
{
  var oids = this.oids;

  this.session.get(Object.keys(oids), function(err, varbinds)
  {
    if (err)
    {
      callback(err);
      return;
    }
    var results = {};
    varbinds.forEach(function(res)
    {
      var prop = oids[res.oid];
      var val = res.value;
      if(typeof val == 'object')
        val = val.toString();
      if(ups.status[prop])
        val = ups.status[prop][val];
      results[prop] = val;
    });
    callback(null, results);
  });
}

/**
 * Get the SNMP session as created by net-snmp library
 */
ups.prototype.getSnmpSession = function() {
  return this.session;
}

/**
 * Close the SNMP session as provided by net-snmp library
 */
ups.prototype.close = function() {
  this.session.close();
}