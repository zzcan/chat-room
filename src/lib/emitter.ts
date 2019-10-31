
export default {
  setup(target) {
    let listeners: any[] = [];

    Object.assign(target, {
      on(type, handle) {
        if (typeof handle == 'function') {
          listeners.push([type, handle]);
        }
      },
      emit(type, ...params) {
        listeners.forEach(([listenType, handle]) => type == listenType && handle(...params));
      },
      removeAllListeners() {
        listeners = [];
      }
    });
  }
}
