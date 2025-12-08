import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export class FileHelper {
  static async saveFile(file: Express.Multer.File, destination: string): Promise<string> {
    const uploadDir = path.join(process.env.UPLOAD_PATH || './uploads', destination);
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Gerar nome único para o arquivo
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // Salvar arquivo
    await fs.promises.writeFile(filePath, file.buffer);

    return `/uploads/${destination}/${fileName}`;
  }

  static deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), filePath);
    return fs.promises.unlink(fullPath);
  }

  static getFileInfo(filePath: string) {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    return {
      size: stats.size,
      extension: ext,
      mimeType: mime.lookup(ext) || 'application/octet-stream',
      created: stats.birthtime,
      modified: stats.mtime
    };
  }

  static isValidImage(file: Express.Multer.File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(file.mimetype);
  }

  static isValidDocument(file: Express.Multer.File): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return allowedTypes.includes(file.mimetype);
  }

  static getFileType(file: Express.Multer.File): string {
    if (this.isValidImage(file)) return 'image';
    if (this.isValidDocument(file)) return 'document';
    return 'other';
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static async readFileAsBase64(filePath: string): Promise<string> {
    const data = await fs.promises.readFile(filePath);
    return data.toString('base64');
  }
}