//*****************************************************************************
//*****************************************************************************
//
// Loading and saving local files when ran under Electron
//
//*****************************************************************************
//*****************************************************************************

export {
    getfileid,
    readdir,
    splitpath,
    fstat,
}

function getfileid(location)
{
    return window.ipc.callMain("fs-getlocation", location);
}

function readdir(fileid)
{
    return window.ipc.callMain("fs-readdir", fileid);
}

function splitpath(fileid)
{
    return window.ipc.callMain("fs-splitpath", fileid);
}

function fstat(fileid)
{
    return window.ipc.callMain("fs-getentry", fileid);
}
