export class PhotoUpload {
  file?: File;

  private constructor(file?: File) {
    this.file = file;
  }

  static empty(): PhotoUpload {
    return new PhotoUpload();
  }

  static fromFile(file: File): PhotoUpload {
    const photoUpload = new PhotoUpload(file);

    return photoUpload;
  }
}
