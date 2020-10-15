Homey app to receive signals from Byron DBY doorbell pushbuttons.

Most push buttons from the DBY series are supported.
The DBY25xxx series operates on a different frequency and is not supported (yet).

Install the app and add the App to a flow. You can use the generic Byron DBY application as a starting trigger. It will react on any signal that is received from a Byron DBY pushbutton.

When the card is added to the condition column, it detects a Byron DBY push button being pushed. 1 parameter is added to the trigger:
* buttonId:
Contains the internal ID of the button that is pushed. This is a number between 0 and 4.294.967.295. This number is assigned randomly to a push button once the battery is inserted. One pushbutton will usually generate 2 different codes. Each time the button is pressed the other code is sent.
