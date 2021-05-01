export class EventEmitter {
    _events = {}

    on(event, listener) {
        (this._events[event] = this._events[event] || []).push(listener)
    }

    emit(event, ...args) {
        (this._events[event] || []).forEach(listener => listener(...args))
    }

    remove(event, listener) {
        this._events[event] = (this._events[event] || []).filter(l => l !== listener)
    }
}