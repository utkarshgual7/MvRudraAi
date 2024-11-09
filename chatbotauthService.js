
import dotenv from 'dotenv';
import { createRequire } from 'module';
import dataset from '../dataset.js'

import OpenAI from 'openai';
import User from '../models/user.model.js';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import { spawn } from 'child_process'
dotenv.config();
const require = createRequire(import.meta.url);
const fuzzball = require('fuzzball');


export const verifyUser = async (email) => {
    try {
      // Check if a user with the given email and name exists
      const user = await User.findOne({ email});
  
      if (user) {
        return user; 
      } else {
        return null; 
      }
    } catch (error) {
      console.error('Error during user verification:', error);
      return null;
    }
  };


  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG,
  });

  async function getAnswerFromDataset(userQuestion) {
    const bestMatch = fuzzball.extract(userQuestion, dataset.map(d => d.question), {
      scorer: fuzzball.ratio,
      cutoff: 60,
    })[0];
  
    if (bestMatch && bestMatch[1] >= 60) {
      const matchedQuestionIndex = dataset.map(d => d.question).indexOf(bestMatch[0]);
      return dataset[matchedQuestionIndex].answer;
    }
  
    return null;
  }
  
  async function getAnswer(userQuestion) {
    const datasetAnswer = await getAnswerFromDataset(userQuestion);
  
    if (datasetAnswer) {
      return datasetAnswer;
    }
  
    try {
      const response = await openai.chat.completions.create({
        messages: [{ role: 'user', content: userQuestion }],
        model: 'gpt-3.5-turbo',
        max_tokens: 250,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error during OpenAI conversation:', error);
      return 'Sorry, I’m currently having trouble answering that question.';
    }
  }
  

 export const askai=  async (req, res) => {
    const { question } = req.body;
    if (!question) {
      return res.status(400).send({ error: 'Question is required' });
    }
  
    const answer = await getAnswer(question);
    res.send({ answer });
  };
  

  export const orderhelp = async (req, res) => {
    const { email} = req.body;
  
    // Verify user by email and name
    const user = await verifyUser(email);
   
    if (user) {
      // Return a message or user's order info if authenticated
      res.send({
        message: `Hello Member, how can I assist you with your orders?`,
      });
    } else {
      res.status(401).send({ error: 'Authentication failed. User not found.' });
    }
  };


 
export const networkhelp =  (req, res) => {
 
  exec('start ms-settings:network', (error) => {
      if (error) {
          return res.status(500).json({ message: 'Error opening network settings' });
      }
  });

  // Restart the Wi-Fi adapter (Assuming the adapter is named "Wi-Fi")
  exec('netsh interface set interface "Wi-Fi" disable', (disableError) => {
      if (disableError) {
          return res.status(500).json({ message: 'Error disabling Wi-Fi adapter' });
      }

      setTimeout(() => {
          exec('netsh interface set interface "Wi-Fi" enable', (enableError) => {
              if (enableError) {
                  return res.status(500).json({ message: 'Error enabling Wi-Fi adapter' });
              }

              res.json({ message: 'Wi-Fi troubleshooting initiated. Network settings opened, and adapter restarted. Please check by connecting to your wifi router' });
          });
      }, 5000);
  });
};

export const audiohelp=  (req, res) => {


  // Restart the Windows Audio service
  exec('net stop "AudioSrv" && net start "AudioSrv"', (audioError) => {
      if (audioError) {
          return res.status(500).json({ message: 'Error restarting audio service' });
      }
      setTimeout(() => {

      res.json({ message: 'Sound troubleshooting initiated. Sound settings opened, and audio service restarted. Please check your audio output.' });
    }, 3000);
  });

}

export const resetnetwork = (req, res) => {
  // Reset network settings
  exec('netsh int ip reset', (resetError) => {
      if (resetError) {
          return res.status(500).json({ message: 'Error resetting network settings' });
      }

      res.json({ message: 'Network settings reset. Please restart your computer for the changes to take effect.' });
  });
};

export const cleardns =  (req, res) => {
  // Clear DNS cache
  exec('ipconfig /flushdns', (dnsError) => {
      if (dnsError) {
          return res.status(500).json({ message: 'Error clearing DNS cache' });
      }

      res.json({ message: 'DNS cache cleared successfully. Please check your internet connection.' });
  });
};






export const updategraphics =  (req, res) => {
  let finalMessage = 'Driver check completed. No issues found with your Graphics driver, wish you happy gaming.';
  let errorMessages = '';
  let driverDetails = '';
  let updateMessages = ''; 
  // Check for devices with errors
  exec('powershell -Command "Get-PnpDevice -PresentOnly | Where-Object { $_.Status -eq \'Error\' }"', (checkError, stdout, stderr) => {
      if (checkError) {
          return res.status(500).json({ message: 'Error checking devices', details: stderr });
      }

      // If there are errors, inform the user
      if (stdout) {
          const errorDevices = stdout.split('\n').filter(line => line.trim() !== '');
          errorMessages = errorDevices.map(device => `Device with Instance ID: ${device.trim()} has an issue.`).join('\n');
      } else {
          errorMessages = 'No devices have issues.';
      }

      // Now check the installed driver versions using WMI
      exec('powershell -Command "Get-WmiObject -Class Win32_VideoController | Select-Object -Property Name, DriverVersion"', (driverCheckError, driverOutput, driverError) => {
          if (driverCheckError) {
              return res.status(500).json({ message: 'Error checking driver versions', details: driverError });
          }

          // Process driver information
          const driverInfo = driverOutput.split('\n').filter(line => line.trim() !== '');
          driverDetails = driverInfo.length ? driverInfo.map(line => line.trim()).join('\n') : 'No graphics drivers found.';

          // Check for updates using PSWindowsUpdate
          exec('powershell -Command "Get-WindowsUpdate -MicrosoftUpdate | Where-Object { $_.Title -like \'*driver*\' }"', (updateError, updateOutput, updateErr) => {
            if (updateError) {
                return res.status(500).json({ message: 'Error checking for driver updates', details: updateErr });
    
              }

            
              const updates = updateOutput.split('\n').filter(line => line.trim() !== '');
              updateMessages = updates.length ? updates.map(line => `Available update: ${line.trim()}`).join('\n') : 'No driver updates available.';

              // Send final response back to the user
              res.json({
                  message: finalMessage,
                  errorDetails: errorMessages,
                  driverDetails: driverDetails,
                  updateDetails: updateMessages 
              });
          });
      });
  });
};





// app.post('/api/troubleshoot/check-disk', (req, res) => {
//   // Set headers for SSE
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');

//   // Start the chkdsk process
//   const chkdsk = spawn('chkdsk', ['C:']);

//   // Listen for standard output
//   chkdsk.stdout.on('data', (data) => {
//       // Send output to the client
//       res.write(`data: ${data.toString()}\n\n`);
//   });

//   // Listen for standard error
//   chkdsk.stderr.on('data', (data) => {
//       // Send error output to the client
//       res.write(`data: Error: ${data.toString()}\n\n`);
//   });

//   // Handle process close
//   chkdsk.on('close', (code) => {
//       // Send completion message
//       res.write(`data: Disk check completed with exit code ${code}.\n\n`);
//       res.end(); // Close the connection
//   });

//   // Handle spawn errors
//   chkdsk.on('error', (error) => {
//       res.write(`data: Error: ${error.message}\n\n`);
//       res.end(); // Close the connection after an error
//   });

//   // Handle client disconnect
//   req.on('close', () => {
//       chkdsk.kill(); // Kill the chkdsk process if client disconnects
//       console.log('Client disconnected, killing chkdsk process.');
//   });
// });


import Order from "../models/store.model.js";




// Controller to handle viewing orders
export async function viewOrders(req, res) {
  const { email } = req.query; 
  try {
    // Fetch orders for the user using the email directly
    const orders = await Order.find({ email }); 
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for this user' });
    }

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error); 
    res.status(500).json({ error: 'Error fetching orders' });
  }
}
export async function trackOrder(req, res) {
    const { orderId } = req.params; 
    try {
      // Fetch order by orderId using the Order model
      const order = await Order.findOne({ orderId: orderId });
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
    
      res.json({ trackingInfo: order.orderStatus });
    } catch (error) {
      console.error('Error tracking order:', error);
      res.status(500).json({ error: 'Error tracking order' });
    }
  }
