// Starts with (not yet supported by all browsers)
String.prototype.startsWith = function(suffix) {
    return this.indexOf(suffix, 0) === 0;
};


function Listener() {
    this.callbacks = {
        deviceCreation: null,
        deviceRemoval: null,
        deviceUpdate: null,
        linkCreation: null,
        linkRemoval: null,
        openCmd: null,
        closeCmd: null,
        useCmd: null,
        readCmd: null
    };
}

Listener.prototype.onCreateDevice = function(creationCallback) {
    this.callbacks.deviceCreation = creationCallback;
    return this;
}

Listener.prototype.onDeleteDevice = function(removalCallback) {
    this.callbacks.deviceRemoval = removalCallback;
    return this;
}

Listener.prototype.onUpdateDevice = function(updateCallback) {
    this.callbacks.deviceUpdate = updateCallback;
    return this;
}

Listener.prototype.onUpdatePort = function(updateCallback) {
    this.callbacks.portUpdate = updateCallback;
    return this;
}

Listener.prototype.onCreateLink = function(creationCallback) {
    this.callbacks.linkCreation = creationCallback;
    return this;
}

Listener.prototype.onDeleteLink = function(removalCallback) {
    this.callbacks.linkRemoval = removalCallback;
    return this;
}

Listener.prototype.onOpenCommandLine = function(openCallback) {
    this.callbacks.openCmd = openCallback;
    return this;
}

Listener.prototype.onCloseCommandLine = function(closeCallback) {
    this.callbacks.closeCmd = closeCallback;
    return this;
}

Listener.prototype.onUseCommandLine = function(useCallback) {
    this.callbacks.useCmd = useCallback;
    return this;
}

Listener.prototype.onReadCommandLine = function(readCallback) {
    this.callbacks.readCmd = readCallback;
    return this;
}

Listener.prototype.onStatement = function(statement) {
    var dext = (statement.result===undefined)? null: statement.result.extensions;
    if (statement.verb.id===verb.create) {
        if (statement.object.id.startsWith(devices.any)) {
            if (this.callbacks.deviceCreation==null) {
                console.warn('No callback function defined for device creation.');
            } else {
                this.callbacks.deviceCreation(dext);
            }
        } else if (statement.object.id == activity.link) {
            if (this.callbacks.linkCreation==null) {
                console.warn('No callback function defined for link creation.');
            } else {
                this.callbacks.linkCreation(dext);
            }
        }
    } else if (statement.verb.id===verb.delete) {
        if (statement.object.id.startsWith(devices.any)) {
            if (this.callbacks.deviceRemoval==null) {
                console.warn('No callback function defined for device removal.');
            } else {
                this.callbacks.deviceRemoval(dext);
            }
        } else if (statement.object.id == activity.link) {
            if (this.callbacks.linkRemoval==null) {
                console.warn('No callback function defined for link removal.');
            } else {
                this.callbacks.linkRemoval(dext);
            }
        }
    } else if (statement.verb.id===verb.update) {
        if (statement.object.id.startsWith(devices.any)) {
            if (this.callbacks.deviceUpdate==null) {
                console.warn('No callback function defined for device update.');
            } else {
                this.callbacks.deviceUpdate(dext, statement.result.response);
            }
        } else if (statement.object.definition.type==activity.port) {
            if (this.callbacks.portUpdate==null) {
                console.warn('No callback function defined for device port update.');
            } else {
                this.callbacks.portUpdate(dext);
            }
        }
    } else if (statement.verb.id===verb.opened) {
        if (statement.object.definition.type==activity.commandLine) {
            if (this.callbacks.openCmd==null) {
                console.warn('No callback function defined for command line open.');
            } else {
                // It would be better to store the name as an extension too.
                this.callbacks.openCmd(statement.object.definition.name['en-GB']);
            }
        }
    } else if (statement.verb.id===verb.closed) {
        if (statement.object.definition.type==activity.commandLine) {
            if (this.callbacks.closeCmd==null) {
                console.warn('No callback function defined for command line close.');
            } else {
                this.callbacks.closeCmd();
            }
        }
    } else if (statement.verb.id===verb.use) {
        if (statement.object.definition.type==activity.commandLine) {
            if (this.callbacks.useCmd==null) {
                console.warn('No callback function defined for command line use.');
            } else {
                this.callbacks.useCmd(dext);
            }
        }
    } else if (statement.verb.id===verb.read) {
        if (statement.object.definition.type==activity.commandLine) {
            if (this.callbacks.readCmd==null) {
                console.warn('No callback function defined for command line read.');
            } else {
                this.callbacks.readCmd(statement.result.response);
            }
        }
    }
}


angular.module('dashboardApp').service('StatementListener', [Listener]);