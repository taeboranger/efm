const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');

const remote = require('@electron/remote/main')
remote.initialize();

var tray = null
function createTray(win) {
    const icon = nativeImage.createFromPath('./public/favicon.ico')
    tray = new Tray(icon.resize({ width: 16, height: 16 }))
    tray.setIgnoreDoubleClickEvents(true)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => {
                win.show();
            }
        },
        {
            label: 'Quit',
            click: () => {
                win.destroy();
                app.quit();
            }
        }
    ]);

    tray.on('click', _ => {
        if (isShowing) {
            win.hide();
        } else {
            win.show();
        }

    });

    tray.setContextMenu(contextMenu);
}

var isShowing = true
function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        resizable: false,
        webPreferences: {
            enableRemoteModule: true
        }
    });
    win.removeMenu(null);

    win.loadURL('http://localhost:3000');

    win.on('close', event => {
        event.preventDefault();
        win.hide();
    });

    win.on('show', _ => {
        isShowing = true;
    });

    win.on('hide', _ => {
        isShowing = false;
    });

    createTray(win)

    remote.enable(win.webContents);
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})