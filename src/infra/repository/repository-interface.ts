export interface RepositoryInterface<T> {
  create(domain: T): Promise<T>;
  findById(id: string): Promise<T>;
  update(domain: T): Promise<T>;
}
