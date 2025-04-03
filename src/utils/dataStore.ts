class DataStore {
  private data: Record<string, any> = {};

  setData(key: string, value: any) {
    this.data[key] = value;
  }

  getData(key: string) {
    return this.data[key];
  }

  clearData() {
    this.data = {};
  }
}

export const dataStore = new DataStore(); 