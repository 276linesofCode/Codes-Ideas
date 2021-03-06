var tessel = require('tessel'); //Import tessel

// Connect to device
var port = tessel.port.A; // Select Port A of Tessel
var slaveAddress = 0x1D; // Specefic for accelerometer module
var i2c = new port.I2C(slaveAddress); // Initialize I2C communication

// Details of I2C transfer
var numBytesToRead = 1; // Read back this number of bytes

i2c.read(numBytesToRead, function (error, dataReceived) {
  // Print data received (buffer of hex values)
  console.log('Buffer returned by I2C slave device ('+slaveAddress.toString(16)+'):', dataReceived);
});

// Read/Receive data over I2C using i2c.transfer
i2c.transfer(new Buffer([0x0D]), numBytesToRead, function (error, dataReceived) {
    // Print data received (buffer of hex values)
  console.log('Buffer returned by I2C slave device ('+slaveAddress.toString(16)+'):', dataReceived);
});


//Now, try to print the accelerometer data using i2c.transfer
i2c.transfer(new Buffer([0x01]), 6, function (error, dataReceived) {
    // Print data received (buffer of hex values)
    if (error) throw error;

    //Create a blank array for the output
    var out=[];
    for (var i=0;i<3;i++){ //iterating for the x, y, z values

      var gCount=(dataReceived[i*2] << 8) | dataReceived[(i*2)+1]; //Converting the 8 bit data into a 12 bit
      gCount=gCount >> 4;

      if (dataReceived[i*2] > 0x7F) {
          gCount = -(1 + 0xFFF - gCount); // Transform into negative 2's complement
        }

        out[i] = gCount / ((1<<12)/(2*2));
    }

    console.log('The x, y, z values are :',out); //Log the Array containing the x,y,z values
});
