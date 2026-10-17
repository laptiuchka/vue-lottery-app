export interface Readable<T> {
  getAll(params?: Record<string, unknown>): Promise<{ users: T[]; total: number }>
  getById(id: number): Promise<T>
}

export interface Creatable<T, Dto> {
  create(data: Dto): Promise<T>
}

export interface Editable<T, Dto> {
  update(id: number, data: Dto): Promise<T>
}

export interface Deletable {
  delete(id: number): Promise<boolean | void>
}