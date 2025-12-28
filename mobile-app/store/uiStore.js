import { create } from "zustand";

const useUIStore = create((set) => ({
  alertVisible: false,
  alertTitle: "",
  alertMessage: "",
  alertConfirmText: "OK",
  alertCancelText: "Cancel",
  alertShowCancel: false,
  alertOnConfirm: () => {},
  alertOnCancel: () => {},

  showAlert: ({
    title = "",
    message = "",
    confirmText = "OK",
    cancelText = "Cancel",
    showCancel = false,
    onConfirm = () => {},
    onCancel = () => {},
  } = {}) =>
    set(() => ({
      alertVisible: true,
      alertTitle: title,
      alertMessage: message,
      alertConfirmText: confirmText,
      alertCancelText: cancelText,
      alertShowCancel: showCancel,
      alertOnConfirm: () => onConfirm(),
      alertOnCancel: () => onCancel(),
    })),

  hideAlert: () =>
    set(() => ({
      alertVisible: false,
      alertTitle: "",
      alertMessage: "",
      alertConfirmText: "OK",
      alertCancelText: "Cancel",
      alertShowCancel: false,
      alertOnConfirm: () => {},
      alertOnCancel: () => {},
    })),
}));

export default useUIStore;
