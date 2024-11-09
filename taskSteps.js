// taskSteps.js

const tasks = {
  cleanInstallWindows: [
    "Step 1: Backup your data. ",
    "Step 2: Create a bootable USB drive with the Windows installer.You can download the Windows installer from this link: <a href=https://www.microsoft.com/en-us/software-download/windows11>Windows Intsaller</a>.",
    "Step 3: Insert the USB drive into your computer.",
    "Step 4: Restart your computer and boot from the USB drive by pressing F12 or F2 key on your keyboard then select your usb drive to boot .",
    "Step 5: Follow the on-screen instructions to install Windows. If you face any problem you can ask me.",
  ],
  InstallWindowsOnNewLaptop: [
    "Step 1: Prepare a bootable USB drive using another computer. Download the Windows 11 installer from this link: <a href=https://www.microsoft.com/en-us/software-download/windows11>Windows Installer</a> and use the Media Creation Tool or a tool like Rufus to create a bootable USB drive (8 GB or larger recommended).",
    "Step 2: Insert the bootable USB drive into the new laptop.",
    "Step 3: Power on the laptop and press the F12, F2, Esc, or Delete key (depending on your laptop brand) to open the Boot Menu.",
    "Step 4: Select the USB drive from the Boot Menu to start the installation.",
    "Step 5: Follow the on-screen instructions to install Windows 11. You’ll be guided through setting up your language, keyboard, and installation preferences.",
    "Step 6: If you face any issues, feel free to ask for assistance."
  ],

  updateWindows10To11: [
    "Step 1: Check if your PC meets the Windows 11 system requirements. You can find the requirements on the official Microsoft website.",
    "Step 2: Back up your important files and data to avoid any data loss during the update.",
    "Step 3: Go to **Settings > Update & Security > Windows Update** on your Windows 10 device.",
    "Step 4: Click on **Check for updates**. If your device is eligible, you’ll see an option to download and install Windows 11.",
    "Step 5: Select **Download and install** to begin the update process.",
    "Step 6: Follow the on-screen instructions and allow your PC to restart as needed. The update process may take some time.",
    "Step 7: Once the update is complete, go through the initial setup steps for Windows 11 and customize your settings.",
    "Step 8: If you experience any issues, you can revert to Windows 10 within 10 days by going to **Settings > System > Recovery**."
  ],


  changewallpaper: [
    "Step 1: Go to **Settings > Personalization**.",
    "Step 2: Choose **Background** to change the wallpaper, or select **Colors** to set an accent color and switch between light and dark modes.",
    "Step 3: Click on **Themes** to apply or download new themes."
  ],

  configurestartupprograms: [
    "Step 1: Right-click on the Taskbar and select **Task Manager**.",
    "Step 2: Go to the **Startup** tab to see programs that start automatically when you boot up.",
    "Step 3: Right-click any program and select **Disable** to stop it from starting automatically, or **Enable** if you want it to start."
  ],

  setupmicrosoftaccount: [
    "Step 1: Go to **Settings > Accounts > Your Info**.",
    "Step 2: Click on **Sign in with a Microsoft account** and follow the prompts.",
    "Step 3: Once signed in, go to **Sync your settings** to choose what you’d like to sync across devices, such as passwords, themes, and browser data."
  ],


  setupwindowspinorrecognition: [
    "Step 1: Go to **Settings > Accounts > Sign-in options**.",
    "Step 2: Under **Windows Hello**, choose **Face Recognition**, **Fingerprint**, or **PIN** setup.",
    "Step 3: Follow the on-screen instructions to set up your chosen Windows Hello option for quick and secure login."
  ],

  CustomizeTaskbarandStartMenu: [
    "Step 1: Right-click the Taskbar and select **Taskbar settings**.",
    "Step 2: Choose options to hide, move, or pin apps on the Taskbar.",
    "Step 3: For Start Menu customization, go to **Settings > Personalization > Start** and select which apps or folders to show."
  ],

  EnableClipboardHistory: [
    "Step 1: Go to **Settings > System > Clipboard**.",
    "Step 2: Turn on **Clipboard history** to save multiple items on the clipboard.",
    "Step 3: Use **Windows key + V** to view and paste from your clipboard history."
  ],

  SetDefaultApp: [
    "Step 1: Go to **Settings > Apps > Default apps**.",
    "Step 2: Click on the app type (e.g., Email, Web browser) and select your preferred app.",
    "Step 3: Repeat for other file types or protocols if needed."
  ],

  Setupprinter : [
      "Step 1: Go to **Settings > Devices > Printers & scanners**.",
      "Step 2: Click on **Add a printer or scanner** and select your printer.",
      "Step 3: Follow on-screen instructions to complete setup. Repeat for any other devices like Bluetooth speakers or headphones."
    ],

    setupSoftware: [
      "Step 1: Ensure your pen drive is connected.",
      "Step 2: Check if the setup is complete.",
      "Step 3: Download the required setup files.",
      "Step 4: Follow the installation instructions.",
    ],
    // Add more tasks and their steps as needed
  };
  
  export default tasks;
  