package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Category {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(
      nullable = false,
      length = 100
  )
  private String name;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "parent_id",
      foreignKey = @ForeignKey(
          name = "fk_category_parentid"
      )
  )
  private Category parent;

  @OneToMany(
      mappedBy = "parent",
      cascade = CascadeType.ALL
  )
  @Builder.Default
  private List<Category> children = new ArrayList<>();
  
  @OneToMany(mappedBy = "category")
  @Builder.Default
  private List<Product> products = new ArrayList<>();

  public Category(String name, Category parent) {
    this.name = name;
    this.parent = parent;
  }

  public void addChildren(Category child) {
    if (this.children == null) {
      this.children = new ArrayList<>();
    }
    this.children.add(child);
    child.assignParent(this);
  }

  public void assignParent(Category parent) {
    this.parent = parent;
  }
}
