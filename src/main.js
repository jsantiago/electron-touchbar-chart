const {app, globalShortcut, ipcRenderer, shell, BrowserWindow, Menu, TouchBar} = require('electron');
const {TouchBarPopover, TouchBarSlider} = TouchBar
const config = require('./config');

global.debug = /--debug/.test(process.argv[2]);

let win;
let touchBarConfig = [];

// Generate TouchBar config
config.forEach(function(item){
  touchBarConfig.push(
    new TouchBarPopover({
      label: item.label,
      items: [
        new TouchBarSlider({
          label: item.label,
          value: item.value,
          minValue: 0,
          maxValue: 100,
          change: function(newValue) {
            win.webContents.send('update', item.name, newValue);
          }
        })
      ]
    })
  )
});

const touchBar = new TouchBar(touchBarConfig);

app.on('ready', function(){
  const {screen} = require('electron');
  var size = screen.getPrimaryDisplay().workAreaSize;

  // Create new window
  win = new BrowserWindow({
    width: Math.round(size.width*0.8),
    height: Math.round(size.height*0.8),
    show: false
  });

  win.setTouchBar(touchBar)

  win.on('closed', function(){
    win = null;
  });

  // Load main HTML file
  win.loadURL(`file://${__dirname}/index.html`);

  // Check if dev tools should open
  if (global.debug) {
    win.webContents.openDevTools();
  }

  // Show the window
  win.show();

  // Set application menu
  const defaultMenu = require('electron-default-menu');
  var menu = defaultMenu(app, shell);
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
});

app.on('window-all-closed', function(){
  app.quit();
});
