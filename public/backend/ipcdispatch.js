//*****************************************************************************
//*****************************************************************************
//
// IPC dispatcher
//
//*****************************************************************************
//*****************************************************************************

module.exports = { ipcDispatch }

const hostfs = require("./hostfs");
const compress = require("./compress")

function ipcDispatch(channel, params) {
  const [cmd, args] = [params[0], params.slice(1)];

  //console.log("IPC:", channel, cmd, args)

  switch(channel) {
    default: throw Error(`Invalid IPC channel: ${channel}`);
    case "hostfs": {
      switch(cmd) {
        case "fstat": return hostfs.fsGetFileEntry(...args);
        case "parent": return hostfs.fsGetParentDir(...args);
        case "getlocation": return hostfs.fsGetLocation(...args);
        case "read": return hostfs.fsRead(...args);
        case "write": return hostfs.fsWrite(...args);
        case "settingsread": return hostfs.fsSettingsRead(...args);
        case "settingswrite": return hostfs.fsSettingsWrite(...args);
        case "readdir": return hostfs.fsReadDir(...args);
        case "rename": return hostfs.fsRename(...args);
        case "openexternal": return hostfs.fsOpenExternal(...args);
        case "dirname": return hostfs.fsDirname(...args);
        case "relpath": return hostfs.fsRelpath(...args);
        case "basename": return hostfs.fsBasename(...args);
        case "extname": return hostfs.fsExtname(...args);
      }
      throw Error(`IPC: hostfs/${cmd}: Not implemented.`);
    }
    case "compress": {
      switch(cmd) {
        case "isGzip": return compress.isGzip(...args);
        case "gzip": return compress.gzip(...args);
        case "gunzip": return compress.gunzip(...args);
      }
      throw Error(`IPC: compress/${cmd}: Not implemented.`);
    }
  }
}
