// Homey App for Byron DBY series doorbells

// Author: Erwin Dondorp
// E-Mail: byrondby@dondorp.com

'use strict';

const Homey = require('homey');

// remember when the bells last sounded
// so that we don't trigger too often
// and so that we can help with pairing
const Global = require('../drivers/global.js');
Global.allLastRings = {};

let buttonPressedTriggerGeneric = new Homey.FlowCardTrigger('receive_signal_generic');
buttonPressedTriggerGeneric.register();

//let buttonPressedTriggerPaired = new Homey.FlowCardTrigger('receive_signal_paired');
//buttonPressedTriggerPaired.register();

// create & register a signal using the id from your app.json
let byronDbySignal = new Homey.Signal433('ByronDbySignal');
byronDbySignal.register()
	.then(() => {
		console.log("byronDbySignal.register.then");

		byronDbySignal.on('payload', function(payload, first) {
			//console.log('received: signal:[' + payload + '], first:' + first);

			// take the relevant groups of bits
			var buttonBits = payload.slice(0, 32);

			// get the values from the bit-patterns
			var buttonId =
				buttonBits[0] * 2147483648 +
				buttonBits[1] * 1073741824 +
				buttonBits[2] * 536870912 +
				buttonBits[3] * 268435456 +
				buttonBits[4] * 134217728 +
				buttonBits[5] * 67108864 +
				buttonBits[6] * 33554432 +
				buttonBits[7] * 16777216 +
				buttonBits[8] * 8388608 +
				buttonBits[9] * 4194304 +
				buttonBits[10] * 2097152 +
				buttonBits[11] * 1048576 +
				buttonBits[12] * 524288 +
				buttonBits[13] * 262144 +
				buttonBits[14] * 131072 +
				buttonBits[15] * 65536 +
				buttonBits[16] * 32768 +
				buttonBits[17] * 16384 +
				buttonBits[18] * 8192 +
				buttonBits[19] * 4096 +
				buttonBits[20] * 2048 +
				buttonBits[21] * 1024 +
				buttonBits[22] * 512 +
				buttonBits[23] * 256 +
				buttonBits[24] * 128 +
				buttonBits[25] * 64 +
				buttonBits[26] * 32 +
				buttonBits[27] * 16 +
				buttonBits[28] * 8 +
				buttonBits[29] * 4 +
				buttonBits[20] * 2 +
				buttonBits[31] * 1;

			// Controller seems to return multiple events with "first=true"
			// Therefore we use our own mechanism
			// Administation is per buttonId
			var now = Date.now();
			var lastRing = Global.allLastRings[buttonId];
			if(lastRing === undefined)
				lastRing = {"dateTime":0};
			var millis = now - lastRing.dateTime;
			if(millis < 5000)
			{
				// Accept only one ring within 5 seconds
				// console.log('IGNORED button: [' + buttonBits + ']=' + buttonId + ', first: " + first);
				return;
			}

			Global.allLastRings[buttonId] = {"dateTime":now};

			console.log('buttonId: [' + buttonBits + ']=' + buttonId);

			var tokensGeneric = {
				'buttonId': buttonId
				};
			var stateGeneric = {
				};
			buttonPressedTriggerGeneric
				.trigger(tokensGeneric, stateGeneric)
				.catch(this.error)
				.then(this.log);

			// pairing not supported yet
			//var tokensPaired = {
				//'buttonId': buttonId
				//};
			//var statePaired = {
				//};
			//buttonPressedTriggerPaired
				//.trigger(tokensPaired, statePaired)
				//.catch(this.error)
				//.then(this.log);
		})
})
.catch(this.error);

// sending not supported yet
//let ringBellActionIdGeneric = new Homey.FlowCardAction('send_ring_generic');
//ringBellActionIdGeneric.register();

// sending not supported yet
// pairing not supported yet
//let ringBellActionIdPaired = new Homey.FlowCardAction('send_ring_paired');
//ringBellActionIdPaired.register();

function getBits(buttonId)
{
	// +256 to force fixed length of 9 bits
	// then use bits 1..8 (but not bit 0)
	var buttonIdBits = (buttonId + 256).toString(2);
	return [
			parseInt(buttonIdBits[1]),
			parseInt(buttonIdBits[2]),
			parseInt(buttonIdBits[3]),
			parseInt(buttonIdBits[4]),
			parseInt(buttonIdBits[5]),
			parseInt(buttonIdBits[6]),
			parseInt(buttonIdBits[7]),
			parseInt(buttonIdBits[8])
			];
}

class ByronDbyDoorbell extends Homey.App {

	logit(err, result) {
		console.log("err: " + err + ", result: " + result);
	}

	onInit() {
		this.log("ByronDbyDoorbell.onInit");

		// sending not supported yet
		//ringBellActionIdGeneric.registerRunListener((args, state) => {
			//var buttonId = args['buttonId']
			//this.log('RING-ID-GENERIC: buttonId:' + buttonId);
			//var bits = getBits(buttonId);
			//this.log("bits:", bits);
			//byronDbySignal.tx(bits, this.logit);
			//return true;
		//});

		// sending not supported yet
		// pairing not supported yet
		//ringBellActionIdPaired.registerRunListener((args, state) => {
			//var buttonId = parseInt(args['bell_id_paired'].getData()["buttonId"]);
			//this.log('RING-ID-PAIRED: buttonId:' + buttonId);
			//var bits = getBits(buttonId);
			//this.log("bits:", bits);
			//byronDbySignal.tx(bits, this.logit);
			//return true;
		//});

		this.log('ByronDbyDoorbell is running...');
	}
}

module.exports = ByronDbyDoorbell;

// vim:ts=4
