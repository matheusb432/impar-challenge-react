import { ToastType } from './toast-type.enum';

const defaultDuration = 4800;

export class ToastData {
  type: ToastType;

  visible: boolean;

  durationMs: number;

  text: string;

  constructor(text: string, type?: ToastType, durationMs?: number) {
    this.type = type ?? ToastType.Success;
    this.text = text ?? '';
    this.durationMs = durationMs ?? defaultDuration;

    this.visible = false;
  }

  static error(text: string, durationMs?: number): ToastData {
    return new ToastData(text, ToastType.Error, durationMs);
  }

  static success(text: string, durationMs?: number): ToastData {
    return new ToastData(text, ToastType.Success, durationMs);
  }

  static warning(text: string, durationMs?: number): ToastData {
    return new ToastData(text, ToastType.Warning, durationMs);
  }
}
