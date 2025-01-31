import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./config";

export const storageService = {
  // 파일 업로드
  upload: async (path: string, file: File) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },

  // 파일 다운로드 URL 가져오기
  getUrl: async (path: string) => {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  },

  // 파일 삭제
  delete: async (path: string) => {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },
};
