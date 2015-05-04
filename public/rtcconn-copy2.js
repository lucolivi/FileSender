var RTCPeerConnection;  //Instance to hold native browser webrtc peer connection API

var rtcConnections = [];    //instance to hold active rtc Connections

function isRTCReady() {
    // Chrome or Safari
    if (navigator.webkitGetUserMedia)
        RTCPeerConnection = webkitRTCPeerConnection;
        // Firefox
    else if(navigator.mozGetUserMedia) {
        RTCPeerConnection = mozRTCPeerConnection;
        RTCSessionDescription = mozRTCSessionDescription;
        RTCIceCandidate = mozRTCIceCandidate;
    } else
        return false;
    return true;    
}

 
function CreateNewRTCConn() {
    
    
    
    
    
    
}






function RTCDataChannel(remoteDesc) {
   
    var self = this;
    
    // This is an optional configuration string associated with NAT traversal setup
    var servers = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
        

    // JavaScript variable associated with proper configuration of an RTCPeerConnection object: use DTLS/SRTP
    var pc_constraints = {'optional': [{'DtlsSrtpKeyAgreement': true}]};
    
    var peerConnection = new RTCPeerConnection(servers, pc_constraints);
    log("Created local peer connection object, with Data Channel");  
    
    sdpReady = false;
    
    var iceCandidates = [];
    
    self.onIceCandidate;
    
    var dataChannel;
    
    self.onChannelOpen;
    self.onChannelClose;
    self.onMessage;
    self.onError;   //got to implement this
    
    self.sendData;
    this.readyState;
    
    peerConnection.onicecandidate = function(event) {          
        if(sdpReady)
            self.onIceCandidate(event.candidate);
        else        
            iceCandidates.push(event.candidate);
    };
    
    

    this.addIceCandidate = function(candidate) {
        log('local ice callback');
        if (candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            log('Local ICE candidate: \n' + candidate);
        }   
    };
    
    if(remoteDesc) {    //check whether this is a initiator or a listener
        peerConnection.ondatachannel = function(event) {
            log('Receive Channel Callback: event --> ' + event);
            // Retrieve channel information
            dataChannel = event.channel;
            dataChannel.onopen = function() { self.onChannelOpen(); };
            dataChannel.onclose = function() { self.onChannelClose(); };
            dataChannel.onmessage = function(event) { self.onMessage(event.data); };
            
            self.sendData = function(data) { dataChannel.send(data); };
            self.readyState = function() { var state = dataChannel.readyState; return state; };           
        };
        peerConnection.setRemoteDescription(new RTCSessionDescription(remoteDesc));
        
        this.onAnswerReady;  
        
        this.createAnswer = function() {
            
            peerConnection.createAnswer(function(localDesc) {
                log(localDesc);
                peerConnection.setLocalDescription(localDesc);
                
                sdpReady = true;
            
                while(iceCandidates.length)
                    self.onIceCandidate(iceCandidates.pop());
                
                self.onAnswerReady(localDesc);
                
                log("Answer sucessfully created and ready.");
            }, onSignalingError);
        };
        
    } else {
        
        dataChannel = peerConnection.createDataChannel("dataChannel", {reliable: true});
        log("Data Channel created!");

            dataChannel.onopen = function() { self.onChannelOpen(); };
            dataChannel.onclose = function() { self.onChannelClose(); };
            dataChannel.onmessage = function(event) { self.onMessage(event.data); };
        
            self.sendData = function(data) { dataChannel.send(data); };
            self.readyState = function() { var state = dataChannel.readyState; return state; };        
        this.onOfferReady;  
        
        this.createOffer = function() {
            
            peerConnection.createOffer(function(localDesc) {                    
                log(localDesc);
                peerConnection.setLocalDescription(localDesc);
                
                self.onOfferReady(localDesc);
                
                log("Offer sucessfully created and ready.");
            }, onSignalingError);

        };
        
        this.setRemoteDescription = function(remoteDesc) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(remoteDesc));
            
            sdpReady = true;
            
            while(iceCandidates.length)
                self.onIceCandidate(iceCandidates.pop());
        };
    }
    
    
    function onSignalingError(error) {
        console.log('Failed to create signaling message : ' + error.name);
    }
}

