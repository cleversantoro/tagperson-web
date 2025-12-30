export class StorageService {
  private key = 'tagperson.characters.v1';

  load(): any[] {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  save(items: any[]) {
    localStorage.setItem(this.key, JSON.stringify(items));
  }
}
