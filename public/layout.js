var menuOpened = false; 
//set menu stuff
document.body.addEventListener("click", function() {
    if(menuOpened) {
        HideMenu();
        menuOpened = false;    
    }
});  

document.getElementById("user").addEventListener("click", function(e) {
    if(!menuOpened) {
        //cancel bubble to prevent body click event to happen due to event continues to propagate to parent elements
        e.cancelBubble = true;
        menuOpened = true; 
        ShowMenu();  
    }
});

function ShowMessage(message, backColor) {
    if(!backColor)
        backColor = "#00a";    
    document.getElementById("message").style.backgroundColor = backColor;
    document.getElementById("message").innerHTML = message;
    document.getElementById("message").style.display = "block";    
}

function ShowTempMessage(message, backColor, time) {
    ShowMessage(message, backColor);
    setTimeout(function() {
        HideMessage();    
    }, time);
}

function HideMessage() {
    document.getElementById("message").style.display = "none";   
}

function DeviceIcon(deviceName, deviceOrigin, deviceType, uploadCallback, cancelDownCallback, cancelUpCallback) {
    
    var self = this;
    var parent = document.getElementById("section");
    var newDevice = document.createElement("div");
    newDevice.setAttribute("class", "device");
    
    //  Device Layout //
    
    var mainDevice = document.createElement("table");
    mainDevice.setAttribute("class", "mainDevice");
    
    var row = document.createElement("tr");
    
    var devIcoTd = document.createElement("td");
    devIcoTd.setAttribute("class", "mainImgTd");
    
    var devIco = document.createElement("img");
    devIco.setAttribute("class", "mainImg");
    if(deviceType == "mobile")
        devIco.src = "img/mob.png";
    else if(deviceType == "tablet")
        devIco.src = "img/tab.png";
    else
        devIco.src = "img/comp.png";
    
    var devNameTd = document.createElement("td");
    devNameTd.setAttribute("class", "deviceName");
    devNameTd.innerHTML = deviceName + "<br><span>" + deviceOrigin + "</span>";
    
    var upIcoTd = document.createElement("td");
    upIcoTd.setAttribute("class", "mainImgTd");
    
    var upIco = document.createElement("img");
    upIco.src = "img/up.png";
    upIco.setAttribute("class", "uploadImg");
    upIco.addEventListener("click", function() {
        uploadCallback(self);           
    });
    
    //  Download Layout //
    
    var download = document.createElement("table");
    download.setAttribute("class", "transfer");
    
    var downTimeOut;
    
    download.addEventListener("mousedown", function() {
        downTimeOut = setTimeout(function() {
            cancelDownCallback(self);
        }, 2000);
    });
    
    download.addEventListener("mouseup", function() {
        clearTimeout(downTimeOut);
    });
    
    var drow1 = document.createElement("tr");
    
    var downFileName = document.createElement("td");
    downFileName.setAttribute("colspan", "2");
    downFileName.innerHTML = "Recebendo:";
    
    var drow2 = document.createElement("tr");
    
    var downBar = document.createElement("td");
    downBar.setAttribute("class", "downBar");
    downBar.setAttribute("colspan", "2");
    downBar.innerHTML = "0%";
    
    var drow3 = document.createElement("tr");
    
    var downLeft = document.createElement("td");
    downLeft.innerHTML = "";
    
    var downCancel = document.createElement("td");
    downCancel.setAttribute("class", "cancel");
    downCancel.innerHTML = "Pressione para Cancelar";
    
    //  Upload Layout //
    
    var upload = document.createElement("table");
    upload.setAttribute("class", "transfer");
    
    var upTimeOut;
    
    upload.addEventListener("mousedown", function() {
        upTimeOut = setTimeout(function() {
            cancelUpCallback(self);
        }, 2000);
    });
    
    upload.addEventListener("mouseup", function() {
        clearTimeout(upTimeOut);
    });

    var urow1 = document.createElement("tr");
    
    var upFileName = document.createElement("td");
    upFileName.setAttribute("colspan", "2");
    upFileName.innerHTML = "Enviando:";
    
    var urow2 = document.createElement("tr");
    
    var upBar = document.createElement("td");
    upBar.setAttribute("class", "upBar");
    upBar.setAttribute("colspan", "2");
    upBar.innerHTML = "0%";
    
    var urow3 = document.createElement("tr");
    
    var upLeft = document.createElement("td");
    upLeft.innerHTML = "";
    
    var upCancel = document.createElement("td");
    upCancel.setAttribute("class", "cancel");
    upCancel.innerHTML = "Pressione para Cancelar";  
    
    //  Append Everything   //
    
    newDevice.appendChild(mainDevice);
    newDevice.appendChild(download);
    newDevice.appendChild(upload); 
    
    //  Device  //
    
    mainDevice.appendChild(row);
    row.appendChild(devIcoTd);
    row.appendChild(devNameTd);
    row.appendChild(upIcoTd);   
    devIcoTd.appendChild(devIco);
    upIcoTd.appendChild(upIco);
    
    //  Download    //
    
    download.appendChild(drow1);
    download.appendChild(drow2);
    download.appendChild(drow3);
    
    drow1.appendChild(downFileName);
    drow2.appendChild(downBar);
    drow3.appendChild(downLeft);
    drow3.appendChild(downCancel);
    
    //  Upload  //
    
    upload.appendChild(urow1);
    upload.appendChild(urow2);
    upload.appendChild(urow3);
    
    urow1.appendChild(upFileName);
    urow2.appendChild(upBar);
    urow3.appendChild(upLeft);
    urow3.appendChild(upCancel);

    //  Finish  //
    parent.appendChild(newDevice);
    
    this.showDownload = function() {
        download.style.display = "table";            
    };
    
    this.hideDownload = function() {
        download.style.display = "none";         
    };
    
    this.setDownloadName = function(name) {
        downFileName.innerHTML = "Recebendo: " + name;        
    };    
    
    this.setDownloadProgress = function(left, total) {       
        var percentage = left * 100 / total;        
        if(percentage < 0) percentage = 0;
        else if(percentage > 100) percentage = 100;      
        downBar.style.backgroundSize = percentage + "% 100%";
        if(percentage == 100)
            downBar.innerHTML = "Download Completo";
        else             
            downBar.innerHTML = percentage.toFixed(1) + "%";       
        downLeft.innerHTML = getSizeWord(left) + " / " + getSizeWord(total);
    };
    
    this.showUpload = function() {
        upload.style.display = "table";            
    };
    
    this.hideUpload = function() {
        upload.style.display = "none";         
    };
    
    this.setUploadName = function(name) {
        upFileName.innerHTML = "Enviando: " + name;        
    };    
    
    this.setUploadProgress = function(left, total) {       
        var percentage = left * 100 / total;        
        if(percentage < 0) percentage = 0;
        else if(percentage > 100) percentage = 100;      
        upBar.style.backgroundSize = percentage + "% 100%";
        if(percentage == 100)
            upBar.innerHTML = "Transferência Completa";
        else             
            upBar.innerHTML = percentage.toFixed(1) + "%";       
        upLeft.innerHTML = getSizeWord(left) + " / " + getSizeWord(total);
    };
    
    this.DeleteDevice = function() {
        parent.removeChild(newDevice);         
    };
    
    function getSizeWord(size) {    
        if(size < 1000)
            return size + " bytes";
        else if(size < 1000000)
            return (size/1024).toFixed(1) + " kB";
        else if(size < 1000000000)
            return (size/1048576).toFixed(1) + " MB";
        else //if(size < 1000000000000)
            return (size/1073741824).toFixed(1) + " GB";   
    }
}

function SetLocalUser(localName, sessionName, deviceType) {
    document.getElementById("userName").innerHTML = localName;
    document.getElementById("sessionName").innerHTML = "@" + sessionName;   
    document.getElementById("userImg");    
    if(deviceType == "mobile")
        document.getElementById("userImg").src = "img/mob.png";
    else if(deviceType == "tablet")
        document.getElementById("userImg").src = "img/tab.png";
    else
        document.getElementById("userImg").src = "img/comp.png";
    document.getElementById("user").style.display = "table";
}

function ShowPopup(deviceName, deviceOrigin, deviceType, message, fileName, fileSize, acceptLabel, refuseLabel, acceptCallback, refuseCallback){   
    var parent = document.body;
    var table = document.createElement("table");
    table.setAttribute("class", "screenDisabled");    
    var imgSrc = "";   
    if(deviceType == "mobile")
        imgSrc = "img/mob.png";
    else if(deviceType == "tablet")
        imgSrc = "img/tab.png";
    else
        imgSrc = "img/comp.png";    
    table.innerHTML = "<tr><td><table class='popupWindow'><tr><td class='mainImgTd' style='height: 1px;'><img src='" + imgSrc + "' class='mainImg'></td><td class='deviceName'>" + deviceName + "<br><span>" + deviceOrigin + "</span></td></tr><tr><td colspan='2' style='height: 1px;'>" + message + "</td></tr><tr><td colspan='2' style='height: 1px;'>" + fileName + "<br>" + fileSize + "</td></tr><tr><td colspan='2'><span id='refuse' class='popupButton'>" + refuseLabel + "</span><span id='accept' class='popupButton'>" + acceptLabel + "</span></td></tr></table></td></tr>";   
    parent.style.overflow = "hidden";  //hiddes the navigation bar in case content is greater than the screen, bug in case more than one is opened   
    parent.appendChild(table); 
    document.getElementById("accept").addEventListener("click", function() {           
        parent.removeChild(table);
        parent.style.overflow = "visible";
        acceptCallback();  
    });   
    document.getElementById("refuse").addEventListener("click", function() {    
        parent.removeChild(table);
        parent.style.overflow = "visible";
        refuseCallback();  
    });
}

function ShowMenu() {
    document.getElementById("menu").style.display = "table";
    document.getElementById("user").style.backgroundColor = "#333";
}
            
function HideMenu() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("user").style.backgroundColor = "#000";
}