# APC UPS SNMP 

Library for reading values of APC UPS battery via the network.


## Installation

```
npm install apc-ups-snmp
```


## Usage

```javascript
var apcUps = require('apc-ups-snmp');

var ups = new apcUps({
  host: '' // IP Address/Hostname
});


ups.getAll((err, results) =>
{
  console.log(results);
});
```


## Result array

Note that in the web GUI a number of values are reported with 1-2 decimal places. The SNMP implementation by APC does not support decimals.

| Key | Value |
| --- | --- |
| model | Get the UPS Model number, eg 'Smart-UPS 2200 RM' |
| temperature | Get the internal temperature of the UPS. |
| inputVoltage | Get the input voltage. |
| inputFrequency | Get the input frequency. |
| outputVoltage | Get the output voltage. |
| outputFrequency | Get the output frequency. |
| outputLoadPercentage | Get the output load percentage. |
| outputLoad | Get the output in amps. |
| batteryCapacity | Get the battery capacity percentage. |
| batteryStatus | Get the battery status. |
| batteryRunTime | Get the battery runtime remaining in minutes. |
| lastFailCause | Get the reason for last transfer to battery power. |
| batteryReplaceIndicator | Get the battery replacement indicator. |
| lastDiagnosticsTestDate | Get date self diagnostics was last run. |
| lastDiagnosticsTestResult | Get the last self diagnostics result. |

## Integer value translations

Some keys are represented as integer values. See the below tables to find the associated values. These are also defined in the `ups.status` object.

### batteryStatus

|Status|Translation|
|------|-----------|
|1|unknown|
|2|batteryNormal|
|3|batteryLow|
|4|batteryInFaultCondition|

### lastFailCause

|Fail Cause|Translation|
|----------|-----------|
|1|noTransfer|
|2|highLineVoltage|
|3|brownout|
|4|blackout|
|5|smallMomentarySag|
|6|deepMomentarySag|
|7|smallMomentarySpike|
|8|largeMomentarySpike|
|9|selfTest|
|10|rateOfVoltageChange|

### batteryReplaceIndicator

|Indicator|Translation|
|---------|-----------|
|1|noBatteryNeedsReplacing|
|2|batteryNeedsReplacing|

### lastDiagnosticsTestResult

|Result|Translation|
|------|-----------|
|1|ok|
|2|failed|
|3|invalidTest|
|4|testInProgress|

## Notes

This was based on https://github.com/phillipsnick/apc-ups-snmp. Thanks for your work, Nick Phillips!

All the MIBs have been hard coded into this module, for more details see the PowerNet-MIB at ftp://ftp.apc.com/apc/public/software/pnetmib/mib/411/powernet411.mib


## Licence

[The MIT License (MIT)](https://github.com/phillipsnick/apc-ups-snmp/blob/master/LICENSE)
