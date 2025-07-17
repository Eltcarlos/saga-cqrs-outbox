### TypeORM Relationship Summary

```md
| Decorator                            | Description                                   | Direction     | Owns FK? | Notes                                     |
|--------------------------------------|-----------------------------------------------|---------------|----------|-------------------------------------------|
| `@OneToOne`                          | One-to-one relationship                        | Both sides    | One side | Needs `@JoinColumn` on the owning side     |
| `@OneToMany(() => Child, child => child.parent)` | One-to-many (parent → children)             | Parent side   | ❌       | Inverse of `@ManyToOne`                   |
| `@ManyToOne(() => Parent, parent => parent.children)` | Many-to-one (child → parent)          | Child side    | ✅       | Owns FK; should match `@OneToMany` target |
| `cascade: true`                      | Propagates save/update/delete to related rows | Any           | ❌       | Use carefully in `@ManyToOne`, `@OneToMany` |
| `eager: true`                        | Loads the relation automatically              | Any           | ❌       | Avoid overfetching large relations        |
| `@JoinColumn({ name: "..." })`       | Specifies the FK column in the database       | Owning side   | ✅       | Required in `@OneToOne`                   |
```
# saga-cqrs-outbox
