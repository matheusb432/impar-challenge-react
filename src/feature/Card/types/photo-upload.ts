const uploadPhotoKey = 'photo';

export class PhotoUpload {
  file?: File;

  private constructor() {}

  static empty(): PhotoUpload {
    return new PhotoUpload();
  }

  static fromFile(file: File): PhotoUpload {
    const photoUpload = new PhotoUpload();

    photoUpload.file = file;

    return photoUpload;
  }
}
